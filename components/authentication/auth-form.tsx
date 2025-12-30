"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Logo from "../logo";
import EmailForm from "./email-form";

export default function AuthForm() {
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto h-[calc(100vh-40px)] overflow-hidden">
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
