import NoData from "@/assets/icons/no-data";

interface NoDataFoundProps {
  note?: string;
  title?: string;
  icon?: string;
  className?: string;
}

export default function NoDataFound({
  note,
  title = "No Data Found",
  className = "",
}: NoDataFoundProps) {
  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center py-12 px-4 w-full ${className}`}
    >
      {/* Icon */}
      <NoData />

      {/* Title */}
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

        {/* Note */}
        {note && (
          <p className="text-sm font-normal text-gray-600 max-w-md">{note}</p>
        )}
      </div>
    </div>
  );
}
