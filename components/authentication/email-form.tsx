"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { sendOtp, verifyOtp } from "@/api/auth";
import { toast } from "sonner";

interface EmailFormProps {
  role: "candidate" | "recruiter";
}

// Regex to block common free email providers for recruiter
const FREE_EMAIL_DOMAINS =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|msn|aol|icloud|me|mac|protonmail|pm|zoho|yandex|gmx|mail)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/i;

// Company email validation - must NOT be a free email provider
const isCompanyEmail = (email: string) => {
  return !FREE_EMAIL_DOMAINS.test(email);
};

const createEmailSchema = (role: "candidate" | "recruiter") => {
  return z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .refine(
        (email) => {
          if (role === "recruiter") {
            return isCompanyEmail(email);
          }
          return true;
        },
        {
          message: "Please use your official company email.",
        }
      ),
  });
};

type FormStep = "email" | "otp";

export default function EmailForm({ role }: EmailFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("email");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const emailSchema = createEmailSchema(role);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const onRequestOtp = async (data: z.infer<typeof emailSchema>) => {
    await sendOtp(data.email)
      .then((response) => {
        if (response.success) {
          toast.success(
            response.message || "OTP sent successfully to your email"
          );
          setStep("otp");
          setTimer(59);
          setCanResend(false);
          setOtp("");
        } else {
          toast.error(response.message || "Failed to send OTP");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to send OTP");
      });
  };

  const onResendOtp = useCallback(async () => {
    if (!canResend) return;

    await sendOtp(form.getValues("email"))
      .then((response) => {
        if (response.success) {
          toast.success(
            response.message || "OTP sent successfully to your email"
          );
          setTimer(59);
          setCanResend(false);
          setOtp("");
        } else {
          toast.error(response.message || "Failed to resend OTP");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to resend OTP");
      });
  }, [canResend, form]);

  const onVerifyOtp = async () => {
    if (otp.length !== 4) return;

    const email = form.getValues("email");

    await verifyOtp(email, otp)
      .then((response) => {
        if (response.success) {
          toast.success(response.message || "OTP verified successfully");
          setCookie("register_email", email);
          setCookie("register_role", role);

          if (response.is_registered) {
            router.push("/");
          } else {
            router.push("/authentication/register");
          }
        } else {
          toast.error(response.message || "Failed to verify OTP");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to verify OTP");
      });
  };

  return (
    <div className="flex flex-col items-center max-w-105 mx-auto">
      <h1 className="text-xl text-primary-500 font-bold">Start Your Journey</h1>
      <p className="text-gray-600 text-xs text-center mt-1">
        Set up your account to begin your journey and <br /> manage your
        assessments.
      </p>

      <Button variant="outline" className="mt-6 px-5">
        <Icon icon="flat-color-icons:google" />
        <span className="text-sm">Continue With Google</span>
      </Button>

      <div className="my-4 w-full flex items-center gap-3">
        <div className="bg-gray-400 w-full h-px" />
        <span>OR</span>
        <div className="bg-gray-400 w-full h-px" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onRequestOtp)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email ID</Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your email"
                      className="mt-2"
                      id="email"
                      type="email"
                      disabled={step === "otp"}
                      {...field}
                    />
                    {step === "otp" && (
                      <Icon
                        icon="material-symbols:edit-outline-rounded"
                        className="size-4 absolute right-2 top-4.5 cursor-pointer"
                        onClick={() => {
                          setStep("email");
                          setOtp("");
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {step === "otp" && (
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    pattern={REGEXP_ONLY_DIGITS}
                    inputMode="numeric"
                  >
                    <InputOTPGroup className="gap-1">
                      <InputOTPSlot
                        index={0}
                        className="size-8 rounded-lg border border-gray-900 first:border-l"
                      />
                      <InputOTPSlot
                        index={1}
                        className="size-8 rounded-lg border border-gray-900"
                      />
                      <InputOTPSlot
                        index={2}
                        className="size-8 rounded-lg border border-gray-900"
                      />
                      <InputOTPSlot
                        index={3}
                        className="size-8 rounded-lg border border-gray-900 last:rounded-r-lg"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {timer > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-900">
                    <Icon icon="lineicons:stopwatch" className="size-3.5" />
                    <span>{formatTime(timer)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "email" && (
            <Button type="submit" className="w-full">
              Request OTP
            </Button>
          )}

          {step === "otp" && (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onResendOtp}
                disabled={!canResend}
              >
                Resend OTP
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={onVerifyOtp}
                disabled={otp.length !== 4}
              >
                Verify
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
