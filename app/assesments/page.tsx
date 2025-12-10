import AssessmentCard from "@/components/assesments/assessment-card";

export default function AssesmentPage() {
  return (
    <div className="p-4">
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
      <p className="text-gray-700 text-xs my-1 md:text-3xlsm">
        Get your capabilities scored and make <br />
        your profile shine in front of leading recruiters.
      </p>
      <div className="my-2">texts</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
        <AssessmentCard
          icon="material-symbols:flutter"
          category="Software Development"
          title="Flutter Framework Analysis: Performance & Scalability"
          topics={["Performance", "Scalability", "Framework", "Analysis"]}
          duration="10 minutes"
          questionCount={10}
        />
      </div>
    </div>
  );
}
