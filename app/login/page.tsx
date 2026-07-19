import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | FlyRank",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your FlyRank account"
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerHref="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
}
