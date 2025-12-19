"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Logo from "../logo";
import EmailForm from "./email-form";

export default function AuthForm() {
  const [role, setRole] = useState("candidate");

  function handleRequestOtp() {
    console.log("otp");
  }

  return (
    <div className="w-1/2 flex flex-col justify-center items-center">
      <Logo />

      <Tabs
        value={role}
        onValueChange={(v) => setRole(v)}
        className="items-center"
      >
        <TabsList className="rounded-full bg-white border border-gray-200 mt-5">
          <TabsTrigger
            value="candidate"
            className="aria-selected:text-primary rounded-full"
          >
            Candidate
          </TabsTrigger>
          <TabsTrigger
            value="recruiter"
            className="aria-selected:text-primary rounded-full"
          >
            Recruiter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidate" className="mt-6">
          <EmailForm />
        </TabsContent>

        <TabsContent value="recruiter">
          <EmailForm />
        </TabsContent>
      </Tabs>

      <Button className="" onClick={handleRequestOtp}>
        Request OTP
      </Button>
    </div>
  );
}
