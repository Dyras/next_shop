import { doc, getDoc, setDoc } from "firebase/firestore";
import { atom, useAtom } from "jotai";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";

export const cart = atom<IProductSaved[]>([]);
var ranOrNot = false;

export default function CartStorage() {
	const [cartValue, setCartValue] = useAtom(cart);

	const fetchUserCart = async () => {
		try {
			const userId = localStorage.getItem("id") || "";
			const userType = userId.length === 22 ? "Users" : "Temp_Users";

			const fetchedProducts = await getDoc(doc(db, userType, userId));
			if (fetchedProducts.exists()) {
				console.log("Cart found, fetching it");
				setCartValue(fetchedProducts.data()["cart"]);
			} else {
				console.log("No cart found, creating new one");
				setCartValue([]);
				await setDoc(doc(db, userType, userId), {
					cart: [],
					firstSeen: new Date(),
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	if (!ranOrNot) {
		fetchUserCart();
		ranOrNot = true;
	}
}
