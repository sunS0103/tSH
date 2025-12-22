"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next/client";
import RegisterForm from "@/components/authentication/register-form";

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    role: "candidate" | "recruiter";
    email: string;
  } | null>(null);

  useEffect(() => {
    const email = getCookie("register_email") as string;
    const role = getCookie("register_role") as "candidate" | "recruiter";

    if (!email || !role) {
      // No registration data found, redirect back to authentication
      router.push("/authentication");
      return;
    }

    Promise.resolve().then(() => {
      setData({ email, role });
    });
  }, [router]);

  // Clear cookies after successful registration
  const handleRegistrationComplete = () => {
    deleteCookie("register_email");
    deleteCookie("register_role");
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <RegisterForm
      role={data.role}
      email={data.email}
      onComplete={handleRegistrationComplete}
    />
  );
}
