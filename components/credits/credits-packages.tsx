"use client";

import { cn, sanitizeHtml } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  getCurrentPlan,
  initiateCreditPurchase,
  verifyCreditPurchase,
  verifyPurchaseStatus,
} from "@/api/payment";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";

interface CreditPackage {
  tier: string;
  title: string;
  description: string;
  price: string;
  points: string[];
  benefits?: string[];
  buttonText: string;
  packageType: "TIER_1" | "TIER_2" | "TIER_3";
}

export interface CurrentPlanResponse {
    id: string;
    "plan_type": "TIER_1" | "TIER_2" | "TIER_3";
    "name":  string;
    "description": string;
    "initial_amount": number;
    "deferred_amount": number;
    "total_amount": number;
    "currency": string;
    "is_deferred_required": false,
    "is_active": boolean;
    "display_order": number;
    "created_at": string;
    "updated_at": string;
    "deleted_at": string | null;
    "features": {
        "monthly_free_credits": number
    }
}

const creditPackages: CreditPackage[] = [
  {
    tier: "Tier 1",
    packageType: "TIER_1",
    title: "Free / Pay-As-You-Go",
    description: "Best for: Occasional hiring or trying the platform",
    price: "<div>₹0</div>",
    points: [
      "10 free credits to unlock candidate profiles",
      "₹399 per credit thereafter",
      "7-day smart notifications on ideal candidates per job posting",
    ],
    buttonText: "Buy Now",
  },
  {
    tier: "Tier 2",
    packageType: "TIER_2",
    title: "BodyShop Plan",
    description: "Best for: Regular hiring teams and staffing agencies",
    price:
      "<div>₹4,500 <span class='text-xs text-gray-500'>/month</span></div>",
    points: [
      "12 free profile unlock credits every month",
      "Unlimited smart candidate notifications",
      "Unlimited smart candidate notifications",
      "Marketing job postings across 200,000 engineers via social media channels",
      "Strong assessment-based filtering",
      "1 custom assessment per month, created specifically for your job description",
    ],
    buttonText: "Buy Now",
  },
  {
    tier: "Tier 3",
    packageType: "TIER_3",
    title: "Vendor Hiring Model",
    description:
      "Best for: Bulk hiring, vendors, and long-term staffing partners",
    price: "<div class='text-gray-500'>Custom Pricing</div>",
    points: [
      "Unlimited candidate profile access",
      "Dedicated hiring manager assigned",
      "Hiring manager responsibilities include:",
    ],
    benefits: [
      "Understanding job requirements in detail",
      "Creating and optimizing job postings",
      "Designing custom assessments with hiring manager feedback",
      "Inviting relevant candidates for assessments",
      "Filtering candidates based on assessment results",
      "One round of additional manual vetting",
      "Supporting bulk and ongoing hiring needs",
      "Handling contract payroll logistics if required",
    ],
    buttonText: "Contact Us",
  },
];

const openRazorpayCheckout = ({
  orderData,
  user,
  onSuccess,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderData: any;
  user: { email: string; phone?: string };
    onSuccess: () => void;
}) => {
  const options = {
    key: orderData.data.razorpay_key_id,
    amount: orderData.data.amount,
    currency: orderData.data.currency,
    order_id: orderData.data.razorpay_order_id,
    name: "TechSmartHire",
    description: `${orderData.data.package_type} Package - ${orderData.data.assessment_title}`,
    prefill: {
      email: user.email,
      contact: user.phone || "",
    },
    theme: {
      color: "#7C3AED",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: async (response: any) => {
      await verifyCreditPurchase({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }).then((res) => {
        if (res.success) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });

      onSuccess();
    },
    modal: {
      ondismiss: () => {
        toast.error("Payment cancelled");
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const rzp = new window.Razorpay(options);
  rzp.open();
};

const marker = `<svg xmlns="http://www.w3.org/2000/svg" width="7" height="5" viewBox="0 0 7 5" fill="none"> <path d = "M1.94513 3.66931L5.48771 0.121041C5.56821 0.040347 5.67058 0 5.79483 0C5.91918 0 6.02175 0.0402504 6.10254 0.12075C6.18324 0.20125 6.22358 0.303673 6.22358 0.42802C6.22358 0.552465 6.18324 0.655084 6.10254 0.735875L2.31423 4.5185C2.20874 4.62399 2.08571 4.67673 1.94513 4.67673C1.80454 4.67673 1.68151 4.62399 1.57602 4.5185L0.121042 3.06921C0.0403475 2.98871 0 2.88633 0 2.76208C0 2.63774 0.04025 2.53517 0.12075 2.45438C0.20125 2.37368 0.303674 2.33333 0.428021 2.33333C0.552465 2.33333 0.655083 2.37368 0.735875 2.45438L1.94513 3.66931Z" fill = "#76BC21"/></svg >`;

export default function CreditsPackages() {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlanResponse | null>(null);

  const profileCookie = getCookie("profile_data");
  const profileData = profileCookie
    ? JSON.parse(profileCookie as string)
    : null;

  const user = {
    email: profileData.email,
    phone: profileData.mobile_details.mobile_number,
  };

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      await getCurrentPlan().then((res) => {
        setCurrentPlan(res?.data?.plan_details || null);
      });
    };
    fetchCurrentPlan();
  }, []);

  const handlePurchase = async (
    packageType: "TIER_1" | "TIER_2" | "TIER_3",
  ) => {
    const orderData = await initiateCreditPurchase({
      packageType,
    });

    if (orderData.success) {
      if (packageType === "TIER_2") {
        const options = {
          key: orderData.data.razorpay_key_id,
          subscription_id: orderData.data.razorpay_subscription_id,
          order_id: orderData.data.razorpay_order_id,
          name: "TechSmartHire",
          prefill: {
            email: user.email,
            contact: user.phone,
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();

        // Poll every 5 seconds until subscription is successful or after 1 min timeout
        const pollInterval = 5000; // 5 seconds
        const maxAttempts = 12; // 1 min (12 * 5s = 60s)
        let attempt = 0;

        const pollStatus = async () => {
          const res = await verifyPurchaseStatus();
          if (res.success && res.data.subscription_status === "active") {
            toast.success(res.message || "Subscription purchased successfully 🎉");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            return true;
          }
          return false;
        };

        const poll = async () => {
          while (attempt < maxAttempts) {
            const success = await pollStatus();
            if (success) break;

            attempt++;
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
          }
          // Optionally show a timeout/failure toast here if necessary
          // if (attempt === maxAttempts) toast.error("Payment verification timeout");
        };

        void poll();
      }

      if (packageType === "TIER_1") {

        toast.success(orderData.message);

        openRazorpayCheckout({
          orderData,
          user,
          onSuccess: () => {
            toast.success("Assessment purchased successfully 🎉");
          },
        });
      }
    }
  };


  return (
    <div className="flex gap-4 mt-4 overflow-x-auto">
      {creditPackages.map((card: CreditPackage) => (
        <div
          key={card.tier}
          className={cn(
            "min-w-80 max-w-80 border p-3 rounded-xl h-130 flex flex-col justify-between bg-white",
            currentPlan?.plan_type === card.packageType && "border-primary-500",
          )}
        >
          <div>
            <Badge className="bg-gray-100 text-gray-700">{card.tier}</Badge>

            <h4
              className="text-lg font-bold mt-2"
              style={{
                background:
                  " linear-gradient(180deg, var(--primary-500, #5245E5) 0%, var(--secondary-500, #9134EA) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {card.title}
            </h4>
            <p className="text-sm text-gray-500 mt-2 text-[10px]">
              {card.description}
            </p>

            <div
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(card.price) }}
            />

            <hr className="my-4 border-gray-200" />

            <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
              {card.points.map((point: string, index: number) => (
                <li key={index} className="text-xs text-gray-600 font-medium">
                  {point}
                </li>
              ))}
            </ul>

            {card.benefits && (
              <ul className="text-gray-600 px-2 mt-2 pl-4 flex flex-col gap-1">
                {card.benefits.map((benefit: string, index: number) => (
                  <li
                    key={index}
                    className="text-xs text-gray-600 font-medium flex items-start gap-1"
                  >
                    <span
                      className="mt-1"
                      dangerouslySetInnerHTML={{ __html: marker }}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              // </ul>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => handlePurchase(card.packageType)}
            disabled={currentPlan?.plan_type === card.packageType}
          >
            {currentPlan?.plan_type === card.packageType
              ? "Current Plan"
              : card.buttonText}
          </Button>
        </div>
      ))}
    </div>
  );
}
