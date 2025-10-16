import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - Siem Reap",
  description: "Sign in to your Siem Reap account",
};

export default function LoginPage() {
  return (
    <AuthCard 
      title="Sign in to your account" 
      subtitle="Welcome back! Please enter your details."
    >
      <LoginForm />
    </AuthCard>
  );
}
