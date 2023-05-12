import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import { useCartStore } from "@/lib/cartzustand";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useRouter } from "next/router";

export default function Cart() {
	const { cartStore } = useCartStore();
	const [loggedIn, setLoggedIn] = useState(false);
	const router = useRouter();
	const { contentfulStore } = useContentfulStore();

	const auth = getAuth();
	function initiatePurchase() {
		localStorage.setItem("validPurchase", "true");
		router.push("/payment");
	}

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
			}
		});
	}, []);

	function loginWarning() {
		alert("Du måste logga in!");
	}

	return (
		<>
			<Head>
				<title>Johans vinshop - Varukorg</title>
			</Head>
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
											? contentfulStore?.cartPage[2]
											: product.articleType === "rott"
											? contentfulStore?.cartPage[3]
											: product.articleType === "rose"
											? contentfulStore?.cartPage[4]
											: product.articleType === "mousserande"
											? contentfulStore?.cartPage[5]
											: product.articleType === "ol"
											? contentfulStore?.cartPage[6]
											: product.articleType === "cider"
											? contentfulStore?.cartPage[7]
											: product.articleType === "sprit"
											? contentfulStore?.cartPage[8]
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
						<p>{contentfulStore?.cartPage[0]}</p>
					)}
					{loggedIn && cartStore.length > 0 ? (
						<button onClick={initiatePurchase}>
							{contentfulStore?.cartPage[1]}
						</button>
					) : !loggedIn && cartStore.length > 0 ? (
						<button onClick={loginWarning}>
							{contentfulStore?.cartPage[1]}
						</button>
					) : null}
				</div>
			</div>
		</>
	);
}
