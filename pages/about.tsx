import Navbar from "@/components/navbar/navbar";
import styles from '@/styles/Home.module.css'


export default function About() {
    return (
        <>
            <Navbar />
            <div className={styles.container} style={{display: "flex", justifyContent: "center", marginTop: '10px'}}>
                <div>
                    <div className={styles.card} style={{background: 'gray'}}>
                        <h2>Om oss</h2>
                        <p>Det här är ett (fiktivt) företag som säljer olika viner!</p>
                    </div>
                </div>
            </div>
        </>
    )
}