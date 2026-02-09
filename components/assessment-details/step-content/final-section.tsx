import { Icon } from "@iconify/react";
import PaymentCards, { Payment } from "./payment-cards";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FinalStartSection({
  assessment_id,
  payment,
  onUserAssessmentIdChange,
  candidate_status,
  is_free_plan_available,
  onPackageSelect,
  onCurrencyChange,
  can_repurchase,
  can_purchase_in_days,
  validateSteps,
}: {
  assessment_id: string;
  is_free_plan_available: boolean;
  payment: Payment | null;
  onUserAssessmentIdChange?: ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
  }) => void;
  candidate_status?:
    | "ON_GOING"
    | "INVITED"
    | "LATER"
    | "COMPLETED"
    | "ENROLLED"
    | "PENDING";
  onPackageSelect?: (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => void;
  onCurrencyChange?: (currency: "INR" | "USD") => void;
  can_repurchase: boolean;
  can_purchase_in_days: string;
  validateSteps?: () => boolean;
}) {
  const [selectedPackage, setSelectedPackage] = useState<
    "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null
  >(payment?.package_type || null);

  const handlePackageSelect = (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => {
    setSelectedPackage(packageType);
    onPackageSelect?.(packageType);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Icon
          icon="material-symbols:payments-outline-rounded"
          className="text-primary-500 size-5"
        />
        <h1 className="text-lg md:text-xl font-bold">Final Start Section</h1>
      </div>

      {/* Freeze Period Banner - shown when user has purchased and cannot repurchase */}
      {!can_repurchase && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <Icon
                icon="material-symbols:lock-clock-outline-rounded"
                className="w-6 h-6 text-red-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-semibold text-red-800 mb-1">
                Assessment Already Purchased
              </h3>
              <p className="text-xs md:text-sm text-blue-700 mb-2">
                You have already purchased this assessment by clicking the Start
                button on this page. Please check your email — you would have
                received the exam link at the time of purchase. Use that link to
                begin your assessment directly.
              </p>
              <p className="text-xs md:text-sm text-red-700 mb-2">
                Already completed the assessment and want to retake it? A{" "}
                <span className="font-semibold">30-day cooling period</span>{" "}
                applies from the date of your last attempt.
              </p>
              {can_purchase_in_days && (
                <p className="text-xs md:text-sm text-red-700 mb-2">
                  <span className="font-semibold underline">
                    {can_purchase_in_days} remaining before you can retake.
                  </span>
                </p>
              )}
              <p className="text-xs md:text-sm text-red-700 mb-2">
                You can retake the assessment once this period is completed.
              </p>
              <p className="text-xs md:text-sm text-red-700 mb-3">
                For any technical questions or support:
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={() => window.open("/contact", "_blank")}
              >
                <Icon
                  icon="material-symbols:contact-support-outline-rounded"
                  className="w-4 h-4 mr-1.5"
                />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      )}

      <PaymentCards
        assessment_id={assessment_id}
        payment={payment}
        onUserAssessmentIdChange={onUserAssessmentIdChange}
        is_free_plan_available={is_free_plan_available}
        onPackageSelect={handlePackageSelect}
        selectedPackage={selectedPackage}
        onCurrencyChange={onCurrencyChange}
        can_repurchase={can_repurchase}
        can_purchase_in_days={can_purchase_in_days}
        validateSteps={validateSteps}
      />
      {candidate_status !== "COMPLETED" && candidate_status !== null && (
        <p className="text-base text-black mt-4">
          *Note: You have already invited to the assessment. Please check your
          email for the assessment link.
        </p>
      )}
    </>
  );
}
