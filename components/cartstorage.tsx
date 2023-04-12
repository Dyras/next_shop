import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";
import { getAuth } from "firebase/auth";
import { useCartStore } from "@/lib/cartzustand";
import { useEffect } from "react";

export default function CartStorage() {
	const { cartStore, setCartStore } = useCartStore();

	useEffect(() => {
		console.log("Cart store:", cartStore);
	}, [cartStore]);

	const auth = getAuth();
	auth.onAuthStateChanged((user) => {
		if (user) {
			console.log("Fetching user cart for logged in user");
			fetchUserCart(user.uid);
		} else {
			console.log("Fetching user cart for non-logged in user");
			fetchUserCart(localStorage.getItem("id") || "");
		}
	});

	const fetchUserCart = async (userId: string) => {
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
			console.log("Cart found, fetching it");
			if (userType === "Users" && tempProducts.length > 0) {
				console.log("Updating cart for logged in user");
				await setDoc(doc(db, userType, userId), {
					cart: tempProducts,
				});
				await setDoc(doc(db, "Temp_Users", localStorage.getItem("id") || ""), {
					cart: [],
				});
			} else {
				setCartStore(fetchedProducts.data()["cart"]);
				console.log("Cart store:", cartStore);
			}
		} else {
			console.log("No cart found, creating new one");
			setCartStore([]);

			await setDoc(doc(db, userType, userId), {
				cart: [],
				firstSeen: new Date(),
			});
		}
	};
}
