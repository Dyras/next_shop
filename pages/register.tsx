import { db } from "@/components/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { IProductSaved } from "@/lib/iproduct";

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
}
export function validateEmail(email: string) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}

export function validatePassword(password: string) {
	return password.length >= 8 ? true : false;
}