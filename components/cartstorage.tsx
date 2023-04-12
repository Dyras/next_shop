import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";
import { getAuth } from "firebase/auth";
import { useCartStore } from "@/lib/cartzustand";
import { useEffect } from "react";
import { useCartAmount } from "@/lib/cartzustandamount";

export default function CartStorage() {
	const { cartStore, setCartStore } = useCartStore();
	const { cartAmount } = useCartAmount();
	const auth = getAuth();

	useEffect(() => {
		console.log("***Cart store:", cartStore);
	}, [cartStore, auth.currentUser, cartAmount]);

	auth.onAuthStateChanged((user) => {
		if (user) {
			console.log("Fetching user cart for logged in user");
			fetchUserCart(user.uid);
		} else {
			console.log("Fetching user cart for non-logged in user");
			fetchUserCart(localStorage.getItem("id") || "");
		}
	});

	async function fetchUserCart(userId: string) {
		const userType = userId.length === 28 ? "Users" : "Temp_Users";

		const fetchedProducts = await getDoc(doc(db, userType, userId));

		let tempProducts: IProductSaved[] = [];
		if (userType === "Users") {
			tempProducts =
				(
					await getDoc(doc(db, "Temp_Users", localStorage.getItem("id") || ""))
				).data()?.cart || [];
		}
		if (fetchedProducts.exists()) {
			if (userType === "Users" && tempProducts.length > 0) {
				await setDoc(doc(db, userType, userId), {
					cart: tempProducts,
				});
				await setDoc(doc(db, "Temp_Users", localStorage.getItem("id") || ""), {
					cart: [],
				});
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
}
