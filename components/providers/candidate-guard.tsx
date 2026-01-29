"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { getProfileCompletionPercentage } from "@/api/profile";

const RESTRICTED_PATHS = ["/dashboard", "/assessments", "/jobs"];

export default function CandidateGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const checkAccess = async () => {
      const userRole = getCookie("user_role");
      setRole(userRole as string);

      if (userRole === "CANDIDATE") {
        try {
          const res = await getProfileCompletionPercentage();
          if (res) {
            const isComplete = res.total_percentage === 100;
            setIsProfileComplete(isComplete);

            // Check restriction
            const isRestrictedPath = RESTRICTED_PATHS.some((path) =>
              pathname?.startsWith(path),
            );

            if (!isComplete && isRestrictedPath) {
              router.push("/profile");
              // Don't set loading to false to keep spinner while redirecting
              return;
            }
          }
        } catch (error) {
          console.error("Error checking profile completion:", error);
        }
      }
      setLoading(false);
    };

    checkAccess();
  }, [pathname]);

  if (loading) {
    // Optional: You might want to show a spinner here,
    // or just render children and let the effect redirect (less secure/flashy).
    // Given "Candidate should not able to access", blocking is safer.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isRestrictedPath = RESTRICTED_PATHS.some((path) =>
    pathname?.startsWith(path),
  );

  // Prevent flicker: if we know they are incomplete and on a restricted path, show loader immediately
  // The useEffect will handle the redirection, but this prevents the protected content from rendering
  if (role === "CANDIDATE" && isProfileComplete === false && isRestrictedPath) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
