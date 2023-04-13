import { create } from "zustand";

interface ICartCounter {
	count: number;
	increment: () => void;
}

export const useCartCounter = create<ICartCounter>()((set) => ({
	count: 0,
	increment: () =>
		set((state: { count: number }) => ({ count: state.count + 1 })),
}));
