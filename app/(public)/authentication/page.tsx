import { Suspense } from "react";
import AuthForm from "@/components/authentication/auth-form";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
