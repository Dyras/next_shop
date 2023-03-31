import Navbar from "@/components/navbar/navbar";
import styles from '@/styles/Home.module.css'


export default function Cart(){
return (
    <>
    <Navbar />
    <div className={styles.container}>
        <div className={styles.grid}>
            <div className={styles.card}>
                <h2>Kundvagn</h2>
                <p>Det finns inga produkter i din kundvagn.</p>
            </div>
        </div>
    </div>
    </>
)

}