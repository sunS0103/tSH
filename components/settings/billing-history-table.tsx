import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

export default function BillingHistoryTable() {
  const billingHistory = [
    {
      id: 1,
      date: "2026-01-21",
      planName: "Free Plan",
      amount: "₹0",
      // action: "View"
    },
    {
      id: 2,
      date: "2026-01-21",
      planName: "Free Plan",
      amount: "₹0",
      // action: "View"
    },
    {
      id: 3,
      date: "2026-01-21",
      planName: "Free Plan",
      amount: "₹0",
      // action: "View"
    },
    {
      id: 4,
      date: "2026-01-21",
      planName: "Free Plan",
      amount: "₹0",
      // action: "View"
    },
  ];
  return (
    <div className="overflow-x-hidden bg-white border rounded-2xl mb-4">
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
            {billingHistory.map((history) => (
              <tr
                key={history.id}
                className="text-left border-b border-gray-200"
              >
                <td className="py-2">{history.date}</td>
                <td className="py-2">{history.planName}</td>
                <td className="py-2">{history.amount}</td>
                <td className="py-2 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      /* handle download */
                    }}
                    aria-label={`Download invoice for ${history.date}`}
                    className="cursor-pointer rounded-full p-0 bg-primary-50 hover:bg-primary-50 mx-3"
                  >
                    <Icon
                      icon="humbleicons:download-alt"
                      className="bg-primary-50 text-primary-500 size-5"
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
