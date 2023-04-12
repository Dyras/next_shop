import { create } from "zustand";

interface ILogin {
	login: boolean;
	setLogin: (login: boolean) => void;
}

export const useLogin = create<ILogin>((set) => ({
	login: false,
	setLogin: (login: boolean) => set({ login: login }),
}));
