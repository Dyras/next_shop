import { db } from "@/components/firebase"
import Navbar from "@/components/navbar/navbar";
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react";
import Image from 'next/image';
import styles from '@/styles/products.module.css'


export default function Products() {
const [products, setProducts] = useState<IProduct[]>([])

    useEffect(() => {
    getFirestoreDocs()
    .then((data) => {
        setProducts(data)
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })
}, [])

    return(
<>
<Navbar />
<div className={styles.container}>
    <div className={styles.grid}>
      {products.map((product) => (
        <div key={product.id} className={styles.card}>
          <div className={styles.imageContainer} style={{ position: 'relative' }}>
            {product.imageUrl && (
              <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} />
            )}
          </div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
    </div>
</>
)
}
export interface IProduct {
    id: string;
    name: string;
    manufacturer?: string;
    description?: string;
    articleType: string;
    country?: string;
    price: number;
    rating?: number;
    imageUrl?: string;
    outOfStock: boolean;
    slug: string;
    publishedAt?: Date;
    packaging: string;
    vintage?: number;
  }
async function getFirestoreDocs() {
    const Products: IProduct[] = []
    const docRef = await getDocs(collection(db, "products"))
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            Products.push({
                id: doc.id,
                name: doc.data().name,
                manufacturer: doc.data().manufacturer,
                description: doc.data().description,
                articleType: doc.data().articleType,
                country: doc.data().country,
                price: doc.data().price,
                rating: doc.data().rating,
                imageUrl: doc.data().imageUrl,
                outOfStock: doc.data().outOfStock,
                slug: doc.data().slug,
                publishedAt: doc.data().publishedAt,
                packaging: doc.data().packaging,
                vintage: doc.data().vintage
            })
        });
    })
.catch((error) => {
    console.log("Error getting document:", error);
})
if (Products.length > 0){
    return Products;
} else {
    return [];
}
}


