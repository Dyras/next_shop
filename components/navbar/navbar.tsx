import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useCartAmount } from "@/lib/cartzustandamount";
import { useCartStore } from "@/lib/cartzustand";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";

export default function Navbar() {
	const { cartAmount, setCartAmount } = useCartAmount();
	const { cartStore } = useCartStore();
	const { login, setLogin } = useLogin();

	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(<div onClick={useLogOut}>Logga ut</div>);
				setLogin(true);
			} else {
				setIsLoggedIn(
					<div>
						<Link href={"/login"}>Logga in</Link>
					</div>
				);
				setLogin(false);
			}
		});
		function useLogOut() {
			auth.signOut();
			router.push("/");
		}
	}, [router, setLogin]);

	useEffect(() => {
		function howManyInCartNav() {
			let totalLength = 0;
			for (let i = 0; i < cartStore.length; i++) {
				totalLength += cartStore[i].amount;
			}
			setCartAmount(totalLength);
			console.log("Cart amount:", cartAmount);
		}
		howManyInCartNav();
	}, [cartStore.length, cartStore, setCartAmount, cartAmount]);

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
							{cartAmount > 0 ? cartAmount : null}
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
