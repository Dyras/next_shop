import { useCartStore } from "@/lib/cartzustand";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Cart() {
	const { cartStore } = useCartStore();
	const [loggedIn, setLoggedIn] = useState(false);
	const router = useRouter();
	const auth = getAuth();
	function initiatePurchase() {
		console.log("Initiating purchase");
		localStorage.setItem("validPurchase", "true");
		router.push("/payment");
	}

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	function loginWarning() {
		alert("Du måste logga in!");
	}

	return (
		<>
			<div className="flex items-center justify-center py-8">
				<div className=" sticky-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-90">
					{cartStore.length > 0 ? (
						cartStore.map((product) => (
							<div
								className="flex cursor-pointer border-gray-100 bg-gray-600 p-2 text-orange-400 hover:bg-gray-500"
								key={product.id}
							>
								{product.imageUrl && (
									<Image
										src={product.imageUrl}
										alt={product.name}
										width={100}
										height={100}
										className="w-12 p-2"
									/>
								)}
								<div className="w-32 flex-auto text-sm">
									<div className="font-bold">{product.name}</div>
									<div className="truncate">
										{product.articleType === "vitt"
											? "Vitt vin"
											: product.articleType === "rott"
											? "Rött vin"
											: product.articleType === "rose"
											? "Rosévin"
											: product.articleType === "mousserande"
											? "Bubbel"
											: product.articleType === "ol"
											? "Öl"
											: product.articleType === "cider"
											? "Cider"
											: product.articleType === "sprit"
											? "Sprit"
											: product.articleType.charAt(0).toUpperCase() +
											  product.articleType.slice(1)}
									</div>
									<div className="text-orange-400">{product.amount} st</div>
								</div>
								<div className="w-18 flex flex-col items-end font-medium">
									<div className="mb-6 h-4 w-4 cursor-pointer rounded-full text-red-700 hover:bg-red-200"></div>
									{product.price} kr st
								</div>
							</div>
						))
					) : (
						<p>Kundkorgen är tom</p>
					)}
					{loggedIn ? (
						<button onClick={initiatePurchase}>Till betalning</button>
					) : (
						<button onClick={loginWarning}>Till betalning</button>
					)}
				</div>
			</div>
		</>
	);
}
