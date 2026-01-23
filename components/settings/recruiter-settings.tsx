import { Icon } from "@iconify/react";
import CreditsPackages, { CurrentPlanResponse } from "../credits/credits-packages";
import Link from "next/link";
import BillingHistoryTable from "./billing-history-table";
import { useEffect, useState } from "react";
import { getCurrentPlan } from "@/api/payment";

export default function RecruiterSettings() {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlanResponse | null>(null);
  const [availableCredits, setAvailableCredits] = useState<number>(0);


    useEffect(() => {
    const fetchCurrentPlan = async () => {
      await getCurrentPlan().then((res) => {
        setCurrentPlan(res?.data?.plan_details || null);
        setAvailableCredits(res?.data?.available_credits || 0);
      });
    };
    fetchCurrentPlan();
  }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold my-4">
        Subscription & Billing
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="p-4 border border-primary-500 rounded-2xl bg-primary-50 h-fit min-w-87">
          <Icon
            icon="material-symbols:crown-outline-rounded"
            className="text-primary-500 size-5"
          />
          <div className="text-lg font-semibold mt-4 mb-1">
            You are on {currentPlan?.name || "Free Plan"}
          </div>
          <div className="text-sm text-gray-700">
            You have {availableCredits} credits remaining
          </div>
          <Link
            href="/credits"
            className="w-full bg-primary-50 mt-4 text-primary-500 flex items-center justify-center border border-primary-500 rounded-lg py-1 hover:bg-primary-500 hover:text-white"
          >
            Buy Now <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
          </Link>
        </div>

        <div className="overflow-x-hidden w-full">
          <div className="bg-white border rounded-2xl w-full overflow-x-hidden">
            <h2 className="text-lg font-semibold mb-4 bg-primary-50 p-4 rounded-t-2xl">
              Available Plans
            </h2>
            <div className="p-4 pt-0 flex justify-center w-full overflow-x-hidden">
              <CreditsPackages />
            </div>
          </div>
          <div className="mt-4 w-full">
            <BillingHistoryTable />
          </div>
        </div>
      </div>
    </div>
  );
}
