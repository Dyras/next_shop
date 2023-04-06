import CartStorage from "@/components/cartstorage";
import "bootstrap/dist/css/bootstrap.min.css";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export let ranOrNot = false;

export default function App({ Component, pageProps }: AppProps) {
	// If the user doesn't have an id, give them one
	useEffect(() => {
		if (!localStorage.getItem("id")) {
			localStorage.setItem("id", Math.random().toString(36).substring(2, 15));
		}
	}, []);

	if (!ranOrNot) {
		CartStorage();
		ranOrNot = true;
	}
	return <Component {...pageProps} />;
}
