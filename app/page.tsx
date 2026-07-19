import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>FlyRank Capstone</p>
        <h1>Welcome to FlyRank</h1>
        <p className={styles.subtitle}>
          Track rankings, manage your profile, and get started with your account.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/login">
            Log in
          </Link>
          <Link className={styles.secondaryButton} href="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
