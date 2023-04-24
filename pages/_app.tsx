import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Navbar from "@/components/navbar/navbar";
import { useCartStore } from "@/lib/cartzustand";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/components/firebase";

function App({ Component, pageProps }: AppProps) {
	const { cartStore, setCartStore } = useCartStore();
	const auth = getAuth();
	// If the user doesn't have an id, give them one

	useEffect(() => {
		if (!localStorage.getItem("id")) {
			localStorage.setItem("id", Math.random().toString(36).substring(2, 15));
		}

		if (auth.currentUser) {
			fetchUserCart(auth.currentUser.uid);
		} else {
			fetchUserCart(localStorage.getItem("id") || "");
		}

		async function fetchUserCart(userId: string) {
			const userType = userId.length === 28 ? "Users" : "Temp_Users";

			const fetchedProducts = await getDoc(doc(db, userType, userId));

			if (fetchedProducts.exists()) {
				if (userType === "Users" && cartStore.length > 0) {
					await setDoc(doc(db, userType, userId), {
						cart: cartStore,
					});
					await setDoc(
						doc(db, "Temp_Users", localStorage.getItem("id") || ""),
						{
							cart: [],
						}
					);
				} else {
					setCartStore(fetchedProducts.data()["cart"]);
				}
			} else {
				console.log("No cart found, creating new one");
				setCartStore([]);

				await setDoc(doc(db, userType, userId), {
					cart: [],
					firstSeen: new Date(),
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.currentUser]);

	return (
		<div>
			<Navbar></Navbar>
			<Component {...pageProps} />
		</div>
	);
}
export default App;
