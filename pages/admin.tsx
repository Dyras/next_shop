import Head from "next/head";
import { IProduct } from "@/lib/iproduct";
import { useState } from "react";
const { client } = require("../lib/contentful");

export default function Admin() {
	const packagingList = {
		1: "Flaska",
		2: "Burk",
		3: "Bag-in-box",
		4: "Tetra",
		5: "Plastflaska",
		6: "Plastburk",
	};
	const [productCreated, setProductCreated] = useState(false);
	const [packaging, setPackaging] = useState("");
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
								className=" mb-1 border"
								id="price"
								placeholder="Pris"
							></input>

							<br></br>
							<input
								className="mb-1 border"
								id="category"
								placeholder="Kategori"
							></input>

							<br></br>
							<select
								className="select"
								value={packaging}
								onChange={(e) => setProductPackaging(e.target.value)}
							>
								<option value="">Välj förpackning</option>
								{Object.values(packagingList).map((value: string) => (
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
					Din produkt har skapas. Du flyttas snart till nya produktsidan!
				</div>
			</>
		);
	function addProduct() {
		const articleName = (
			document.getElementById("articleName") as HTMLInputElement
		).value;

		const category = (document.getElementById("category") as HTMLInputElement)
			.value;

		const imageUrl = (document.getElementById("imageUrl") as HTMLInputElement)
			.value;
		const price = (document.getElementById("price") as HTMLInputElement)
			.value as unknown as number;

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
		const packaging = (document.getElementById("packaging") as HTMLInputElement)
			.value;

		const random = Math.random().toString(36).substring(2, 31);

		const testObject = {
			name: stringVerification(articleName),
			price: numberVerification(price),
			packaging: stringVerification(packaging),
		};

		if (
			testObject.name === true &&
			testObject.price === true &&
			testObject.packaging === true
		) {
			console.log("Nu skickas produkten till databasen");
			const product: IProduct = {
				id: random,
				name: articleName,
				price: Number(price),
				description: description,
				articleType: category,
				country: country,
				publishedAt: new Date(),
				manufacturer: manufacturer,
				alcoholPercentage: alcoholPercentage,
				imageUrl: imageUrl,
				outOfStock: false,
				slug: random,
				packaging: packaging,
				vintage: Number(vintage),
			};

			console.log("Det som skickas", product);
			setProductCreated(true);
		} else {
			console.log("Något gick fel");
			console.log(testObject);
		}
	}

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

	function numberVerification(number: number | null) {
		if (number === null) {
			return false;
		} else {
			if (number > 0) {
				return true;
			} else {
				return false;
			}
		}
	}

	function setProductPackaging(e: string) {
		setPackaging(e);
	}
}
