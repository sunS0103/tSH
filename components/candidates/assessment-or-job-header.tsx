export default function AssessmentOrJobHeader() {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold">
        Validate Your Skills. <br />
        Unlock{" "}
        <span
          style={{
            background: "linear-gradient(180deg, #3b82f6 0%, #6366f1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Better Opportunities.
        </span>
      </h2>
      <p className="text-slate-700 text-xs my-1 md:text-sm">
        Get your capabilities scored and make <br />
        your profile shine in front of leading recruiters.
      </p>
    </>
  );
}
