import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";
import { getAuth } from "firebase/auth";
import { cart } from "@/lib/cartatom";

export default function CartStorage() {
	const [cartValue, setCartValue] = useAtom(cart);

	const auth = getAuth();
	auth.onAuthStateChanged((user) => {
		console.log("Cart value:", cartValue);
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
		// For some reason the Jotai atom is always [] on this page
		// Until I figure out why, I'm using a workaround using two getDoc calls
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
				setCartValue(fetchedProducts.data()["cart"]);
			}
		} else {
			console.log("No cart found, creating new one");
			setCartValue([]);
			await setDoc(doc(db, userType, userId), {
				cart: [],
				firstSeen: new Date(),
			});
		}
	};
}
