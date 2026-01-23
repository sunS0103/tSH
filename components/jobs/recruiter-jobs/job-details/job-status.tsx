import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function JobStatus({
  status,
  slug,
}: {
  status: string;
  slug: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-700";
      case "in_review":
        return "bg-info-50 text-info-700 border-info-700";
      case "inactive":
        return "bg-warning-50 text-warning-700 border-warning-700";
      case "active":
        return "bg-primary-50 text-primary-700 border-primary-700";
    }
  };
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "text-sm bg-primary-50 border text-primary-700 border-primary-700 rounded-full px-4 py-2",
          getStatusColor(status)
        )}
      >
        {status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </div>

      {(status === "in_review" || status === "draft") && (
        <Link
          href={`/jobs/edit/${slug}`}
          aria-label="Edit Job"
          className=" bg-white text-primary-500 border border-primary-500 rounded-md p-2"
        >
          <Icon icon="material-symbols:edit-outline-rounded" />
        </Link>
      )}
      {(status === "inactive" || status === "active") && (
        <Link
          href={`/jobs/${slug}/applicants-list`}
          aria-label="View Applicants List"
          className="flex items-center gap-2 bg-primary-500 text-white rounded-md px-4 py-2"
        >
          View Applicants List
          <Icon icon="mdi:arrow-top-right" />
        </Link>
      )}
    </div>
  );
}
