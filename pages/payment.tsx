import { db } from "@/components/firebase";
import { useCartStore } from "@/lib/cartzustand";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Payment() {
	const [validPurchase, setValidPurchase] = useState(false);
	const { cartStore } = useCartStore();

	useEffect(() => {
		if (localStorage.getItem("validPurchase") !== "false") {
			setValidPurchase(true);
		}
	}, []);

	console.log("validPurchase:", validPurchase);
	if (validPurchase == true) {
		localStorage.setItem("validPurchase", "false");
		return (
			<div>
				<h1>Betala</h1>
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
						Betala
					</button>
				</form>
			</div>
		);
	} else {
		return (
			<div>
				<h1>Du har inte gjort någon beställning</h1>
			</div>
		);
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

				if (currentHistory) {
					updateDoc(doc(db, "Purchase_History", user.uid), {
						history: arrayUnion({
							id: Math.random().toString(36).substring(2, 31),
							items: cartStore,
							totalCost: cartStore.reduce((a, b) => a + b.price, 0),
							totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
							date: new Date(),
						}),
					});
				} else {
					setDoc(doc(db, "Purchase_History", user.uid), {
						history: arrayUnion({
							id: Math.random().toString(36).substring(2, 31),
							items: cartStore,
							totalCost: cartStore.reduce((a, b) => a + b.price, 0),
							totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
							date: new Date(),
						}),
					});
				}
			}
		} else {
			console.log("You are not logged in!");
		}
	}
}