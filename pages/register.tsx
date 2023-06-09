import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Head from "next/head";
import { IProductSaved } from "@/lib/iproduct";
import { db } from "@/components/firebase";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useRouter } from "next/router";

export default function Register() {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const { contentfulStore } = useContentfulStore();

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});
	}, []);

	if (!isLoggedIn) {
		return (
			<div>
				<Head>
					<title>Johans vinshop - Registrering</title>
				</Head>
				<form>
					<input
						type="email"
						placeholder="johan.forsberg@my.com"
						id="email"
						required
					/>
					<input
						type="password"
						placeholder={contentfulStore?.registerLoginPage[3]}
						id="password"
						required
					/>
					<button type="button" onClick={registerAccount}>
						{contentfulStore?.registerLoginPage[0]}
					</button>
				</form>
			</div>
		);
	} else {
		return (
			<div>
				<Head>
					<title>Johans vinshop - Registrering</title>
				</Head>
				<h1>{contentfulStore?.registerLoginPage[1]}</h1>
			</div>
		);
	}
}

function registerAccount() {
	const emailElement = document.getElementById("email") as HTMLInputElement;
	const passwordElement = document.getElementById(
		"password"
	) as HTMLInputElement;

	if (emailElement && passwordElement) {
		const email = emailElement.value;
		const password = passwordElement.value;

		if (validateEmail(email) && validatePassword(password)) {
			console.log("Email and password are valid");

			const auth = getAuth();
			createUserWithEmailAndPassword(auth, email, password)
				.then(async (userCredential) => {
					const user = userCredential.user;
					const tempCart = await getDoc(
						doc(db, "Temp_Users", localStorage.getItem("id") || "")
					);
					let defaultCart: IProductSaved[] = [];
					if (tempCart.exists()) {
						defaultCart = tempCart.data()["cart"];
					}

					setDoc(doc(db, "Users", user.uid), {
						email: user.email,
						cart: defaultCart,
						firstSeen: new Date(),
						admin: false,
					});
					setDoc(doc(db, "Purchase_History", user.uid), {
						history: [],
					});
					const router = useRouter();
					router.push("/");
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					// ..
				});
		} else if (!validateEmail(email)) {
			console.log("Email is invalid");
		} else if (!validatePassword(password)) {
			console.log("Password is invalid");
		}
	}
}
export function validateEmail(email: string) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}

export function validatePassword(password: string) {
	return password.length >= 8 ? true : false;
}
