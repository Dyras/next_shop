import { cart } from "@/components/cartstorage";
import Navbar from "@/components/navbar/navbar";
import styles from "@/styles/Home.module.css";
import { useAtom } from "jotai";

export default function Cart() {
	const [cartValue] = useAtom(cart);

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<div className={styles.grid}>
					<div className={styles.card}>
						<h2>Kundkorg</h2>
						<div>
							{cartValue.length > 0 ? (
								cartValue.map((item) => (
									<div key={item.id}>
										<p>{item.name}</p>
										<p>{item.amount}</p>
									</div>
								))
							) : (
								<p>Kundkorgen är tom</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
