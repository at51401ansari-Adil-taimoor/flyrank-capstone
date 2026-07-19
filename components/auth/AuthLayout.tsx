import Link from "next/link";
import styles from "./auth.module.css";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: React.ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthLayoutProps) {
  return (
    <main className={styles.authPage}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>FR</div>
          <span className={styles.brandName}>FlyRank</span>
        </div>

        <h1 className={styles.heading}>{title}</h1>
        <p className={styles.subheading}>{subtitle}</p>

        {children}

        <p className={styles.footer}>
          {footerText}{" "}
          <Link href={footerHref}>{footerLinkText}</Link>
        </p>
      </div>
    </main>
  );
}
