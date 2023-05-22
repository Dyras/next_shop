import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { db } from "@/components/firebase";
import { useCartStore } from "@/lib/cartzustand";
import { useRouter } from "next/router";

export default function Success() {
	const [properPayment, setProperPayment] = useState<
		boolean | null | undefined
	>(undefined);
	const [div, setDiv] = useState<JSX.Element | null>(null);
	const router = useRouter();
	const { cartStore, setCartStore } = useCartStore();
	const [handledPurchase, setHandledPurchase] = useState(false);
	const auth = getAuth();
	useEffect(() => {
		const { id } = router.query;
		const auth = getAuth();
		onAuthStateChanged(auth, async (user) => {
			if (!user) return;
			if (typeof id !== "string") return;
			else {
				const paymentCheck = await getDoc(
					doc(db, "started_payments", id.toString())
				);
				if (paymentCheck.exists()) {
					if (paymentCheck.data()?.paid === false) {
						setProperPayment(true);
						setDoc(doc(db, "started_payments", id.toString()), {
							paid: true,
						});
					} else {
						setProperPayment(false);
					}
				} else {
					setProperPayment(null);
				}
			}

			if (handledPurchase === false) {
				setHandledPurchase(true);
			}
		});
	}, [router.query]);

	useEffect(() => {
		async function historyHandler() {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) return;
			if (cartStore.length === 0) return;

			const currentHistory = await getDoc(
				doc(db, "Purchase_History", user.uid)
			);
			if (currentHistory.exists()) {
				updateDoc(doc(db, "Purchase_History", user.uid), {
					history: arrayUnion({
						id: Math.random().toString(36).substring(2, 31),
						items: cartStore,
						totalCost: cartStore.reduce((a, b) => (a = +b.price * b.amount), 0),
						totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
						date: new Date(),
					}),
				});
				setDoc(doc(db, "Users", user.uid), {
					cart: [],
				});
				setCartStore([]);
			} else {
				let totalCost = 0;
				for (let i = 0; i < cartStore.length; i++) {
					totalCost;
				}

				setDoc(doc(db, "Purchase_History", user.uid), {
					history: arrayUnion({
						id: Math.random().toString(36).substring(2, 31),
						items: cartStore,
						totalCost: cartStore.reduce((a, b) => (a = +b.price * b.amount), 0),
						totalAmount: cartStore.reduce((a, b) => a + b.amount, 0),
						date: new Date(),
					}),
				});
				setDoc(doc(db, "Users", user.uid), {
					cart: [],
				});
				setCartStore([]);
			}
		}
		historyHandler();

		if (properPayment) {
			setDiv(
				<div>
					<h1>Betalning lyckades!</h1>
					<p>Du kommer få ett mail med dina varor inom kort.</p>
				</div>
			);
		} else if (properPayment === undefined) {
			setDiv(
				<div>
					<h1>Läser in betalningsinfo...</h1>
				</div>
			);
		} else if (properPayment === null) {
			setDiv(
				<div>
					<h1>Betalning misslyckades!</h1>
					<p>Var god försök igen.</p>
				</div>
			);
		} else if (properPayment === false)
			setDiv(
				<div>
					<h1>Ordern är redan betald!</h1>
				</div>
			);
	}, [cartStore, properPayment, setCartStore]);

	return div;
}
