export default function CreditsOverview() {
  return (
    <div className="lg:col-span-1 h-fit bg-primary-50 border border-primary-500 rounded-2xl p-4 flex flex-col gap-4 max-w-90 min-w-80 flex-1">
      <h3 className="font-semibold text-base md:text-lg text-black text-nowrap">
        Plan Change Information
      </h3>
      <div>
        <div>Upgrade:</div>
        <ul className="list-disc list-inside marker:text-primary-200 marker:text-lg">
          <li className="text-xs">Takes effect immediately.</li>
          <li className="text-xs">Tier 1 → Tier 2: discard free credits.</li>
          <li className="text-xs">Tier 2 → Tier 3: irrelevant.</li>
        </ul>
      </div>

      <div>
        <div>Downgrade:</div>
        <ul className="list-disc list-inside marker:text-primary-200 marker:text-lg">
          <li className="text-xs">Takes effect at next billing cycle.</li>
          <li className="text-xs">Your plan will downgrade on 1st Aug 2025.</li>
        </ul>
      </div>
    </div>
  );
}
