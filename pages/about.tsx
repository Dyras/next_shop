import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useContentfulStore } from "@/lib/contentfulzustand";

export default function About() {
	const { contentfulStore } = useContentfulStore();
	return (
		<>
			<Head>
				<title>Johans vinshop - Om oss</title>
			</Head>
			<div
				className={styles.container}
				style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
			>
				<div>
					<div className={styles.card} style={{ background: "gray" }}>
						<p>{contentfulStore?.aboutPage}</p>
					</div>
				</div>
			</div>
		</>
	);
}
