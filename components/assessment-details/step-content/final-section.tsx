import { Icon } from "@iconify/react";
import PaymentCards from "./payment-cards";

export default function FinalStartSection() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon
          icon="material-symbols:payments-outline-rounded"
          className="text-primary-500 size-5"
        />
        <h1 className="text-lg md:text-xl font-bold">Final Start Section</h1>
      </div>

      <PaymentCards />
    </div>
  );
}
