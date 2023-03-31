import { db } from "@/components/firebase";
import Navbar from "@/components/navbar/navbar";
import { IProduct } from "@/lib/iproduct";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SingleProduct() {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      const { id } = router.query;
      
      if (typeof id !== "string") return;

      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data() as IProduct);
        setProduct(docSnap.data() as IProduct);
      } else {
        console.log("Document not found!");
        setProduct(null);
      }
    };

    getProduct();
  }, [router.query]);

  if (!product) return <div><Navbar />
  Produkten hittades inte</div>;

  return (
    <div>
        <Navbar />
      <div>Produkten hittades</div>
      <div>{product.name}</div>
    </div>
  );
}
