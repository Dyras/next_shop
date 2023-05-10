import "firebase/firestore";

import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Head from "next/head";
import { IProductSaved } from "@/lib/iproduct";
import { db } from "@/components/firebase";
import { getAuth } from "firebase/auth";

export default function History() {
	interface History {
		items: IProductSaved[];
		id: string;
		// Firestore date
		date: Date;
		totalAmount: number;
		totalCost: number;
	}

	const auth = getAuth();
	const user = auth.currentUser;
	const [history, setHistory] = useState<History[]>([]);
	useEffect(() => {
		async function fetchData() {
			let userId = user?.uid || "";
			if (userId == "") {
				userId = localStorage.getItem("id") || "";
			}
			const historyFetch = await getDoc(
				doc(db, "Purchase_History", userId)
			).then((doc) => {
				if (doc.exists()) {
					const history = doc.data()["history"];

					return history;
				} else {
					return [];
				}
			});
			if (historyFetch == undefined) {
				console.log("historyFetch is undefined");
			} else {
				setHistory(historyFetch);
			}
		}

		fetchData();
	}, [auth.currentUser, user?.uid]);

	function parseDate(timeDate: any) {
		const date = new Date(timeDate.toDate());

		return date.toLocaleString("sv-SE");
	}
	return (
		<div>
			<Head>
				<title>Johans vinshop - Historik</title>
			</Head>
			<h1>Historik</h1>
			{history.map((product) => (
				<div key={product.id}>
					<p>{parseDate(product.date)}</p>
					{product.items.map((item) => (
						<div key={item.id}>
							<p>{item.name}</p>
							<p>{item.amount}</p>
							<p>{item.price}</p>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
