import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useAtom } from "jotai";
import { cart } from "../cartstorage";
import { useEffect, useState } from "react";

export default function Navbar() {
	const [cartValue] = useAtom(cart);
	const [cartTotalLength, setCartTotalLength] = useState(0);

	useEffect(() => {
		console.log("cartValue", cartValue);
		let totalLength = 0;
		for (let i = 0; i < cartValue.length; i++) {
			totalLength += cartValue[i].amount;
		}
		console.log(totalLength);
		setCartTotalLength(totalLength);
	}, [cartValue]);

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
			</ul>
		</nav>
	);
}
