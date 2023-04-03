import CartStorage, { cart } from '@/components/cartstorage'
import 'bootstrap/dist/css/bootstrap.min.css';

import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export let ranOrNot = false;

export default function App({ Component, pageProps }: AppProps) {
  console.log(cart)
  if (!ranOrNot) {
    CartStorage();
    ranOrNot = true;
  }
  return <Component {...pageProps} />
}
