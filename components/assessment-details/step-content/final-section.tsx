import { Icon } from "@iconify/react";
import PaymentCards, { Payment } from "./payment-cards";
import { useState } from "react";

export default function FinalStartSection({
  assessment_id,
  payment,
  onUserAssessmentIdChange,
  candidate_status,
  is_free_plan_available,
  onPackageSelect,
  onCurrencyChange,
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

      <PaymentCards
        assessment_id={assessment_id}
        payment={payment}
        onUserAssessmentIdChange={onUserAssessmentIdChange}
        is_free_plan_available={is_free_plan_available}
        onPackageSelect={handlePackageSelect}
        selectedPackage={selectedPackage}
        onCurrencyChange={onCurrencyChange}
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
