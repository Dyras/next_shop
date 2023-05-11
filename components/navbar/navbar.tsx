import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Link from "next/link";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import styles from "../../styles/Navbar.module.css";
import { useCartAmount } from "@/lib/cartzustandamount";
import { useCartCounter } from "@/lib/cartcounter";
import { useCartStore } from "@/lib/cartzustand";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";

const { client } = require("../../lib/contentful");

export default function Navbar() {
	const { cartAmount, setCartAmount } = useCartAmount();
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
		// Check user locale

		async function checkLanguage() {
			const locale = window.navigator.language;
			if (locale.startsWith("sv")) {
				// Get entry 645bikC48FQqmGFdc9Iejv
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "sv",
					})
					.then((data: { fields: { navbar: string } }) => {
						setLanguageStrings(data?.fields?.navbar);
					});
			} else {
				await client
					.getEntry("40tbz5JrFGf79QTZjsxvbF", {
						locale: "en",
					})
					.then((data: { fields: { navbar: string } }) => {
						setLanguageStrings(data?.fields?.navbar);
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
					console.log(docSnap);
					if (docSnap.exists()) {
						setAdmin(<div>Admin</div>);
						console.log("admin");
					} else {
						setAdmin(null);
						console.log("not admin");
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
					<Link href="/">{languageStrings[0]}</Link>
				</li>
				<li>
					<Link href="/products">{languageStrings[1]}</Link>
				</li>
				<li>
					<Link href="/cart">
						{languageStrings[2]}
						{cartAmount > 0 ? (
							<div className="mr-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-red-100">
								{cartAmount}
							</div>
						) : null}
					</Link>
				</li>
				<li>
					<Link href="/about">{languageStrings[3]}</Link>
				</li>
				{login ? (
					<li>
						<Link href="/history">{languageStrings[6]}</Link>
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
