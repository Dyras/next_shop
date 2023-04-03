import Link from "next/link";
import styles from '../../styles/navbar.module.css'
import { useAtom } from "jotai";
import { cart } from "../cartstorage";
import { useEffect, useState } from "react";

export default function Navbar() {
	console.log("Navbar körs")
	const [cartValue] = useAtom(cart);
	const [cartTotalLength, setCartTotalLength] = useState(0);
  
	useEffect(() => {
	  console.log("cartValue", cartValue);
	  let totalLength = 0;
	  for (let i = 0; i < cartValue.length; i++) {
		totalLength += cartValue[i].amount;
	  }
	  console.log(totalLength)
	  setCartTotalLength(totalLength);
	}, [cartValue],);
  
	return (
	  <nav className={styles.nav}>
		<ul >
		  <li>
			<Link href="/">
			  Framsidan
			</Link>
		  </li>
		  <li>
			<Link href="/products">
			  Produkter
			</Link>
		  </li>
		  <li>
			<Link href="/cart">
			  Kundkorg ({cartTotalLength})
			</Link>
		  </li>
		  <li>
			<Link href="/about">
			  Om oss
			</Link>
		  </li>
		</ul>
	  </nav>
	)
  }