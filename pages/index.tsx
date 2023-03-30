import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar/navbar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <Head>
        <title>Next wineshop</title>
        <meta name="description" content="Vinsida gjord av Johan Forsberg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <div className={styles.main}><div>Välkommen till min Vinshop!</div>
        </div>
        <div>
          <ul>
        <li className={styles.wineList} >Rött vin</li>
        <li className={styles.wineList}>Vitt vin</li>
        </ul>
        </div>
      </main>
      
    </div>
    </>
  )
}
