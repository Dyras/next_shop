import { db } from "@/components/firebase";
import Navbar from "@/components/navbar/navbar";
import { IProduct, IProductSaved } from "@/lib/iproduct";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { cart } from "@/components/cartstorage";
import { getAuth } from "firebase/auth";

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
			console.log("Calculating how many in cart");
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
		let userId = localStorage.getItem("id") || "";
		const userType = userId.length === 28 ? "Users" : "Temp_Users";
		const auth = getAuth();
		if (auth.currentUser) {
			userId = auth.currentUser?.uid || "Hmm";
			console.log("User id:", userId);
		}
		setAmount(1);
		const currentCart = cartValue;
		console.log("Adding item to cart");

		if (product != undefined) {
			console.log("Product is not undefined");
			console.log("Current cart length:", currentCart.length);
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id !== product.id && i === currentCart.length - 1) {
					currentCart.push({ ...product, amount: 1 } as IProductSaved);
					setCartValue(currentCart);
					console.log("Cart after editing:", cartValue);
					setDoc(doc(db, userType, userId), { cart: currentCart });
				}
			}
			if (currentCart.length === 0) {
				currentCart.push({ ...product, amount: 1 } as IProductSaved);
				setCartValue(currentCart);
				console.log("Cart after editing:", cartValue);
				setDoc(doc(db, userType, userId), { cart: currentCart });
			}
		}
	}

	function removeFromCart() {
		const userType = "Temp_Users";
		const userId = localStorage.getItem("id") || "";
		setAmount(0);
		const currentCart = cartValue;

		console.log("Removing item from cart");
		if (product != undefined) {
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id === product.id) {
					currentCart.splice(i, 1);
					break;
				}
			}
			setCartValue(currentCart);
			console.log("Cart after editing:", cartValue);
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
