import { doc, getDoc, setDoc } from "firebase/firestore";
import { atom, useAtom } from "jotai";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";
import { getAuth } from "firebase/auth";

export const cart = atom<IProductSaved[]>([]);
var ranOrNot = false;

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
		if (fetchedProducts.exists()) {
			let totalLength = 0;
			for (let i = 0; i < cartValue.length; i++) {
				totalLength += cartValue[i].amount;
			}
			console.log("Cart found, fetching it");
			if (userId.length === 28 && cartValue.length != 0) {
				console.log("Updating cart for logged in user");
				await setDoc(doc(db, userType, userId), {
					cart: cartValue,
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
