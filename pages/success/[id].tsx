import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/components/firebase";
import { useRouter } from "next/router";

export default function Success() {
	const [properPayment, setProperPayment] = useState<boolean | null>(null);
	const [div, setDiv] = useState<JSX.Element | null>(null);
	const router = useRouter();

	useEffect(() => {
		async function checkProperPayment() {
			const { id } = router.query;
			console.log(id);
			if (typeof id !== "string") return;
			else {
				const paymentCheck = await getDoc(doc(db, "started_payments", id));
				if (paymentCheck.exists()) {
					setProperPayment(true);
					if (paymentCheck.data()?.paid === false) {
						setProperPayment(true);
					}
				} else {
					setProperPayment(false);
				}
			}
		}

		checkProperPayment();
	}, [router.query]);

	useEffect(() => {
		if (properPayment)
			setDiv(
				<div>
					<h1>Betalning lyckades!</h1>
					<p>Du kommer få ett mail med dina varor inom kort.</p>
				</div>
			);
		else if (properPayment === false)
			setDiv(
				<div>
					<h1>Betalning misslyckades!</h1>
					<p>Var god försök igen.</p>
				</div>
			);
	}, [properPayment]);

	return div;
}
