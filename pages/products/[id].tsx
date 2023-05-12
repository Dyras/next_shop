import { IProduct, IProductSaved } from "@/lib/iproduct";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/components/firebase";
import { getAuth } from "firebase/auth";
import { useCartCounter } from "@/lib/cartcounter";
import { useCartStore } from "@/lib/cartzustand";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useRouter } from "next/router";

export default function SingleProduct() {
	const router = useRouter();

	const [product, setProduct] = useState<IProduct | null>(null);
	const [amount, setAmount] = useState(0);

	const { cartStore, setCartStore } = useCartStore();
	const { count, increment } = useCartCounter();
	const { contentfulStore } = useContentfulStore();

	useEffect(() => {
		if (amount > 1) {
			const auth = getAuth();
			let userId = localStorage.getItem("id") || "";
			if (auth.currentUser) {
				userId = auth.currentUser?.uid || "";
			}
			const userType = userId.length === 28 ? "Users" : "Temp_Users";
			const currentCart = cartStore;
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id === product?.id) {
					currentCart[i].amount = amount;
					break;
				}
			}
			setCartStore(currentCart);
			setDoc(doc(db, userType, userId), { cart: currentCart });
			increment();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amount]);

	useEffect(() => {
		const getProduct = async () => {
			const { id } = router.query;

			if (typeof id !== "string") return;

			const docRef = doc(db, "products", id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setProduct(docSnap.data() as IProduct);
			} else {
				router.push("/404");
			}
		};
		getProduct();
	}, [router.query]);

	useEffect(() => {
		function howManyInCart() {
			for (let i = 0; i < cartStore.length; i++) {
				if (cartStore[i].id === product?.id) {
					setAmount(cartStore[i].amount);
					break;
				}
			}
		}
		howManyInCart();
	}, [cartStore, product]);

	// Add the product to the cart and send it to Firestore
	function addtoCart() {
		let userId = localStorage.getItem("id") || "";
		const auth = getAuth();
		if (auth.currentUser) {
			userId = auth.currentUser?.uid || "";
		}
		const userType = userId.length === 28 ? "Users" : "Temp_Users";
		setAmount(1);
		const currentCart = cartStore;

		if (product != undefined) {
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id !== product.id && i === currentCart.length - 1) {
					currentCart.push({ ...product, amount: 1 } as IProductSaved);
					setCartStore(currentCart);
					setDoc(doc(db, userType, userId), { cart: currentCart });
				}
			}
			if (currentCart.length === 0) {
				currentCart.push({ ...product, amount: 1 } as IProductSaved);
				setCartStore(currentCart);
				setDoc(doc(db, userType, userId), { cart: currentCart });
			}
		}
	}

	function removeFromCart() {
		let userId = localStorage.getItem("id") || "";
		const auth = getAuth();
		if (auth.currentUser) {
			userId = auth.currentUser?.uid || "";
		}
		const userType = userId.length === 28 ? "Users" : "Temp_Users";
		setAmount(0);
		const currentCart = cartStore;

		if (product != undefined) {
			for (let i = 0; i < currentCart.length; i++) {
				if (currentCart[i].id === product.id) {
					currentCart.splice(i, 1);
					break;
				}
			}
			setCartStore(currentCart);
			setDoc(doc(db, userType, userId), { cart: currentCart });
		}
	}

	if (!product) return null;

	return (
		<div>
			<div>{product.name}</div>
			{amount != 0 ? (
				<div>
					<div>
						{amount} {contentfulStore?.productPage[2]}
					</div>
					<select
						className="select"
						value={amount}
						onChange={(e) => setAmount(parseInt(e.target.value))}
					>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
					</select>
					<button onClick={removeFromCart}>
						{contentfulStore?.productPage[1]}
					</button>
				</div>
			) : (
				<button onClick={addtoCart}>{contentfulStore?.productPage[0]}</button>
			)}
		</div>
	);
}
