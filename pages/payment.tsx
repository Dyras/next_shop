import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Head from "next/head";
import { db } from "@/components/firebase";
import { getAuth } from "firebase/auth";
import { useCartStore } from "@/lib/cartzustand";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useRouter } from "next/router";

export default function Payment() {
	const [validPurchase, setValidPurchase] = useState<Boolean | null>(null);
	const { cartStore, setCartStore } = useCartStore();
	const [handledPurchase, setHandledPurchase] = useState(false);
	const router = useRouter();
	const { contentfulStore } = useContentfulStore();

	useEffect(() => {
		if (localStorage.getItem("validPurchase") == "true") {
			setValidPurchase(true);
		} else {
			setValidPurchase(false);
		}
	}, []);

	console.log("validPurchase:", validPurchase);
	if (validPurchase == true && handledPurchase == false) {
		localStorage.setItem("validPurchase", "false");
		return (
			<div>
				<Head>
					<title>Johans vinshop - {contentfulStore?.paymentPage[0]}</title>
				</Head>
				<h1>{contentfulStore?.paymentPage[0]}</h1>
				<form>
					<input
						type="text"
						placeholder="Kortnummer"
						id="cardnumber"
						required
					/>
					<input type="text" placeholder="MM/ÅÅ" id="expirydate" required />
					<input type="text" placeholder="CVC" id="cvc" required />
					<button type="button" onClick={pay}>
						{contentfulStore?.paymentPage[1]}
					</button>
				</form>
			</div>
		);
	} else if (validPurchase == false && handledPurchase == false) {
		setTimeout(() => {
			router.push("/cart");
		}, 2000);
		return (
			<div>
				<h1>{contentfulStore?.paymentPage[2]}</h1>
			</div>
		);
	} else if (validPurchase == null) {
		return <div></div>;
	} else if (handledPurchase == true) {
		return (
			<div>
				<h1>{contentfulStore?.paymentPage[3]}</h1>
			</div>
		);
	} else {
		console.log("Else");
		return <div></div>;
	}

	async function pay() {
		const auth = getAuth();
		const user = auth.currentUser;
		const cardNumberElement = document.getElementById(
			"cardnumber"
		) as HTMLInputElement;
		const expiryDateElement = document.getElementById(
			"expirydate"
		) as HTMLInputElement;
		const cvcElement = document.getElementById("cvc") as HTMLInputElement;

		if (user?.uid) {
			if (cardNumberElement && expiryDateElement && cvcElement) {
				const currentHistory = await getDoc(
					doc(db, "Purchase_History", user.uid)
				);

				if (currentHistory.exists()) {
					console.log("History exists");
					updateDoc(doc(db, "Purchase_History", user.uid), {
						history: arrayUnion({
							id: Math.random().toString(36).substring(2, 31),
							items: cartStore,
							totalCost: cartStore.reduce((a, b) => a + b.price, 0),
							totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
							date: new Date(),
						}),
					});
					setDoc(doc(db, "Users", user.uid), {
						cart: [],
					});
					setCartStore([]);
				} else {
					console.log("History does not exist");

					setDoc(doc(db, "Purchase_History", user.uid), {
						history: arrayUnion({
							id: Math.random().toString(36).substring(2, 31),
							items: cartStore,
							totalCost: cartStore.reduce(
								(a, b) => (a = +b.price * b.amount),
								0
							),
							totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
							date: new Date(),
						}),
					});
					setDoc(doc(db, "Users", user.uid), {
						cart: [],
					});
					setCartStore([]);
				}
				setHandledPurchase(true);
				setTimeout(() => {}, 200);
			}
		} else {
			console.log("You are not logged in!");
		}
	}
}
