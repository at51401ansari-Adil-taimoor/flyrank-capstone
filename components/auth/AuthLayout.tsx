import Link from "next/link";
import styles from "./auth.module.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            Fly<span className={styles.logoAccent}>Rank</span>
          </p>
          <p className={styles.tagline}>Front-end AI Engineering Capstone</p>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        {children}

        <p className={styles.footer}>
          {footerText}{" "}
          <Link href={footerHref}>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  );
}
