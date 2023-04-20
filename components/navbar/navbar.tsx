import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useCartAmount } from "@/lib/cartzustandamount";
import { useCartStore } from "@/lib/cartzustand";
import { useLogin } from "@/lib/cartzustandlogin";
import { useRouter } from "next/router";
import { useCartCounter } from "@/lib/cartcounter";

export default function Navbar() {
	const { cartAmount, setCartAmount } = useCartAmount();
	const { cartStore } = useCartStore();
	const { setLogin } = useLogin();
	const { count } = useCartCounter();

	const [isLoggedIn, setIsLoggedIn] = useState(<div></div>);
	const router = useRouter();

	useEffect(() => {
		console.log("Recounting navbar number:", cartStore);
		console.log("Recounting navbar length:", cartStore.length);

		let totalLength = 0;
		for (let i = 0; i < cartStore.length; i++) {
			totalLength += cartStore[i].amount;
		}
		setCartAmount(totalLength);
		console.log("Cart amount:", cartAmount);
	}, [cartAmount, cartStore, cartStore.length, setCartAmount, count]);

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
						{cartAmount > 0 ? (
							<div className="mr-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-red-100">
								{cartAmount}
							</div>
						) : null}
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
