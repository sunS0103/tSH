"use client";

import { changeAssessmentStatus } from "@/api/assessments";
import { initiatePurchase, verifyPayment } from "@/api/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, sanitizeHtml } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Payment {
  initial_paid: boolean;
  initial_payment_status: "PAID";
  package_type: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM";
  purchase_status: "ACTIVE" | "INACTIVE";
  purchased_at: number;
}

export default function PaymentCards({
  assessment_id,
  payment,
  is_free_plan_available,

  onUserAssessmentIdChange,
}: {
  assessment_id: string;
  payment: Payment | null;
  is_free_plan_available: boolean;
  onUserAssessmentIdChange?: ({
    id,
    payment,
    message,
  }: {
    id: string;
    payment: Payment;
    message: string;
  }) => void;
}) {
  const [paymentSuccessData, setPaymentSuccessData] = useState<Payment | null>(
    payment || null
  );

  const router = useRouter();

  // Reset paymentSuccessData when payment prop becomes null (after proceed success)
  // This syncs the local state with parent state reset
  // This is necessary to reflect state changes from parent component
  useEffect(() => {
    if (payment === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentSuccessData(null);
    }
  }, [payment]);

  // Use paymentSuccessData if set, otherwise use payment prop
  // This allows local updates while still reflecting parent state changes
  const currentPayment = paymentSuccessData || payment;

  const openRazorpayCheckout = ({
    orderData,
    user,
    assessment_id,
    onSuccess,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderData: any;
    user: { email: string; phone?: string };
    assessment_id: string;
    token: string;
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
        await verifyPayment(assessment_id, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }).then((res) => {
          if (res.success) {
            onUserAssessmentIdChange?.({
              id: orderData.data.user_assessment_id,
              payment: res.data.payment,
              message: res.message,
            });
            setPaymentSuccessData({
              initial_paid: res.data.payment.initial_paid,
              initial_payment_status: res.data.payment.initial_payment_status,
              package_type: res.data.payment.package_type,
              purchase_status: res.data.payment.purchase_status,
              purchased_at: res.data.payment.purchased_at,
            });
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

  const basicPackageIncludedItems = [
    "Unlock assessment",
    "Masked profile + score visibility to 100+ verified recruiters",
    "Custom job notifications based on your assessed skill set",
  ];

  const premiumPackageIncludedItems = [
    "One free retake (question set varies) after period. Best Score chosen.",
    "Skilled Certification issued under the TSH (TechSmartHire) brand — valid for 1 year",
    "Personal QR Code to verify certification on our secure cloud servers",
    "Detailed private analysis of your performance with improvement areas",
  ];

  const platinumPackageIncludedItems = [
    "Mentorship to strengthen the core skills covered in the assessment",
    "Learning resources, online training, and hands-on projects with a 6–8 week plan",
    "Detailed 1:1 analysis and personalized guidance for your retake (if required)",
    "Identification of exact knowledge gaps and improvement roadmap",
  ];

  const cards = [
    {
      packageType: "BASIC",
      title: "Basic Package",
      description:
        "Get started at a minimal cost, pay the remaining when hiring interest is confirmed.",
      price: "₹499",
      includedItems: basicPackageIncludedItems,
      buttonText: "Activate for ₹99",
      icon: "material-symbols:star-shine-outline-rounded",
    },
    {
      packageType: "PREMIUM",
      title: "Premium Package",
      description:
        "Best value for professionals who want certification + improvement feedback",
      price: "₹1299",
      includedItems: premiumPackageIncludedItems,
      buttonText: "Upgrade to Premium",
      icon: "material-symbols:diamond-outline-rounded",
    },
    {
      packageType: "PLATINUM",
      title: "Platinum Package",
      description: "Complete coaching + exam strategy to level up fast",
      price: "₹7999",
      includedItems: platinumPackageIncludedItems,
      buttonText: "Upgrade to Platinum",
      icon: "material-symbols:crown-outline-rounded",
      mentorServices: [
        "1:1 guidance and personalized learning roadmap",
        "Curated learning videos / online coaching",
        "Practice exercises and quick mock interview prep",
      ],
    },
  ];

  const profileData = JSON.parse(getCookie("profile_data") as string);
  const token = getCookie("token") as string;
  const user = {
    email: profileData.email,
    phone: profileData.mobile_details.mobile_number,
  };

  const handlePurchase = async (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => {
    try {
      // 1️⃣ Create Order
      const orderData = await initiatePurchase({
        assessment_id: assessment_id,
        packageType,
      });

      if (packageType === "FREE") {
        toast.success(orderData?.response?.data?.message || orderData?.message);

        await changeAssessmentStatus(orderData?.data?.id, "ON_GOING")
          .then((res) => {
            if (res.success) {
              window.open(res.data.invite_link, "_blank");
              router.push(`/assessments`);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message);
          });
        if (orderData?.response?.data?.reload_page) {
          window.location.reload();
        }
        return;
      }

      // 2️⃣ Open Razorpay
      openRazorpayCheckout({
        orderData,
        user,
        assessment_id: assessment_id,
        token,
        onSuccess: () => {
          toast.success("Assessment purchased successfully 🎉");
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div>
      {is_free_plan_available && (
        <div className="flex flex-col gap-4 mt-4 mb-6">
          {/* Banner */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
            <Icon
              icon="material-symbols:campaign-outline-rounded"
              className="w-8 md:w-10 h-8 md:h-10 text-primary-600"
            />
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm md:text-base font-semibold text-gray-950">
                Early Access: Take the assessment{" "}
                <span className="text-primary-500">FREE!</span>
              </p>
              <p className="text-sm text-gray-700 font-normal">
                Upgrade only to unlock full benefits after results.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-2">
            <Button
              disabled={
                currentPayment?.package_type !== "FREE" &&
                currentPayment?.package_type === null
              }
              className="w-fit px-10"
              onClick={() => handlePurchase("FREE")}
            >
              Start Assessment - Free
            </Button>
            <p className="text-sm text-gray-600 text-center font-normal">
              No payment required now
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 overflow-auto">
        {cards.map((card) => (
          <div
            key={card.title}
            className={cn(
              "border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col gap-10 justify-between min-w-64",
              currentPayment?.initial_payment_status === "PAID" &&
                currentPayment?.package_type === card.packageType &&
                "border-primary-500"
            )}
          >
            <div>
              <div className="flex items-center justify-between w-full mb-1">
                <div className="bg-gray-50 flex items-center justify-center rounded-lg size-8">
                  <Icon icon={card.icon} className="size-5 text-primary-500" />
                </div>
              </div>
              <div className="font-semibold text-xs md:text-sm mb-1">
                {card.title}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {card.description}
              </div>
              <h2 className="text-lg md:text-xl font-bold">{card.price}</h2>

              <hr className="my-4 border-gray-200" />

              <div className="text-xs md:text-sm font-semibold">
                What&apos;s Included
              </div>

              <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
                {card.includedItems.map((item: string) => (
                  <li key={item} className="text-xs text-gray-600 font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {card.title === "Platinum Package" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full mt-1"
                      onClick={() => {
                        if (card.packageType === "PLATINUM") {
                          handlePurchase(
                            card.packageType as
                              | "FREE"
                              | "BASIC"
                              | "PREMIUM"
                              | "PLATINUM"
                          );
                        }
                      }}
                      disabled={
                        currentPayment?.initial_payment_status === "PAID" &&
                        currentPayment?.package_type === card.packageType
                      }
                    >
                      {currentPayment?.initial_payment_status === "PAID" &&
                      currentPayment?.package_type === card.packageType
                        ? "Activated"
                        : "Activate"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="py-4 px-0 md:max-w-100!">
                    <DialogHeader className="px-6">
                      <DialogTitle className="text-left text-base md:text-lg">
                        {card.title}
                      </DialogTitle>
                    </DialogHeader>
                    <hr className="border-gray-200" />
                    <div className="pl-6">
                      <div className="text-xs md:text-sm font-semibold">
                        Mentor Services Typically Include (May Vary):
                      </div>

                      <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
                        {card.mentorServices?.map((item: string) => (
                          <li
                            key={item}
                            className="text-xs md:text-sm text-gray-600 font-medium"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 justify-end px-6">
                      <DialogClose asChild>
                        <Button variant="secondary" className="">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        className=""
                        onClick={() =>
                          handlePurchase(
                            card.packageType as
                              | "FREE"
                              | "BASIC"
                              | "PREMIUM"
                              | "PLATINUM"
                          )
                        }
                      >
                        Proceed
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full mt-1"
                  onClick={() =>
                    handlePurchase(
                      card.packageType as
                        | "FREE"
                        | "BASIC"
                        | "PREMIUM"
                        | "PLATINUM"
                    )
                  }
                  disabled={
                    currentPayment?.initial_payment_status === "PAID" &&
                    currentPayment?.package_type === card.packageType
                  }
                >
                  {currentPayment?.initial_payment_status === "PAID" &&
                  currentPayment?.package_type === card.packageType
                    ? "Activated"
                    : "Activate"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
