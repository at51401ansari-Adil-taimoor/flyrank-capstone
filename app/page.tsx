import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.logo}>FR</div>
        <h1 className={styles.title}>FlyRank Capstone</h1>
        <p className={styles.description}>
          Front-end AI Engineering capstone project. Get started with your
          account.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.secondaryButton}>
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
