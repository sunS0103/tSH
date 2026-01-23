"use client";

import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { getCreditPurchaseHistory } from "@/api/payment";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import NoDataFound from "../common/no-data-found";
import AssessmentPagination from "../assessments/assessment-pagination";

export default function BillingHistoryTable() {
  const ITEMS_PER_PAGE = 2;

  const [billingHistory, setBillingHistory] = useState<[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      const response = await getCreditPurchaseHistory({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      });
      setBillingHistory(response.data.transactions || []);
      setTotalPages(response.data.meta.totalItems / ITEMS_PER_PAGE || 1);
    };
    fetchBillingHistory();
  }, [currentPage]);

  return (
    <div className="mb-10">
      <div className="overflow-x-hidden bg-white border rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 bg-primary-50 p-4">
          Billing History
        </h2>
        <div className="p-4 pt-0">
          <table className="w-full overflow-x-auto">
            <thead className="text-left">
              <tr className="border-b border-gray-200">
                <th className="py-2">Date</th>
                <th className="py-2">Plan Name</th>
                <th className="py-2">Amount</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.length <= 0 && (
                <div className="flex items-center justify-center">
                  <NoDataFound note="No payment history found" />
                </div>
              )}
              {billingHistory.map(
                (
                  history: {
                    created_at: string;
                    plan_name: string;
                    amount: string;
                  },
                  index: number
                ) => (
                  <tr
                    key={index}
                    className="text-left border-b border-gray-200"
                  >
                    <td className="py-2">
                      {format(new Date(history.created_at), "MM-dd-yyyy")}
                    </td>
                    <td className="py-2">{history.plan_name}</td>
                    <td className="py-2">₹{history.amount}</td>
                    <td className="py-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          /* handle download */
                        }}
                        aria-label={`Download invoice for ${history.created_at}`}
                        className="cursor-pointer rounded-full p-0 bg-primary-50 hover:bg-primary-50 mx-3"
                      >
                        <Icon
                          icon="humbleicons:download-alt"
                          className="bg-primary-50 text-primary-500 size-5"
                        />
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {billingHistory.length > 0 && (
        <AssessmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
