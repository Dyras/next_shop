import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { atom, useAtom } from "jotai";
import { cart } from "@/lib/cartatom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export const loginState = atom<boolean | undefined>(undefined);

export default function Navbar() {
	const [cartValue] = useAtom(cart);
	const [cartTotalLength, setCartTotalLength] = useState(0);

	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const [, setLoginStateValue] = useAtom(loginState);

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(<div onClick={logOut}>Logga ut</div>);
				setLoginStateValue(true);
			} else {
				setIsLoggedIn(
					<div>
						<Link href={"/login"}>Logga in</Link>
					</div>
				);
				setLoginStateValue(false);
			}

			function logOut() {
				auth.signOut();
			}
		});
	}, [setLoginStateValue]);

	useEffect(() => {
		function howManyInCartNav() {
			let totalLength = 0;
			for (let i = 0; i < cartValue.length; i++) {
				totalLength += cartValue[i].amount;
			}
			setCartTotalLength(totalLength);
		}
		howManyInCartNav();
	}, [cartValue.length, cartValue]);

	// Check if user is logged in

	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link href="/">Framsidan</Link>
				</li>
				<li>
					<Link href="/products">Produkter</Link>
				</li>
				<li>
					<Link href="/cart">
						Kundkorg
						<div className="top-0 start-90 translate-bottom badge rounded-pill bg-danger">
							{cartTotalLength > 0 ? cartTotalLength : null}
						</div>
					</Link>
				</li>
				<li>
					<Link href="/about">Om oss</Link>
				</li>
				<li>{isLoggedIn}</li>
			</ul>
		</nav>
	);
}
