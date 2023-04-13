import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Navbar from "@/components/navbar/navbar";
import { useCartStore } from "@/lib/cartzustand";
import { getAuth } from "firebase/auth";
import { useCartAmount } from "@/lib/cartzustandamount";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { IProductSaved } from "@/lib/iproduct";

export let ranOrNot = false;

function App({ Component, pageProps }: AppProps) {
	const { cartStore, setCartStore } = useCartStore();
	const { cartAmount } = useCartAmount();
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
			// eslint-disable-next-line react-hooks/rules-of-hooks

			const userType = userId.length === 28 ? "Users" : "Temp_Users";

			const fetchedProducts = await getDoc(doc(db, userType, userId));

			if (fetchedProducts.exists()) {
				console.log("Cartstore and length 2:", cartStore, cartStore.length);
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
	}, [auth.currentUser]);

	return (
		<div>
			<Navbar></Navbar>
			<Component {...pageProps} />
		</div>
	);
}
export default App;
