import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export type StepStatus = "active" | "completed" | "upcoming";

export interface Step {
  number: number;
  label: string;
  status: StepStatus;
}

interface AssessmentStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function AssessmentStepper({
  steps,
  currentStep,
  className,
}: AssessmentStepperProps) {
  // Update step statuses based on currentStep
  const updatedSteps = steps.map((step) => {
    if (step.number < currentStep) {
      return { ...step, status: "completed" as const };
    } else if (step.number === currentStep) {
      return { ...step, status: "active" as const };
    } else {
      return { ...step, status: "upcoming" as const };
    }
  });

  // For mobile: show 2 steps based on current step
  // If currentStep <= 2: show steps 1 and 2
  // If currentStep <= 4: show steps 3 and 4
  // If currentStep <= 6: show steps 5 and 6
  let mobileSteps: typeof updatedSteps = [];
  if (currentStep <= 2) {
    mobileSteps = updatedSteps.filter((step) => step.number <= 2);
  } else if (currentStep <= 4) {
    mobileSteps = updatedSteps.filter(
      (step) => step.number >= 3 && step.number <= 4
    );
  } else {
    mobileSteps = updatedSteps.filter(
      (step) => step.number >= 5 && step.number <= 6
    );
  }

  // Check if there are steps before and after the visible pair
  const firstVisibleStep = mobileSteps[0];
  const lastVisibleStep = mobileSteps[mobileSteps.length - 1];
  const hasStepBefore = firstVisibleStep && firstVisibleStep.number > 1;
  const hasStepAfter =
    lastVisibleStep && lastVisibleStep.number < updatedSteps.length;
  const stepBefore = hasStepBefore
    ? updatedSteps.find((s) => s.number === firstVisibleStep.number - 1)
    : null;
  const stepAfter = hasStepAfter
    ? updatedSteps.find((s) => s.number === lastVisibleStep.number + 1)
    : null;

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile - Horizontal Stepper (2 steps visible with before/after lines) */}
      <div className="lg:hidden flex items-start w-full relative overflow-hidden">
        {/* Line before first step */}
        {hasStepBefore && stepBefore && (
          <div
            className="absolute top-3 left-0 h-0.5 z-0 pointer-events-none"
            style={{
              width: `calc(${currentStep === 5 ? "50%" : "25%"} - 0.75rem)`,
              ...(stepBefore.status === "completed"
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(to right, #76BC21, #76BC21 4px, transparent 4px, transparent 8px)",
                    backgroundSize: "8px 1px",
                  }
                : {
                    backgroundImage:
                      "repeating-linear-gradient(to right, #D0D5DD, #D0D5DD 4px, transparent 4px, transparent 8px)",
                    backgroundSize: "8px 1px",
                  }),
            }}
            aria-hidden="true"
          />
        )}

        {mobileSteps.map((step, index) => {
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";
          const isLast = index === mobileSteps.length - 1;
          const nextStep = mobileSteps[index + 1];
          const nextStepCompleted = nextStep?.status === "completed";
          const nextStepActive = nextStep?.status === "active";

          return (
            <div
              key={step.number}
              className="flex items-center flex-1 relative"
            >
              <div className="flex flex-col items-center w-full relative z-10">
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full size-6 border-2 shrink-0 transition-colors",
                    isActive
                      ? "bg-primary border-primary"
                      : isCompleted
                      ? "bg-success-500 border-success-500"
                      : "bg-white border-gray-300"
                  )}
                >
                  {isCompleted ? (
                    <Icon
                      icon="mdi:check"
                      className="size-3.5 text-white"
                      aria-hidden="true"
                    />
                  ) : isActive ? (
                    <div className="size-2 bg-white rounded-full" />
                  ) : null}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "text-xs font-medium mt-2 text-center leading-tight px-1",
                    isActive
                      ? "text-primary font-semibold"
                      : isCompleted
                      ? "text-success-600"
                      : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Horizontal Connecting Line - positioned between steps */}
              {!isLast && (
                <div
                  className="absolute top-3 left-full h-0.5 z-0 pointer-events-none"
                  style={{
                    width: "calc(100% - 1.5rem)",
                    transform: "translateX(-50%)",
                    ...(isCompleted || nextStepCompleted
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(to right, #76BC21, #76BC21 4px, transparent 4px, transparent 8px)",
                          backgroundSize: "8px 1px",
                        }
                      : isActive || nextStepActive
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(to right, #5245e5, #5245e5 4px, transparent 4px, transparent 8px)",
                          backgroundSize: "8px 1px",
                        }
                      : {
                          backgroundImage:
                            "repeating-linear-gradient(to right, #D0D5DD, #D0D5DD 4px, transparent 4px, transparent 8px)",
                          backgroundSize: "8px 1px",
                        }),
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}

        {/* Line after last step */}
        {hasStepAfter && stepAfter && (
          <div
            className="absolute top-3 right-0 h-0.5 z-0 pointer-events-none"
            style={{
              width: `calc(25% - 0.75rem)`,
              ...(lastVisibleStep?.status === "completed"
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(to right, #76BC21, #76BC21 4px, transparent 4px, transparent 8px)",
                    backgroundSize: "8px 1px",
                  }
                : lastVisibleStep?.status === "active"
                ? {
                    backgroundImage:
                      "repeating-linear-gradient(to right, #5245e5, #5245e5 4px, transparent 4px, transparent 8px)",
                    backgroundSize: "8px 1px",
                  }
                : {
                    backgroundImage:
                      "repeating-linear-gradient(to right, #D0D5DD, #D0D5DD 4px, transparent 4px, transparent 8px)",
                    backgroundSize: "8px 1px",
                  }),
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Desktop - Vertical Stepper */}
      <div className="hidden lg:flex flex-col">
        {updatedSteps.map((step, index) => {
          const isLast = index === updatedSteps.length - 1;
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";

          return (
            <div key={step.number} className="flex items-start gap-3">
              {/* Circle and Line Container */}
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full size-6 border-2 shrink-0 transition-colors",
                    isActive
                      ? "bg-primary border-primary"
                      : isCompleted
                      ? "bg-success-500 border-success-500"
                      : "bg-white border-gray-300"
                  )}
                >
                  {isCompleted ? (
                    <Icon
                      icon="mdi:check"
                      className="size-3.5 text-white"
                      aria-hidden="true"
                    />
                  ) : isActive ? (
                    <div className="size-2 bg-white rounded-full" />
                  ) : null}
                </div>

                {/* Vertical Connecting Line */}
                {!isLast && (
                  <div
                    className={cn("w-0.5 flex-1 mt-1 min-h-8")}
                    style={
                      isCompleted
                        ? {
                            backgroundImage:
                              "repeating-linear-gradient(to bottom, #76BC21, #76BC21 4px, transparent 4px, transparent 8px)",
                            backgroundSize: "1px 8px",
                          }
                        : isActive
                        ? {
                            backgroundImage:
                              "repeating-linear-gradient(to bottom, #5245e5, #5245e5 4px, transparent 4px, transparent 8px)",
                            backgroundSize: "1px 8px",
                          }
                        : {
                            backgroundImage:
                              "repeating-linear-gradient(to bottom, #D0D5DD, #D0D5DD 4px, transparent 4px, transparent 8px)",
                            backgroundSize: "1px 8px",
                          }
                    }
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="flex-1 pb-6">
                <span
                  className={cn(
                    "text-sm block",
                    isCompleted
                      ? "text-success-500"
                      : isActive
                      ? "text-primary font-semibold"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
