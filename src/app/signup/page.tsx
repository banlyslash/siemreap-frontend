import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create Account - Siem Reap",
  description: "Create a new Siem Reap account",
};

export default function SignupPage() {
  return (
    <AuthCard 
      title="Create an account" 
      subtitle="Join Siem Reap to get started"
    >
      <SignupForm />
    </AuthCard>
  );
}
