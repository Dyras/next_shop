import { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

const { client } = require("../lib/contentful");

export default function Home() {
	const [languageStrings, setLanguageStrings] = useState<any>([
		null,
		null,
		null,
		null,
		null,
	]);

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
					.then((data: { fields: { frontPage: string } }) => {
						setLanguageStrings(data?.fields?.frontPage);
					});
			} else {
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "en",
					})
					.then((data: { fields: { frontPage: string } }) => {
						setLanguageStrings(data?.fields?.frontPage);
					});
			}
		}
		checkLanguage();
	}, []);

	return (
		<>
			<div className={styles.container}>
				<Head>
					<title>{languageStrings[0]}</title>
					<meta name="description" content="Vinsida gjord av Johan Forsberg" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className={styles.main}>
						<div>{languageStrings[1]}</div>
					</div>
					<div>
						<ul>
							<li className={styles.wineList}>
								<Link href={"/products?filter=rott"}>{languageStrings[2]}</Link>
							</li>
							<li className={styles.wineList}>
								<Link href={"/products?filter=vitt"}>{languageStrings[3]}</Link>
							</li>
						</ul>
					</div>
				</main>
			</div>
		</>
	);
}
