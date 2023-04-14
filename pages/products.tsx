import { db } from "@/components/firebase";
import {
	collection,
	DocumentData,
	getDocs,
	query,
	Query,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/products.module.css";
import Link from "next/link";
import { IProduct } from "@/lib/iproduct";
import router, { useRouter } from "next/router";

export default function Products() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [filter, setFilter] = useState("");
	const router = useRouter();

	// Set "filter" to the query parameter
	// If no query parameter, set "filter" to "all"
	useEffect(() => {
		if (router.query.filter) {
			setFilter(router.query.filter as string);
		} else {
			setFilter("all");
		}
	}, [router.query.filter]);

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
			<div>
				<h1>Filter</h1>
				<button onClick={() => clickHandler("all")}>Alla</button>
				<button onClick={() => clickHandler("rott")}>Rött</button>
				<button onClick={() => clickHandler("vitt")}>Vitt</button>
				<button onClick={() => clickHandler("rose")}>Rosé</button>
				<button onClick={() => clickHandler("mousserande")}>Bubbel</button>
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
}

async function getFirestoreDocs(filter: string) {
	const Products: IProduct[] = [];
	let queryData: Query<DocumentData>;

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
