import { Icon } from "@iconify/react";
import PaymentCards, { Payment } from "./payment-cards";

export default function FinalStartSection({
  assessment_id,
  payment,
  onUserAssessmentIdChange,
}: {
  assessment_id: string;
  payment: {
    initial_paid: boolean;
    initial_payment_status: "PAID";
    package_type: "BASIC" | "PREMIUM" | "PLATINUM";
    purchase_status: "ACTIVE" | "INACTIVE";
    purchased_at: number;
  };
  onUserAssessmentIdChange?: ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
  }) => void;
}) {
  return (
    <div>
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
      />
    </div>
  );
}
