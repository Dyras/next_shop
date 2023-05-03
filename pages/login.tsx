import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { validateEmail, validatePassword } from "./register";
import { useEffect, useState } from "react";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";

export default function Login() {
	const { login, setLogin } = useLogin();
	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(<div>Du är redan inloggad!</div>);
			} else {
				setIsLoggedIn(
					<div>
						<h1>Logga in</h1>
						<form>
							<input
								type="email"
								placeholder="johan.forsberg@my.com"
								id="email"
								required
							/>
							<input
								type="password"
								placeholder="Lösenord"
								id="password"
								required
							/>
							<button type="button" onClick={loginAccount}>
								Logga in
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
