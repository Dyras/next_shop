import { db } from "@/components/firebase";
import { IProduct } from "@/lib/iproduct";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export async function GetProduct(){
    const router = useRouter();
    const { id } = router.query;
    if (typeof id !== "string") return null;
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data() as IProduct);
        return docSnap.data() as IProduct;
    }
    else {
        console.log("No such document!");
        return null;
    }
}

export default function SingleProduct(){
    const product = GetProduct();
    
    if (!product) return (<div>Produkten hittades inte</div>);
        return (
            <div>
        <div>Produkten hittades</div>
        <div>{product.id}</div>
        <div>{product.name}</div>
        <div>{product.manufacturer}</div>
        </div>
)    }