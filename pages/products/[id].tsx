import { db } from "@/components/firebase";
import Navbar from "@/components/navbar/navbar";
import { IProduct, IProductSaved } from "@/lib/iproduct";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { cart } from "@/components/cartstorage";

export default function SingleProduct() {
	const router = useRouter();
	const [product, setProduct] = useState<IProduct | null>(null);
	const [cartValue, setCartValue] = useAtom(cart);
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		const getProduct = async () => {
			const { id } = router.query;

			if (typeof id !== "string") return;

			const docRef = doc(db, "products", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data() as IProduct);
				setProduct(docSnap.data() as IProduct);
			} else {
				console.log("Document not found!");
				setProduct(null);
			}
		};
		getProduct();
	}, [router.query]);

	useEffect(() => {
		function howManyInCart() {
			for (let i = 0; i < cartValue.length; i++) {
				if (cartValue[i].id === product?.id) {
					setAmount(cartValue[i].amount);
					break;
				}
			}
		}
		howManyInCart();
	}, [cartValue, product]);

	// Add the product to the cart and send it to Firestore
	function addtoCart() {
		const userType = "Users";
		const userId = "qs3bAnzIM8hGzI5c3bueGOweL8E3";
		setAmount(1);
		const currentCart = cartValue;

		if (product != undefined) {
			currentCart.push({ ...product, amount: 1 } as IProductSaved);
			setCartValue(currentCart);
			setDoc(doc(db, userType, userId), { cart: currentCart });
		}
	}

	function removeFromCart() {
		const userType = "Users";
		const userId = "qs3bAnzIM8hGzI5c3bueGOweL8E3";
		setAmount(0);
		const currentCart = cartValue;

		if (product != undefined) {
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id === product.id) {
					currentCart.splice(i, 1);
					break;
				}
			}
			setCartValue(currentCart);
			setDoc(doc(db, userType, userId), { cart: currentCart });
		}
	}

	if (!product) return <Navbar />;

	return (
		<div>
			<Navbar />
			<div>Produkten hittades</div>
			<div>{product.name}</div>
			{amount != 0 ? (
				<div>
					<div>{amount} i kundkorgen</div>
					<button onClick={removeFromCart}>Ta bort</button>
				</div>
			) : (
				<button onClick={addtoCart}>Köp</button>
			)}
		</div>
	);
}
