"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Logo from "../logo";
import EmailForm from "./email-form";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const getInitialRole = (): "CANDIDATE" | "RECRUITER" => {
    if (tabParam === "recruiter") return "RECRUITER";
    if (tabParam === "candidate") return "CANDIDATE";
    return "CANDIDATE";
  };

  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">(getInitialRole);

  // Update role when URL parameter changes
  useEffect(() => {
    if (tabParam === "recruiter") {
      setRole("RECRUITER");
    } else if (tabParam === "candidate") {
      setRole("CANDIDATE");
    }
  }, [tabParam]);

  return (
    <div className="flex flex-col justify-start md:justify-center items-center w-full max-w-md mx-auto md:h-[calc(100vh-60px)] overflow-hidden">
      {/* Beta Notice Banner */}
      <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-amber-800 font-semibold text-sm text-center">
          🚧 TechSmartHire is currently in Beta
        </p>
        <p className="text-amber-700 text-xs text-center mt-1">
          We're rolling out features in phases. Join our programs now and enjoy early-bird advantage with higher profile visibility and ranking in the Talent Pool.
        </p>
      </div>

      <Logo />

      <Tabs
        value={role}
        onValueChange={(v) => setRole(v as "CANDIDATE" | "RECRUITER")}
        className="items-center w-full"
      >
        <TabsList className="rounded-full bg-white border border-gray-200 mt-5">
          <TabsTrigger
            value="CANDIDATE"
            className="aria-selected:text-primary rounded-full"
          >
            Candidate
          </TabsTrigger>
          <TabsTrigger
            value="RECRUITER"
            className="aria-selected:text-primary rounded-full"
          >
            Recruiter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="CANDIDATE" className="mt-6 w-full">
          <EmailForm role="CANDIDATE" />
        </TabsContent>

        <TabsContent value="RECRUITER" className="mt-6 w-full">
          <EmailForm role="RECRUITER" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
