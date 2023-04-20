import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Payment() {
	let checkIfValidPurchase = "false";
	const router = useRouter();

	useEffect(() => {
		if (checkIfValidPurchase !== "true") {
			router.push("/");
		}
	}, [checkIfValidPurchase, router]);

	console.log("Payment page");
	try {
		checkIfValidPurchase = localStorage.getItem("validPurchase") || "false";
	} catch (error) {
		console.log("Error in payment.tsx:", error);
	}
	if (checkIfValidPurchase === null) {
		checkIfValidPurchase = "false";
	}

	console.log("checkIfValidPurchase:", checkIfValidPurchase);
	if (checkIfValidPurchase == "true") {
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
	}

	function pay() {
		localStorage.setItem("validPurchase", "false");
		router.push("/history");
	}
}
