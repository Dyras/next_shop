import { IProductSaved } from "./iproduct";
import { create } from "zustand";

interface ICartStore {
	cartStore: IProductSaved[];
	setCartStore: (cart: IProductSaved[]) => void;
}

export const useCartStore = create<ICartStore>()((set) => ({
	cartStore: [] as IProductSaved[],
	setCartStore: (cart: IProductSaved[]) => set({ cartStore: cart }),
}));
