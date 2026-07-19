import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Join FlyRank to start tracking your progress."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
}
