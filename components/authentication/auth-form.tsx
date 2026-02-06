"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Lock, ArrowRight } from "lucide-react";
import Logo from "../logo";
import EmailForm from "./email-form";

// TEMPORARY: Flip to `false` to restore recruiter login
const RECRUITER_INVITE_ONLY = true;

export default function AuthForm() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const hasAccess = searchParams.get("access") === "true";

  const getInitialRole = (): "CANDIDATE" | "RECRUITER" => {
    if (tabParam === "recruiter") return "RECRUITER";
    if (tabParam === "candidate") return "CANDIDATE";
    return "CANDIDATE";
  };

  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">(getInitialRole);

  // Update role when URL parameter changes
  useEffect(() => {
    if (tabParam === "recruiter") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole("RECRUITER");
    } else if (tabParam === "candidate") {
      setRole("CANDIDATE");
    }
  }, [tabParam]);

  return (
    <div className="flex flex-col justify-start md:justify-center items-center w-full max-w-md mx-auto md:min-h-[calc(100vh-60px)]">
      {/* Beta Notice Banner */}
      <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-amber-800 font-semibold text-sm text-center">
          🚧 TechSmartHire is currently in Beta
        </p>
        <p className="text-amber-700 text-xs text-center mt-1">
          We&apos;re rolling out features in phases. Join our programs now and
          enjoy early-bird advantage with higher profile visibility and ranking
          in the Talent Pool.
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
          {/* TEMPORARY: Set to false to restore recruiter login */}
          {RECRUITER_INVITE_ONLY && !hasAccess ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-50 px-3 py-1 rounded-full mb-4">
                Invite Only
              </span>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Recruiter Access is by Invitation
              </h2>

              <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
                We&apos;re onboarding recruiters in phases during our beta to
                ensure the best hiring experience. Request an invite to get
                early access to our skill-verified talent pool.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                Request invite and take early advantage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <EmailForm role="RECRUITER" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
