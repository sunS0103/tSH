export default function JobSelectedAssessment({
  mandateAssessment,
}: {
  mandateAssessment: { id: string; title: string }[] | [];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-black">
          Selected Assessments
        </h2>
      </div>

      {mandateAssessment.length <= 0 ? (
        <div className="p-6 text-gray-500">
          There are no assessments selected for this job.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 w-full list-none">
          {mandateAssessment.map((assessment) => (
            <li
              key={assessment.id}
              className="flex items-start gap-4 min-w-0 px-2"
            >
              {/* Purple Bullet Point */}
              <div className="flex items-center shrink-0 self-stretch">
                <div className="size-2 bg-primary-200 rounded-full shrink-0" />
              </div>
              {/* Field Text */}
              <span className="text-base text-gray-800 font-medium leading-normal">
                {assessment.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Fields List */}
    </div>
  );
}
