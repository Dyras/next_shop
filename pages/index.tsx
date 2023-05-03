import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<div className={styles.container}>
				<Head>
					<title>Next wineshop</title>
					<meta name="description" content="Vinsida gjord av Johan Forsberg" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className={styles.main}>
						<div>Välkommen till min Vinshop!</div>
					</div>
					<div>
						<ul>
							<li className={styles.wineList}>
								<Link href={"/products?filter=rott"}>Rött vin</Link>
							</li>
							<li className={styles.wineList}>
								<Link href={"/products?filter=vitt"}>Vitt vin</Link>
							</li>
						</ul>
					</div>
				</main>
			</div>
		</>
	);
}
