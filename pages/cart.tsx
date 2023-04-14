import styles from "@/styles/Home.module.css";
import { useCartStore } from "@/lib/cartzustand";
import Image from "next/image";

export default function Cart() {
	const { cartStore } = useCartStore();

	return (
		<>
			<div className="flex items-center justify-center py-8">
				<div className=" sticky-0 overflow-y-auto overflow-x-hidden bg-black bg-opacity-90">
					{cartStore.length > 0 ? (
						cartStore.map((product) => (
							<div
								className="flex cursor-pointer border-gray-100 bg-gray-600 p-2 text-orange-400 hover:bg-gray-500"
								key={product.id}
							>
								{product.imageUrl && (
									<Image
										src={product.imageUrl}
										alt={product.name}
										width={100}
										height={100}
										className="w-12 p-2"
									/>
								)}
								<div className="w-32 flex-auto text-sm">
									<div className="font-bold">{product.name}</div>
									<div className="truncate">{product.articleType}</div>
									<div className="text-orange-400">{product.amount} st</div>
								</div>
							</div>
						))
					) : (
						<p>Kundkorgen är tom</p>
					)}
					<div className="">Test</div>
				</div>
			</div>
		</>
	);
}
