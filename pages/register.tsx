import { db } from "@/components/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
	return (
		<div>
			<h1>Register</h1>
			<form>
				<input
					type="email"
					placeholder="johan.forsberg@my.com"
					id="email"
					required
				/>
				<input type="password" placeholder="Lösenord" id="password" required />
				<button type="button" onClick={registerAccount}>
					Registrera dig
				</button>
			</form>
		</div>
	);
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
				.then((userCredential) => {
					const user = userCredential.user;
					setDoc(doc(db, "Users", user.uid), {
						email: user.email,
						cart: [],
						firstSeen: new Date(),
					});
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

	function validateEmail(email: string) {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
	}

	function validatePassword(password: string) {
		return password.length >= 8 ? true : false;
	}
}
