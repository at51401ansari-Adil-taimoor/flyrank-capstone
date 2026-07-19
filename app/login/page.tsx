import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Log in"
      subtitle="Access your FlyRank account to continue."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerHref="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
}
