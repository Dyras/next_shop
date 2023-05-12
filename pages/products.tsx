import {
	DocumentData,
	Query,
	collection,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import Head from "next/head";
import { IProduct } from "@/lib/iproduct";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/components/firebase";
import styles from "@/styles/products.module.css";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useRouter } from "next/router";

const { client } = require("../lib/contentful");

export default function Products() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [filter, setFilter] = useState("");
	const router = useRouter();
	const [title, setTitle] = useState("");
	const { contentfulStore } = useContentfulStore();
	const [languageStrings, setLanguageStrings] = useState<any>([
		null,
		null,
		null,
		null,
		null,
	]);

	// Set "filter" to the query parameter
	// If no query parameter, set "filter" to "all"

	useEffect(() => {
		if (router.query.filter) {
			setFilter(router.query.filter as string);
		} else {
			setFilter("all");
		}
	}, [router.query.filter]);

	useEffect(() => {
		// Check user locale

		async function checkLanguage() {
			const locale = window.navigator.language;
			if (locale.startsWith("sv")) {
				// Get entry 645bikC48FQqmGFdc9Iejv
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "sv",
					})
					.then((data: { fields: { productsPage: string } }) => {
						setLanguageStrings(data?.fields?.productsPage);
					});
			} else {
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "en",
					})
					.then((data: { fields: { productsPage: string } }) => {
						setLanguageStrings(data?.fields?.productsPage);
					});
			}
		}
		checkLanguage();
	}, []);

	// Check if the filter has been updated
	// Then fetch from Firestore
	useEffect(() => {
		if (filter !== "") {
			getFirestoreDocs(filter)
				.then((data) => {
					setProducts(data);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [filter]);

	// Handle the filter buttons being clicked
	function clickHandler(choice: string) {
		setFilter(choice);
		if (choice !== "all") {
			router.push({
				query: { filter: choice },
			});
		} else {
			const query = { ...router.query };
			delete query.filter;
			router.push({
				query,
			});
		}
	}

	return (
		<>
			<Head>
				<title>Johans vinshop - {title}</title>
			</Head>
			<div className="flex justify-center pt-8">
				<div>
					<button
						className="focus:shadow-outline m-2 h-8 rounded-lg bg-orange-500 px-4 text-sm text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
						onClick={() => clickHandler("all")}
					>
						{contentfulStore?.productsPage[0]}
					</button>
					<button
						className="focus:shadow-outline m-2 h-8 rounded-lg bg-orange-500 px-4 text-sm text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
						onClick={() => clickHandler("rott")}
					>
						{contentfulStore?.productsPage[1]}
					</button>
					<button
						className="focus:shadow-outline m-2 h-8 rounded-lg bg-orange-500 px-4 text-sm text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
						onClick={() => clickHandler("vitt")}
					>
						{contentfulStore?.productsPage[2]}
					</button>
					<button
						className="focus:shadow-outline m-2 h-8 rounded-lg bg-orange-500 px-4 text-sm text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
						onClick={() => clickHandler("rose")}
					>
						{contentfulStore?.productsPage[3]}
					</button>
					<button
						className="focus:shadow-outline m-2 h-8 rounded-lg bg-orange-500 px-4 text-sm text-indigo-100 transition-colors duration-150 hover:bg-indigo-800"
						onClick={() => clickHandler("mousserande")}
					>
						{contentfulStore?.productsPage[4]}
					</button>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.grid}>
					{products.map((product) => (
						<div key={product.id} className={styles.card}>
							<div
								className={styles.imageContainer}
								style={{ position: "relative" }}
							>
								{product.imageUrl && (
									<Image
										src={product.imageUrl}
										alt={product.name}
										fill
										style={{ objectFit: "contain" }}
										sizes="(max-width: 400px) 100vw,
                                        (max-width: 400px) 50vw, 33vw"
									/>
								)}
							</div>
							<Link href={`/products/${product.id}`}>
								<h2>{product.name}</h2>
							</Link>
							<p>{product.description}</p>
						</div>
					))}
				</div>
			</div>
		</>
	);

	async function getFirestoreDocs(filter: string) {
		const Products: IProduct[] = [];
		let queryData: Query<DocumentData>;
		titleChooser(filter as string);

		if (filter === "all") {
			queryData = query(collection(db, "products"));
		} else {
			queryData = query(
				collection(db, "products"),
				where("articleType", "==", filter)
			);
		}

		await getDocs(queryData)
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// Push everything into the Products array
					Products.push({
						id: doc.id,
						name: doc.data().name,
						manufacturer: doc.data().manufacturer,
						description: doc.data().description,
						articleType: doc.data().articleType,
						country: doc.data().country,
						price: doc.data().price,
						rating: doc.data().rating,
						imageUrl: doc.data().imageUrl,
						outOfStock: doc.data().outOfStock,
						slug: doc.data().slug,
						publishedAt: doc.data().publishedAt,
						packaging: doc.data().packaging,
						vintage: doc.data().vintage,
					});
				});
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
		if (Products.length > 0) {
			return Products;
		} else {
			return [];
		}
	}
	function titleChooser(filter: string) {
		let title = "";
		switch (filter) {
			case "all":
				title = "Alla viner";
				break;
			case "rott":
				title = "Röda viner";
				break;
			case "vitt":
				title = "Vita viner";
				break;
			case "rose":
				title = "Roséviner";
				break;
			case "mousserande":
				title = "Mousserande viner";
				break;
			default:
				title = "Alla viner";
				break;
		}
		setTitle(title);
	}
}
