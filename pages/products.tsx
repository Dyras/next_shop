import { db } from "@/components/firebase"
import Navbar from "@/components/navbar/navbar";
import { collection, DocumentData, getDocs, query, Query, QuerySnapshot, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import Image from 'next/image';
import styles from '@/styles/products.module.css'
import Link from "next/link";
import { IProduct } from "@/lib/iproduct";


export default function Products() {
const [products, setProducts] = useState<IProduct[]>([])
let filter = 'all'
    useEffect(() => {
    getFirestoreDocs(filter)
    .then((data) => {
        setProducts(data)
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })
}, [filter])

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
          <Link href={`/products/${product.id}`}>
          <h2>{product.name}</h2>
            </Link>
          <p>{product.description}</p>

        </div>
      ))}
    </div>
    </div>
</>
)
}

async function getFirestoreDocs(filter: string) {
    const Products: IProduct[] = []
    let queryData: Query<DocumentData>
if (filter === 'all') {
    queryData = query(collection(db, "products"))
} else {
    queryData = query(collection(db, "products"), where("articleType", "==", filter));
}

    const docRef = await getDocs(queryData)
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Push everything into the Products array
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


