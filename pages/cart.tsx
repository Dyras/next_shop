import styles from "@/styles/Home.module.css";
import { useCartStore } from "@/lib/cartzustand";

export default function Cart() {
	const { cartStore } = useCartStore();

	return (
		<>
			<div className={styles.container}>
				<div className={styles.grid}>
					<div className={styles.card}>
						<h2>Kundkorg</h2>
						<div>
							{cartStore.length < 1 ? (
								<p>Läser in varukorg</p>
							) : cartStore.length > 0 ? (
								cartStore.map((item) => (
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
