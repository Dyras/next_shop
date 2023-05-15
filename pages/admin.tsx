import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Head from "next/head";
import { IProduct } from "@/lib/iproduct";
import Stripe from "stripe";
import { db } from "@/components/firebase";
import { getAuth } from "firebase/auth";
import router from "next/router";

export default function Admin() {
	const packagingList = {
		1: "Flaska",
		2: "Burk",
		3: "Bag-in-box",
		4: "Tetra",
		5: "Plastflaska",
		6: "Plastburk",
	};
	const typeList = {
		1: "Vitt",
		2: "Rött",
		3: "Rosé",
		4: "Mousserande",
		5: "Söt cider",
		6: "Torr cider",
		7: "Öl",
		8: "Alkoholfritt",
	};
	const [productCreated, setProductCreated] = useState(false);
	const [packaging, setPackaging] = useState("");
	const [productType, setProductType] = useState("");
	const [admin, setAdmin] = useState<boolean | null>(null);
	const auth = getAuth();
	const user = auth.currentUser;

	useEffect(() => {
		const checkAdmin = async () => {
			if (user !== null) {
				const docRef = doc(db, "admins", user?.uid);
				const docSnap = await getDoc(docRef);
				console.log(docSnap);
				if (docSnap.exists()) {
					setAdmin(true);
				} else {
					setAdmin(false);
				}
			}
		};
		checkAdmin();
	}, [user]);

	if (admin) {
		if (!productCreated)
			return (
				<>
					<Head>
						<title>Johans vinshop - Admin</title>
					</Head>
					<div>
						<div className="mt-12 flex justify-center">
							<form>
								<input
									className="mb-1 border"
									id="articleName"
									placeholder="Artikelnamn"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="price"
									placeholder="Pris"
								></input>
								<br></br>
								<select
									className="select"
									value={packaging}
									onChange={(e) => setPackaging(e.target.value)}
								>
									<option value="">Välj förpackning</option>
									{Object.values(packagingList).map((value: string) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</select>
								<br></br>
								<select
									className="select"
									value={productType}
									onChange={(e) => setProductType(e.target.value)}
								>
									<option value="">Välj produkttyp</option>
									{Object.values(typeList).map((value: string) => (
										<option key={value} value={value}>
											{value}
										</option>
									))}
								</select>
								<br></br>
								<input
									className="mb-1 border"
									id="releaseDate"
									placeholder="Släppdatum"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="manufacturer"
									placeholder="Tillverkare"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="alcoholPercentage"
									placeholder="Alkoholhalt"
								></input>
								<br></br>
							</form>

							<form>
								<input
									className="mb-1 border"
									id="imageUrl"
									placeholder="Bildlänk"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="description"
									placeholder="Beskrivning"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="country"
									placeholder="Land"
								></input>
								<br></br>
								<input
									className="mb-1 border"
									id="vintage"
									placeholder="Årgång"
								></input>
							</form>
						</div>
						<div className="flex justify-center">
							<button onClick={addProduct}>Lägg till produkt</button>
						</div>
					</div>
				</>
			);
		else
			return (
				<>
					<Head>
						<title>Johans vinshop - Admin</title>
					</Head>
					<div>
						Din produkt har skapats. Du flyttas snart till nya produktsidan!
					</div>
				</>
			);
	} else if (admin == false) {
		router.push("/");
		return (
			<>
				<Head>
					<title>Johans vinshop - Admin</title>
				</Head>
			</>
		);
	} else {
		return (
			<>
				<Head>
					<title>Johans vinshop - Admin</title>
				</Head>
			</>
		);
	}

	// Function for adding a product to the database
	async function addProduct() {
		// Segment for getting the user input

		const articleName = (
			document.getElementById("articleName") as HTMLInputElement
		).value;
		const category = productType;
		let imageUrl = (document.getElementById("imageUrl") as HTMLInputElement)
			.value;
		const price = (document.getElementById("price") as HTMLInputElement)
			.value as string;
		const description = (
			document.getElementById("description") as HTMLInputElement
		).value;
		const country = (document.getElementById("country") as HTMLInputElement)
			.value;
		const manufacturer = (
			document.getElementById("manufacturer") as HTMLInputElement
		).value;
		const alcoholPercentage = (
			document.getElementById("alcoholPercentage") as HTMLInputElement
		).value as unknown as number;
		const vintage = (document.getElementById("vintage") as HTMLInputElement)
			.value as unknown as number;
		const packagingType = packaging;
		// Generate a random string for the product id and slug

		console.log(slugGenerator(category || "alkoholdryck"));

		const newPrice = Number(price.replace(",", ".").replace(":", "."));
		const testObject = {
			name: stringVerification(articleName),
			price: numberVerification(newPrice),
			packagingType: stringVerification(packagingType),
		};

		if (
			testObject.name === true &&
			testObject.price === true &&
			testObject.packagingType === true
		) {
			let endWhile = true;
			let random = "";
			while (endWhile) {
				random = Math.random().toString(36).substring(2, 31);

				await getDoc(doc(db, "products", random)).then((docSnap) => {
					if (docSnap.exists()) {
						console.log("Produktens ID finns redan. Skapar nytt ID.");
					} else {
						console.log("Produktens ID är unikt");
						endWhile = false;
					}
				});
			}

			if (imageUrl === "") {
				imageUrl = "https://pic8.co/sh/3SwSx0.png";
			}

			const product: IProduct = {
				id: random,
				name: articleName,
				price: Number(newPrice),
				description: description,
				articleType: category,
				articleTypeSlug: slugGenerator(category || "alkoholdryck"),
				country: country,
				publishedAt: new Date(),
				manufacturer: manufacturer,
				alcoholPercentage: alcoholPercentage,
				imageUrl: imageUrl,
				outOfStock: false,
				slug: slugGenerator(articleName),
				packaging: packagingType,
				vintage: Number(vintage),
			};

			setDoc(doc(db, "products", random), product);
			addToStripe(product);
			setProductCreated(true);
		} else {
			console.log("Something went wrong");
			console.log(testObject);
		}
	}

	async function addToStripe(product: IProduct) {
		const stripe = require("stripe")(
			"sk_test_51Mng5vAtLJGeuFzBE3JC5DVVdD5pSHr8OstzQr9zt9Sy8ufIsBiHFsMnY3dj4T5lSxVq9y2GkC5I5Jeqr9kv5B2Q00jWH277Jb"
		);

		const productToSend = await stripe.products
			.create({
				name: product.name,
				id: product.id,
				images: [product.imageUrl],
				default_price_data: {
					unit_amount: product.price * 100,
					currency: "sek",
				},
			})
			.then((product: any) => {
				console.log("Product created in Stripe", product);
			})
			.catch((error: any) => {
				console.log("Error creating product in Stripe", error);
			});

		console.log("Product to send", productToSend);
	}

	// Verify that it's a valid string
	function stringVerification(text: string | null) {
		if (text === null) {
			return false;
		} else {
			if (text.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	}

	// Verifies that the number is a valid number
	function numberVerification(number: number | null) {
		if (number === null) {
			return false;
		} else {
			// 3 is the minimum price for Stripe
			if (number >= 3) {
				return true;
			} else {
				return false;
			}
		}
	}

	// Cleans up the slug before returning it
	function slugGenerator(string: string) {
		return (string = string
			.toLowerCase()
			.replaceAll("å", "a")
			.replaceAll("ä", "a")
			.replaceAll("ö", "o")
			.replaceAll(" ", "-")
			.replaceAll(",", "")
			.replaceAll("é", "e")
			.replaceAll("á", "a")
			.replaceAll("à", "a")
			.replaceAll("'", "")
			.replaceAll(":", "")
			.replaceAll("!", "")
			.replaceAll("&", "")
			.replaceAll('"', "")
			.replaceAll("(", "")
			.replaceAll(")", "")
			.replaceAll("?", ""));
	}
}
