import Link from "next/link";
import styles from '../../styles/navbar.module.css'

export default function Navbar() {
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
			  Kundkorg
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