"use client";

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
import { cn } from "@/lib/utils";
// import { initiatePurchase, openRazorpayCheckout } from "@/lib/razorpay";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Payment {
  initial_paid: boolean;
  initial_payment_status: "PAID";
  package_type: "BASIC" | "PREMIUM" | "PLATINUM";
  purchase_status: "ACTIVE" | "INACTIVE";
  purchased_at: number;
}

export default function PaymentCards({
  assessment_id,
  payment,
  onUserAssessmentIdChange,
}: {
  assessment_id: string;
  payment: Payment | null;
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
  const [isPlatinumDialogOpen, setIsPlatinumDialogOpen] = useState(false);

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
              id: res.data.user_assessment_id,
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
        "<div>Get started at a minimal cost, pay the remaining when hiring interest is confirmed. <a href='#' class='text-black underline'>Learn More</a></div>",
      price: "₹999",
      includedItems: basicPackageIncludedItems,
      topNotes: "Pay Only 10% Today",
      bottomNotes:
        "₹900 later — only if you and a recruiter mutually connect (handshake)",
      buttonText: "Activate for ₹99",
      icon: "material-symbols:star-shine-outline-rounded",
    },
    {
      packageType: "PREMIUM",
      title: "Premium Package",
      description:
        "<div>Best value for professionals who want certification + improvement feedback</div>",
      price: "₹1299",
      includedItems: premiumPackageIncludedItems,
      buttonText: "Upgrade to Premium",
      icon: "material-symbols:diamond-outline-rounded",
    },
    {
      packageType: "PLATINUM",
      title: "Platinum Package",
      description:
        "<div>Complete coaching + exam strategy to level up fast</div>",
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
    packageType: "BASIC" | "PREMIUM" | "PLATINUM"
  ) => {
    try {
      // 1️⃣ Create Order
      const orderData = await initiatePurchase({
        assessment_id: assessment_id,
        packageType,
      });

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
      toast.error(err.message || "Payment failed");
    }
  };

  return (
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
              <span className="text-xs italic underline text-primary-500">
                {card.topNotes}
              </span>
            </div>
            <div className="font-semibold text-xs md:text-sm mb-1">
              {card.title}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: card.description }}
              className="text-xs text-gray-500 mb-2"
            />

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
            {/* Notes */}
            {card.bottomNotes && (
              <p className="text-xs text-gray-700 text-center mt-2">
                {card.bottomNotes}
              </p>
            )}

            {card.title === "Platinum Package" ? (
              <Dialog
                open={isPlatinumDialogOpen}
                onOpenChange={setIsPlatinumDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full mt-1"
                    disabled={
                      currentPayment?.initial_payment_status === "PAID" &&
                      currentPayment?.package_type === card.packageType
                    }
                  >
                    {currentPayment?.initial_payment_status === "PAID" &&
                    currentPayment?.package_type === card.packageType
                      ? "Activated"
                      : card.buttonText}
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
                      onClick={() => {
                        setIsPlatinumDialogOpen(false);
                        // Use setTimeout to ensure dialog closes before opening Razorpay
                        setTimeout(() => {
                          handlePurchase(
                            card.packageType as "BASIC" | "PREMIUM" | "PLATINUM"
                          );
                        }, 100);
                      }}
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
                    card.packageType as "BASIC" | "PREMIUM" | "PLATINUM"
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
                  : card.buttonText}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
