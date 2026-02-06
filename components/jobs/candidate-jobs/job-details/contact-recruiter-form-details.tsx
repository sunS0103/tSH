interface CustomFieldWithValue {
  title: string;
  value: string | null;
  type: "text" | "textarea" | string;
}

interface ContactRecruiterFormDetailsProps {
  customFields: CustomFieldWithValue[];
}

export default function ContactRecruiterFormDetails({
  customFields,
}: ContactRecruiterFormDetailsProps) {
  // Separate fields into inputs and textareas
  const inputFields: CustomFieldWithValue[] = [];
  const textareaFields: CustomFieldWithValue[] = [];

  customFields.forEach((field) => {
    if (field.type === "textarea") {
      textareaFields.push(field);
    } else {
      inputFields.push(field);
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col w-full my-5">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-950">
          Contact Recruiter Form Details
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-6 py-4">
        {/* Input Fields - Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
          {inputFields.map((field, index) => {
            const displayValue = field.value || "-";

            return (
              <div
                key={`${field.title}-${index}`}
                className="flex flex-col gap-1"
              >
                <p className="text-xs text-gray-900 font-normal">
                  {field.title}
                </p>
                <p className="text-base text-gray-950 font-medium">
                  {displayValue}
                </p>
              </div>
            );
          })}
        </div>

        {/* Textarea Fields in full width */}
        {textareaFields.map((field, index) => {
          const displayValue = field.value || "-";

          return (
            <div
              key={`${field.title}-${index}`}
              className="flex flex-col gap-1 w-full"
            >
              <p className="text-xs text-gray-900 font-normal">{field.title}</p>
              <p className="text-base text-gray-950 font-normal leading-normal wrap-break-word">
                {displayValue}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
