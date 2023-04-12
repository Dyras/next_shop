import { create } from "zustand";

interface ICartAmount {
	cartAmount: number;
	setCartAmount: (amount: number) => void;
}
export const useCartAmount = create<ICartAmount>()((set) => ({
	cartAmount: 0,
	setCartAmount: (amount: number) => set({ cartAmount: amount }),
}));
