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
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Payment {
  initial_paid: boolean;
  initial_payment_status: "PAID" | "PENDING";
  package_type: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM";
  purchase_status: "ACTIVE" | "INACTIVE" | "NOT_PURCHASED";
  purchased_at: number | null;
  currency: "INR" | "USD";
}

export default function PaymentCards({
  assessment_id,
  payment,
  is_free_plan_available,
  onUserAssessmentIdChange,
  onPackageSelect,
  selectedPackage,
  onCurrencyChange,
}: {
  assessment_id: string;
  payment: Payment | null;
  is_free_plan_available: boolean;
  onUserAssessmentIdChange?: ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
    message?: string;
  }) => void;
  onPackageSelect?: (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => void;
  selectedPackage?: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null;
  onCurrencyChange?: (currency: "INR" | "USD") => void;
}) {
  const [paymentSuccessData, setPaymentSuccessData] = useState<Payment | null>(
    payment || null
  );
  const [localSelectedPackage, setLocalSelectedPackage] = useState<
    "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null
  >(selectedPackage || payment?.package_type || null);

  // Detect user's currency based on location
  const getDefaultCurrency = (): "INR" | "USD" => {
    try {
      if (payment?.currency) {
        return payment?.currency;
      } else {
        // Method 1: Try to get timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (
          timezone.includes("Asia/Kolkata") ||
          timezone.includes("Asia/Calcutta")
        ) {
          return "INR";
        }

        // Method 2: Try to get locale
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const locale = navigator.language || (navigator as any).userLanguage;
        if (locale && locale.toLowerCase().includes("in")) {
          return "INR";
        }

        // Default to USD for all other countries
        return "USD";
      }
    } catch {
      return "USD"; // Default fallback
    }
  };

  const [currency, setCurrency] = useState<"INR" | "USD">(getDefaultCurrency());

  // Notify parent of currency changes
  useEffect(() => {
    onCurrencyChange?.(currency);
  }, [currency, onCurrencyChange]);

  // Pricing maps for different currencies
  const pricingMap = {
    INR: {
      BASIC: "₹499",
      PREMIUM: "₹1299",
      PLATINUM: "₹7999",
    },
    USD: {
      BASIC: "$10",
      PREMIUM: "$19",
      PLATINUM: "$99",
    },
  };

  const router = useRouter();

  // Sync local selection with prop when it changes
  useEffect(() => {
    if (selectedPackage !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSelectedPackage(selectedPackage);
    }
  }, [selectedPackage]);

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
  }): Promise<void> => {
    return new Promise((resolve, reject) => {
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
          try {
            await verifyPayment(assessment_id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).then((res) => {
              if (res.success) {
                onUserAssessmentIdChange?.({
                  id: res.data.user_assessment_id,
                  payment: res.data.payment,
                });
                setPaymentSuccessData({
                  initial_paid: res.data.payment.initial_paid,
                  initial_payment_status:
                    res.data.payment.initial_payment_status,
                  package_type: res.data.payment.package_type,
                  purchase_status: res.data.payment.purchase_status,
                  purchased_at: res.data.payment.purchased_at,
                  currency: res.data.payment.currency,
                });
              }
            });

            onSuccess();
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
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
      price: pricingMap[currency].BASIC,
      includedItems: basicPackageIncludedItems,
      buttonText: "Activate for ₹99",
      icon: "material-symbols:star-shine-outline-rounded",
    },
    {
      packageType: "PREMIUM",
      title: "Premium Package",
      description:
        "Best value for professionals who want certification + improvement feedback",
      price: pricingMap[currency].PREMIUM,
      includedItems: premiumPackageIncludedItems,
      buttonText: "Upgrade to Premium",
      icon: "material-symbols:diamond-outline-rounded",
    },
    {
      packageType: "PLATINUM",
      title: "Platinum Package",
      description: "Complete coaching + exam strategy to level up fast",
      price: pricingMap[currency].PLATINUM,
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
        currency,
      });

      if (packageType === "FREE") {
        toast.success(orderData?.response?.data?.message || orderData?.message);

        await changeAssessmentStatus(orderData?.data?.id, "ON_GOING")
          .then((res) => {
            if (res.success) {
              window.open(res.data.invite_link, "_blank");
              router.push(`/assessments?tab=taken`);
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

      // 2️⃣ Open Razorpay and wait for completion
      await openRazorpayCheckout({
        orderData,
        user,
        assessment_id: assessment_id,
        token,
        onSuccess: () => {
          toast.success(
            "Assessment purchased successfully 🎉 You can now start the assessment."
          );
          // Don't refresh - let the state update flow through
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed");
      throw err; // Re-throw to let parent handler know
    }
  };

  const handlePackageCardClick = (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => {
    // Don't allow changing if already purchased
    if (currentPayment?.initial_payment_status === "PAID") {
      return;
    }
    setLocalSelectedPackage(packageType);
    onPackageSelect?.(packageType);

    // Update parent with package selection (for UI state like disabling buttons)
    // If currentPayment exists, update it; otherwise only update local state
    if (currentPayment) {
      onUserAssessmentIdChange?.({
        id: assessment_id,
        payment: {
          ...currentPayment,
          package_type: packageType,
        },
      });
    }
  };

  return (
    <div>
      {/* Currency Switcher */}
      <div className="flex items-center justify-between mb-6 mt-4">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:payments-outline"
            className="w-5 h-5 text-gray-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Select Currency
          </span>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrency("INR")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              currency === "INR"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              currency === "USD"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            $ USD
          </button>
        </div>
      </div>

      {is_free_plan_available && (
        <div className="flex flex-col gap-4 mt-4 mb-6">
          {/* Banner */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center gap-3">
            <Icon
              icon="material-symbols:campaign-outline-rounded"
              className="w-8 md:w-10 h-8 md:h-10 text-primary-600"
            />
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm md:text-base font-semibold text-gray-950">
                Early Access: Take the assessment{" "}
                <span className="text-primary-500">FREE!</span>
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-2">
            <Button
              disabled={!!currentPayment}
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
            onClick={() =>
              handlePackageCardClick(
                card.packageType as "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
              )
            }
            className={cn(
              "border-2 rounded-lg p-2 md:p-3 flex flex-col gap-10 justify-between min-w-64 cursor-pointer transition-all",
              // Selected state
              localSelectedPackage === card.packageType ||
                (currentPayment?.package_type === card.packageType &&
                  currentPayment?.initial_payment_status === "PAID")
                ? "border-primary-500 bg-primary-50/30"
                : "border-gray-200 hover:border-primary-200",
              // Disable interaction if already paid
              currentPayment?.initial_payment_status === "PAID" &&
                "cursor-not-allowed opacity-70"
            )}
          >
            <div>
              <div className="flex items-center justify-between w-full mb-1">
                <div className="bg-gray-50 flex items-center justify-center rounded-lg size-8">
                  <Icon icon={card.icon} className="size-5 text-primary-500" />
                </div>
                {/* Selection indicator */}
                <div
                  className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                    localSelectedPackage === card.packageType ||
                      (currentPayment?.package_type === card.packageType &&
                        currentPayment?.initial_payment_status === "PAID")
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-300"
                  )}
                >
                  {(localSelectedPackage === card.packageType ||
                    (currentPayment?.package_type === card.packageType &&
                      currentPayment?.initial_payment_status === "PAID")) && (
                    <Icon
                      icon="material-symbols:check"
                      className="size-4 text-white"
                    />
                  )}
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

            {/* Show "Selected" badge or "Paid" badge */}
            {currentPayment?.initial_payment_status === "PAID" &&
              currentPayment?.package_type === card.packageType && (
                <div className="flex items-center justify-center gap-2 bg-success-50 border border-success-500 rounded-lg py-2 px-3">
                  <Icon
                    icon="material-symbols:check-circle"
                    className="size-5 text-success-600"
                  />
                  <span className="text-sm font-semibold text-success-700">
                    Activated
                  </span>
                </div>
              )}
            {localSelectedPackage === card.packageType &&
              !(
                currentPayment?.initial_payment_status === "PAID" &&
                currentPayment?.package_type === card.packageType
              ) && (
                <div className="flex items-center justify-center gap-2 bg-primary-50 border border-primary-500 rounded-lg py-2 px-3">
                  <Icon
                    icon="material-symbols:check-circle"
                    className="size-5 text-primary-600"
                  />
                  <span className="text-sm font-semibold text-primary-700">
                    Selected
                  </span>
                </div>
              )}

            {/* View Details for Platinum */}
            {card.title === "Platinum Package" && card.mentorServices && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Mentor Services Details
                    <Icon
                      icon="material-symbols:arrow-right"
                      className="ml-1 size-4"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="py-4 px-0 md:max-w-100!"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      <Button variant="secondary">Close</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
