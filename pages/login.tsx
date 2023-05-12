import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { validateEmail, validatePassword } from "./register";

import Head from "next/head";
import { useContentfulStore } from "@/lib/contentfulzustand";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";

export default function Login() {
	const { login, setLogin } = useLogin();
	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const router = useRouter();
	const { contentfulStore } = useContentfulStore();

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(
					<div>
						<Head>
							<title>Johans vinshop - Logga in</title>
						</Head>
						{contentfulStore.registerLoginPage[1]}
					</div>
				);
			} else {
				setIsLoggedIn(
					<div>
						<Head>
							<title>Johans vinshop - Logga in</title>
						</Head>
						<h1>{contentfulStore.registerLoginPage[2]}</h1>
						<form>
							<input
								type="email"
								placeholder="johan.forsberg@my.com"
								id="email"
								required
							/>
							<input
								type="password"
								placeholder={contentfulStore.registerLoginPage[3]}
								id="password"
								required
							/>
							<button type="button" onClick={loginAccount}>
								{contentfulStore.registerLoginPage[2]}
							</button>
						</form>
					</div>
				);
			}
		});
	}, [login]);

	return (
		<>
			<div>{isLoggedIn}</div>
		</>
	);

	function loginAccount() {
		const emailElement = document.getElementById("email") as HTMLInputElement;
		const passwordElement = document.getElementById(
			"password"
		) as HTMLInputElement;

		if (emailElement && passwordElement) {
			const email = emailElement.value;
			const password = passwordElement.value;

			if (validateEmail(email) && validatePassword(password)) {
				signInWithEmailAndPassword(getAuth(), email, password)
					.then((userCredential) => {
						const user = userCredential.user;
						// Send the user to the home page
						router.push("/");
					})
					.catch((error) => {
						const errorCode = error.code;

						if (errorCode === "auth/wrong-password") {
							alert("Fel lösenord");
						} else if (errorCode === "auth/user-not-found") {
							alert("Användaren finns inte");
						}
					});
			}
		}
	}
}
