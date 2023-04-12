import { create } from "zustand";
import { IProductSaved } from "./iproduct";

interface ICartStore {
	cartStore: IProductSaved[];
	setCartStore: (cart: IProductSaved[]) => void;
}

export const useCartStore = create<ICartStore>()((set) => ({
	cartStore: [] as IProductSaved[],
	setCartStore: (cart: IProductSaved[]) => set({ cartStore: cart }),
}));
