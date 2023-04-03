import { doc, getDoc } from "firebase/firestore";
import { atom, useAtom } from "jotai";
import { db } from "./firebase";
import { IProductSaved } from "@/lib/iproduct";

export const cart = atom<IProductSaved[]>([]);
var ranOrNot = false;

export default function CartStorage() {
    const [cartValue, setCartValue] = useAtom(cart);
    console.log(ranOrNot);
  
    const handleClick = async () => {
      try {
        const fetchedProducts = await getDoc(
          doc(db, "Users", "qs3bAnzIM8hGzI5c3bueGOweL8E3")
        );
        if (fetchedProducts.exists()) {
          console.log(
            "Data fetched in cartstorage.tsx",
            fetchedProducts.data()["cart"]
          );
          setCartValue(fetchedProducts.data()["cart"]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (!ranOrNot) {
      handleClick();
      ranOrNot = true;
    }
    }
  