import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | FlyRank",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join FlyRank to get started"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerHref="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
}
