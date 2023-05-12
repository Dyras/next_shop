import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { ContentfulFields } from "@/lib/contentfulzustand";
import Link from "next/link";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import styles from "../../styles/Navbar.module.css";
import { useCartAmount } from "@/lib/cartzustandamount";
import { useCartCounter } from "@/lib/cartcounter";
import { useCartStore } from "@/lib/cartzustand";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";

const { client } = require("../../lib/contentful");

export default function Navbar() {
	const { cartAmount, setCartAmount } = useCartAmount();
	const { contentfulStore, setContentfulStore } = useContentfulStore();
	const { cartStore } = useCartStore();
	const { login, setLogin } = useLogin();
	const { count } = useCartCounter();
	const [admin, setAdmin] =
		useState<React.ReactElement<HTMLDivElement> | null>();

	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const router = useRouter();
	const [languageStrings, setLanguageStrings] = useState<any>([
		null,
		null,
		null,
		null,
		null,
		null,
	]);

	useEffect(() => {
		async function checkLanguage() {
			const locale = window.navigator.language;
			if (locale.startsWith("sv")) {
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "sv",
					})
					.then((data: { fields: ContentfulFields }) => {
						setContentfulStore(data.fields);
						console.log("Data:", data);
						console.log("Contentful store:", contentfulStore);
					});
			} else {
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "en",
					})
					.then((data: { fields: ContentfulFields }) => {
						setContentfulStore(data.fields);
						console.log("Data:", data);
						console.log("Data fields:", data.fields);

						console.log("Contentful store:", contentfulStore);
					});
			}
		}
		checkLanguage();
	}, []);

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				{
					const docRef = doc(db, "admins", user?.uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						setAdmin(<div>Admin</div>);
					} else {
						setAdmin(null);
					}
				}
			} else {
				setAdmin(null);
			}
		});
	}, []);

	useEffect(() => {
		let totalLength = 0;
		for (let i = 0; i < cartStore.length; i++) {
			totalLength += cartStore[i].amount;
		}
		setCartAmount(totalLength);
	}, [cartAmount, cartStore, cartStore.length, setCartAmount, count]);

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(<div onClick={useLogOut}>{languageStrings[5]}</div>);
				setLogin(true);
			} else {
				setIsLoggedIn(
					<div>
						<Link href={"/login"}>{languageStrings[4]}</Link>
					</div>
				);
				setLogin(false);
			}
		});
		function useLogOut() {
			auth.signOut();
			router.push("/");
		}
	}, [router, setLogin, languageStrings]);

	// Check if user is logged in

	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link href="/">{contentfulStore?.navbar[0]}</Link>
				</li>
				<li>
					<Link href="/products">{contentfulStore?.navbar[1]}</Link>
				</li>
				<li>
					<Link href="/cart">
						{contentfulStore?.navbar[2]}
						{cartAmount > 0 ? (
							<div className="mr-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-red-100">
								{cartAmount}
							</div>
						) : null}
					</Link>
				</li>
				<li>
					<Link href="/about">{contentfulStore?.navbar[3]}</Link>
				</li>
				{login ? (
					<li>
						<Link href="/history">{contentfulStore?.navbar[6]}</Link>
					</li>
				) : null}
				{admin ? (
					<li>
						<Link href="/admin">{admin}</Link>
					</li>
				) : null}
				<li>{isLoggedIn}</li>
			</ul>
		</nav>
	);
}
