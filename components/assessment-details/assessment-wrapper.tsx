"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AssessmentStepper from "./assessment-stepper";
import StepContent, { type Assessment } from "./step-content-wrapper";
import FluidLayout from "../layouts/fluid";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { changeAssessmentStatus } from "@/api/assessments";
import { toast } from "sonner";
import { Payment } from "./step-content/payment-cards";

const STEPS = [
  { number: 1, label: "Introduction & Syllabus", status: "active" as const },
  // {
  //   number: 2,
  //   label: "Syllabus & Topics Covered",
  //   status: "upcoming" as const,
  // },
  {
    number: 2,
    label: "Exam Process / How It Works",
    status: "upcoming" as const,
  },
  {
    number: 3,
    label: "Score Visibility & Privacy",
    status: "upcoming" as const,
  },
  {
    number: 4,
    label: "Integrity & Code of Conduct",
    status: "upcoming" as const,
  },
  {
    number: 5,
    label: "Final Start Section",
    status: "upcoming" as const,
  },
];

interface AssessmentWrapperProps {
  assessment: Assessment;
}

export default function AssessmentWrapper({
  assessment,
}: AssessmentWrapperProps) {
  const params = useParams();
  const pathname = usePathname();
  const assessmentId = params?.id as string;
  const router = useRouter();

  // Check if we're on an assessment route
  const isAssessmentRoute = pathname?.startsWith("/assessments/") ?? false;

  // Create localStorage keys based on assessment ID (scoped to assessment routes)
  const STORAGE_KEY_STEP = `assessment-step-${assessmentId}`;
  const STORAGE_KEY_CONFIRMATIONS = `assessment-confirmations-${assessmentId}`;

  // Initialize with default values to avoid hydration mismatch
  const [currentStep, setCurrentStep] = useState(1);
  const [stepConfirmations, setStepConfirmations] = useState<
    Record<number, boolean>
  >({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const previousPathnameRef = useRef<string | null>(null);
  const [userAssessmentId, setUserAssessmentId] = useState<string | null>(
    assessment?.user_assessment_id || null
  );

  const [assessmentPayment, setAssessmentPayment] = useState<Payment | null>(
    assessment?.payment || null
  );

  const totalSteps = STEPS.length;

  const assessmentLaterDetails = [
    "Choose this option to begin the exam later.",
    "You’ll receive a unique exam link via email.",
    "Use the link to start your exam whenever you’re ready.",
  ];

  const assessmentNowDetails = [
    "Make sure you’re in a quiet and distraction-free environment.",
    "Check that you have a stable internet connection.",
    "Get everything set before beginning the process.",
  ];

  // Clear localStorage when navigating away from assessment routes (but not on refresh)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = pathname;
      const previousPath = previousPathnameRef.current;

      // If we were on an assessment route and now we're not, clear localStorage
      if (
        previousPath !== null &&
        previousPath.startsWith("/assessments/") &&
        currentPath &&
        !currentPath.startsWith("/assessments/")
      ) {
        localStorage.removeItem(STORAGE_KEY_STEP);
        localStorage.removeItem(STORAGE_KEY_CONFIRMATIONS);
      }

      // Update the ref for next comparison
      previousPathnameRef.current = currentPath;
    }

    return () => {
      localStorage.removeItem(STORAGE_KEY_STEP);
      localStorage.removeItem(STORAGE_KEY_CONFIRMATIONS);
    };
  }, [pathname, STORAGE_KEY_STEP, STORAGE_KEY_CONFIRMATIONS]);

  // Load saved state from localStorage synchronously before paint to prevent flash
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && isAssessmentRoute) {
      // Batch state updates to avoid cascading renders
      let savedStep = 1;
      let savedConfirmations: Record<number, boolean> = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      };

      const stepValue = localStorage.getItem(STORAGE_KEY_STEP);
      if (stepValue) {
        const step = parseInt(stepValue, 10);
        if (step >= 1 && step <= totalSteps) {
          savedStep = step;
        }
      }

      const confirmationsValue = localStorage.getItem(
        STORAGE_KEY_CONFIRMATIONS
      );
      if (confirmationsValue) {
        try {
          const parsed = JSON.parse(confirmationsValue);
          if (typeof parsed === "object" && parsed !== null) {
            savedConfirmations = parsed;
          }
        } catch {
          // If parsing fails, keep defaults
        }
      }

      // Update all state at once - this runs before paint, preventing flash
      setCurrentStep(savedStep);
      setStepConfirmations(savedConfirmations);
      setIsHydrated(true);
    } else {
      // If not on assessment route, mark as hydrated immediately
      setIsHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAssessmentRoute]);

  // Save currentStep to localStorage whenever it changes (only after hydration and on assessment routes)
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined" && isAssessmentRoute) {
      localStorage.setItem(STORAGE_KEY_STEP, currentStep.toString());
    }
  }, [currentStep, STORAGE_KEY_STEP, isHydrated, isAssessmentRoute]);

  // Save stepConfirmations to localStorage whenever they change (only after hydration and on assessment routes)
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined" && isAssessmentRoute) {
      localStorage.setItem(
        STORAGE_KEY_CONFIRMATIONS,
        JSON.stringify(stepConfirmations)
      );
    }
  }, [
    stepConfirmations,
    STORAGE_KEY_CONFIRMATIONS,
    isHydrated,
    isAssessmentRoute,
  ]);

  // Scroll to top when step changes
  useEffect(() => {
    if (isHydrated) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, isHydrated]);

  const handleNext = () => {
    // Check if current step requires confirmation and if it's confirmed
    const isStepWithConfirmation = currentStep >= 1 && currentStep <= 4;
    if (isStepWithConfirmation && !stepConfirmations[currentStep]) {
      setStepErrors((prev) => ({
        ...prev,
        [currentStep]: true,
      }));
      return;
    }

    // Clear error for current step if proceeding
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => {
        const updated = { ...prev };
        delete updated[currentStep];
        return updated;
      });
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCurrentStepConfirmChange = (isConfirmed: boolean) => {
    if (currentStep < 1 || currentStep > 6) {
      return;
    }

    setStepConfirmations((previousConfirmations) => ({
      ...previousConfirmations,
      [currentStep]: isConfirmed,
    }));

    // Clear error when checkbox is checked
    if (isConfirmed && stepErrors[currentStep]) {
      setStepErrors((prev) => {
        const updated = { ...prev };
        delete updated[currentStep];
        return updated;
      });
    }
  };

  const isStepWithConfirmation = currentStep >= 1 && currentStep <= 6;

  const isCurrentStepConfirmed = isStepWithConfirmation
    ? Boolean(stepConfirmations[currentStep])
    : true;

  const lastTwoSteps =
    currentStep === totalSteps || currentStep === totalSteps - 1;
  const firstTwoSteps = currentStep === 1 || currentStep === 2;

  const handleStartAssessmentNow = () => {
    // if (!assessmentPayment?.initial_paid) {
    //   toast.error("Please purchase the assessment to start.");
    //   return;
    // }
    if (!userAssessmentId) {
      toast.error("User assessment ID is missing.");
      return;
    }
    changeAssessmentStatus(userAssessmentId, "ON_GOING")
      .then((res) => {
        if (res.success) {
          window.open(res.data.invite_link, "_blank");
          setUserAssessmentId(null);
          setAssessmentPayment(null);
          router.push(`/assessments?tab=taken`);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const handleStartAssessmentLater = () => {
    if (!assessmentPayment?.initial_paid) {
      toast.error("Please purchase the assessment to start.");
      return;
    }
    if (!userAssessmentId) {
      toast.error("User assessment ID is missing.");
      return;
    }
    changeAssessmentStatus(userAssessmentId, "LATER")
      .then((res) => {
        if (res.success) {
          toast.success(res.message || "Exam link will send via email");
          // setUserAssessmentId(null);
          // setAssessmentPayment(null);
          router.push(`/assessments`);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const handleUserAssessmentIdChange = ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
  }) => {
    setUserAssessmentId(id);
    setAssessmentPayment(payment);
  };

  return (
    <div className="flex flex-col mt-4 lg:mt-6 pb-20">
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Mobile Stepper - Horizontal (Fluid Layout) */}
        <div
          className={cn(
            "lg:hidden bg-white border border-gray-200 py-4 -mx-4 md:mx-0",
            lastTwoSteps && "rounded-r-2xl mr-2",
            firstTwoSteps && "rounded-l-2xl ml-0"
          )}
        >
          <AssessmentStepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Desktop Sidebar - Stepper (Vertical) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-6">
            <AssessmentStepper steps={STEPS} currentStep={currentStep} />
          </div>
        </div>

        {/* Main Content Area - Flex Column */}
        <div className="lg:flex-1 flex flex-col gap-6">
          <StepContent
            currentStep={currentStep}
            isCurrentStepConfirmed={isCurrentStepConfirmed}
            onCurrentStepConfirmChange={handleCurrentStepConfirmChange}
            assessment={assessment}
            onUserAssessmentIdChange={handleUserAssessmentIdChange}
            assessmentPayment={assessmentPayment}
            hasError={Boolean(stepErrors[currentStep])}
          />
        </div>
      </div>
      {/* Navigation Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FluidLayout>
          <div className="flex justify-end items-center gap-2 md:gap-3 bg-white p-4 border-y border-t">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-1"
            >
              {currentStep === 6 && (
                <>
                  <Icon
                    icon="material-symbols:arrow-back-ios-new-rounded"
                    className="size-4 md:hidden"
                  />
                  <span className="md:block hidden">Back</span>
                </>
              )}
              {currentStep !== 6 && <span className="block">Back</span>}
            </Button>

            {currentStep === totalSteps && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={
                        assessment.candidate_status !== null &&
                        assessment.candidate_status !== "PENDING"
                      }
                      variant="secondary"
                      className="text-xs md:text-sm px-2 md:px-4"
                    >
                      Start Assessment Later
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="py-4 px-0 md:max-w-100!">
                    <DialogHeader className="px-6">
                      <DialogTitle className="text-left text-base md:text-lg">
                        Start Assessment Later
                      </DialogTitle>
                    </DialogHeader>
                    <hr className="border-gray-200" />
                    <div className="pl-6">
                      <div className="text-xs md:text-sm font-semibold">
                        If You’re Not Ready to Start Now
                      </div>

                      <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
                        {assessmentLaterDetails?.map((item: string) => (
                          <li
                            key={item}
                            className="text-xs md:text-sm text-gray-600 font-medium"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 justify-end px-6">
                      <DialogClose asChild>
                        <Button variant="secondary" className="">
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button onClick={handleStartAssessmentLater}>
                        Proceed
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={
                        assessment.candidate_status !== null &&
                        assessment.candidate_status !== "PENDING"
                      }
                      className="text-xs md:text-sm px-2 md:px-4"
                    >
                      Start Assessment Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="py-4 px-0 md:max-w-100!">
                    <DialogHeader className="px-6">
                      <DialogTitle className="text-left text-base md:text-lg">
                        Start Assessment Now
                      </DialogTitle>
                    </DialogHeader>
                    <hr className="border-gray-200" />
                    <div className="pl-6">
                      <div className="text-xs md:text-sm font-semibold">
                        Prepare Before You Start
                      </div>

                      <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
                        {assessmentNowDetails?.map((item: string) => (
                          <li
                            key={item}
                            className="text-xs md:text-sm text-gray-600 font-medium"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 justify-end px-6">
                      <DialogClose asChild>
                        <Button variant="secondary" className="">
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button className="" onClick={handleStartAssessmentNow}>
                        Proceed
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {currentStep !== totalSteps && (
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </div>
        </FluidLayout>
      </div>
    </div>
  );
}
