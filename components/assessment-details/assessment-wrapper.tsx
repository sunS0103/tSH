"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
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
} from "../ui/dialog";
import { changeAssessmentStatus } from "@/api/assessments";
import { initiatePurchase, verifyPayment } from "@/api/payment";
import { toast } from "sonner";
import { Payment } from "./step-content/payment-cards";
import { getCookie } from "cookies-next/client";

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
  console.log(assessment);
  const pathname = usePathname();
  const assessmentId = assessment.assessment_id;
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
    assessment && assessment.payment ? (assessment.payment as Payment) : null
  );

  const [selectedPackageType, setSelectedPackageType] = useState<
    "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null
  >(assessment?.payment?.package_type || null);

  const [selectedCurrency, setSelectedCurrency] = useState<"INR" | "USD">(
    "INR"
  );

  const [isStartNowDialogOpen, setIsStartNowDialogOpen] = useState(false);
  const [isStartLaterDialogOpen, setIsStartLaterDialogOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPopupBlockedDialogOpen, setIsPopupBlockedDialogOpen] = useState(false);
  const [popupBlockedLink, setPopupBlockedLink] = useState<string | null>(null);

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

  // Calculate unconfirmed steps with errors (only show red when user has tried to proceed without confirming)
  const unconfirmedSteps = Object.keys(stepErrors).map((stepNum) =>
    parseInt(stepNum)
  );

  // Handle navigation click from stepper
  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const lastTwoSteps =
    currentStep === totalSteps || currentStep === totalSteps - 1;
  const firstTwoSteps = currentStep === 1 || currentStep === 2;

  const handleUserAssessmentIdChange = ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
  }) => {
    setUserAssessmentId(id);
    setAssessmentPayment(payment);
    setSelectedPackageType(payment.package_type);
  };

  const handlePackageSelect = (
    packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
  ) => {
    setSelectedPackageType(packageType);
  };

  const handleCurrencyChange = (currency: "INR" | "USD") => {
    setSelectedCurrency(currency);
  };

  // Get user data from cookies for payment
  const getProfileData = () => {
    try {
      const profileData = JSON.parse(getCookie("profile_data") as string);
      return {
        email: profileData?.email || "",
        phone: profileData?.mobile_details?.mobile_number || "",
      };
    } catch {
      return { email: "", phone: "" };
    }
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = ({
    orderData,
    user,
    onSuccess,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderData: any;
    user: { email: string; phone?: string };
    onSuccess: (paymentData: {
      user_assessment_id: string;
      payment: Payment;
    }) => void;
  }): Promise<void> => {
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.data.razorpay_key_id,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        order_id: orderData.data.razorpay_order_id,
        name: "TechSmartHire",
        description: `${orderData.data.package_type} Package - ${orderData.data.assessment_title}`,
        prefill: {
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#7C3AED",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            const verifyRes = await verifyPayment(assessmentId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              onSuccess({
                user_assessment_id: verifyRes.data.user_assessment_id,
                payment: verifyRes.data.payment,
              });
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  // Handle purchase - calls initiate purchase API for PAID packages only
  // Returns the user_assessment_id and payment data after successful payment
  // Note: FREE packages are handled separately by the "Start Assessment - Free" button in PaymentCards
  const handlePurchase = async (
    packageType: "BASIC" | "PREMIUM" | "PLATINUM"
  ): Promise<{ user_assessment_id: string; payment: Payment }> => {
    setIsPaymentLoading(true);
    try {
      // Call initiate purchase API
      const orderData = await initiatePurchase({
        assessment_id: assessmentId,
        packageType,
        currency: selectedCurrency,
      });

      // Open Razorpay checkout for paid packages (verifyPayment runs in handler)
      const user = getProfileData();
      let paymentResult: {
        user_assessment_id: string;
        payment: Payment;
      } | null = null;

      await openRazorpayCheckout({
        orderData,
        user,
        onSuccess: (paymentData) => {
          paymentResult = paymentData;
          setUserAssessmentId(paymentData.user_assessment_id);
          setAssessmentPayment(paymentData.payment);
          setSelectedPackageType(paymentData.payment.package_type);
          toast.success(
            "Assessment purchased successfully 🎉 You can now start the assessment."
          );
        },
      });

      if (!paymentResult) {
        throw new Error("Payment was not completed");
      }

      return paymentResult;
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const validateSteps = (): boolean => {
    const unconfirmedStepNumbers = [1, 2, 3, 4].filter(
      (stepNum) => !stepConfirmations[stepNum]
    );

    if (unconfirmedStepNumbers.length > 0) {
      const newErrors: Record<number, boolean> = {};
      unconfirmedStepNumbers.forEach((stepNum) => {
        newErrors[stepNum] = true;
      });
      setStepErrors((prev) => ({ ...prev, ...newErrors }));
      toast.error(
        "Please confirm all required sections before starting the assessment."
      );
      return false;
    }
    return true;
  };

  // Handler for "Start Assessment Now" button click
  const handleStartNowButtonClick = async () => {
    // Validate all checkboxes are confirmed for steps 1-4
    if (!validateSteps()) return;

    setIsStartNowDialogOpen(true);
  };

  // Handler for "Start Assessment Later" button click
  const handleStartLaterButtonClick = async () => {
    // Validate all checkboxes are confirmed for steps 1-4
    if (!validateSteps()) return;

    setIsStartLaterDialogOpen(true);
  };

  // Proceed handler for Start Now dialog
  const handleProceedStartNow = async () => {
    // Check if a package is selected
    if (!selectedPackageType) {
      toast.error("Please select a package first.");
      return;
    }

    // FREE packages should use the "Start Assessment - Free" button in PaymentCards
    if (selectedPackageType === "FREE") {
      toast.error(
        "Please use the 'Start Assessment - Free' button for free packages."
      );
      setIsStartNowDialogOpen(false);
      return;
    }

    // Check if payment is already completed - use state or existing userAssessmentId
    if (assessmentPayment?.initial_paid && userAssessmentId) {
      // Already paid, proceed with assessment
      try {
        const res = await changeAssessmentStatus(userAssessmentId, "ON_GOING");
        if (res.success && res.data.invite_link) {
          setTimeout(() => {
            const w = window.open(res.data.invite_link, "_blank");
            setUserAssessmentId(null);
            setAssessmentPayment(null);
            setIsStartNowDialogOpen(false);
            if (w == null || w.closed) {
              setPopupBlockedLink(res.data.invite_link);
              setIsPopupBlockedDialogOpen(true);
            } else {
              router.push(`/assessments`);
            }
          }, 1000);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(
          error?.response?.data?.message || "Failed to start assessment"
        );
      }
      return;
    }

    // Trigger payment flow for paid packages (BASIC, PREMIUM, PLATINUM)
    try {
      const paymentResult = await handlePurchase(selectedPackageType);

      // After successful payment, call changeAssessmentStatus with ON_GOING
      const res = await changeAssessmentStatus(
        paymentResult.user_assessment_id,
        "ON_GOING"
      );
      if (res.success && res.data.invite_link) {
        setTimeout(() => {
          const w = window.open(res.data.invite_link, "_blank");
          setUserAssessmentId(null);
          setAssessmentPayment(null);
          setIsStartNowDialogOpen(false);
          if (w == null || w.closed) {
            setPopupBlockedLink(res.data.invite_link);
            setIsPopupBlockedDialogOpen(true);
          } else {
            router.push(`/assessments`);
          }
        }, 1000);
      } else if (res.data.invite_link) {
        toast.error(res.message || "Assessment link not found");
      }
    } catch (err: unknown) {
      // Error might be from handlePurchase (payment cancelled) or changeAssessmentStatus
      const error = err as { response?: { data?: { message?: string } } };
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  // Proceed handler for Start Later dialog
  const handleProceedStartLater = async () => {
    // Check if a package is selected
    if (!selectedPackageType) {
      toast.error("Please select a package first.");
      return;
    }

    // FREE packages should use the "Start Assessment - Free" button in PaymentCards
    if (selectedPackageType === "FREE") {
      toast.error(
        "Please use the 'Start Assessment - Free' button for free packages."
      );
      setIsStartLaterDialogOpen(false);
      return;
    }

    // Check if payment is already completed - use state or existing userAssessmentId
    if (assessmentPayment?.initial_paid && userAssessmentId) {
      // Already paid, proceed with sending later
      try {
        const res = await changeAssessmentStatus(userAssessmentId, "LATER");
        if (res.success) {
          toast.success(res.message || "Exam link will send via email");
          setIsStartLaterDialogOpen(false);
          router.push(`/assessments`);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(
          error?.response?.data?.message || "Failed to schedule assessment"
        );
      }
      return;
    }

    // Trigger payment flow for paid packages (BASIC, PREMIUM, PLATINUM)
    try {
      const paymentResult = await handlePurchase(selectedPackageType);

      // After successful payment, call changeAssessmentStatus with LATER
      const res = await changeAssessmentStatus(
        paymentResult.user_assessment_id,
        "LATER"
      );
      if (res.success) {
        toast.success(res.message || "Exam link will send via email");
        setIsStartLaterDialogOpen(false);
        router.push(`/assessments`);
      }
    } catch (err: unknown) {
      // Error might be from handlePurchase (payment cancelled) or changeAssessmentStatus
      const error = err as { response?: { data?: { message?: string } } };
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col mt-4 lg:mt-6 pb-17">
      <Loader show={isPaymentLoading} />
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Mobile Stepper - Horizontal (Fluid Layout) */}
        <div
          className={cn(
            "lg:hidden bg-white border border-gray-200 py-4 -mx-4 md:mx-0",
            lastTwoSteps && "rounded-r-2xl mr-2",
            firstTwoSteps && "rounded-l-2xl ml-0"
          )}
        >
          <AssessmentStepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            unconfirmedSteps={unconfirmedSteps}
            stepConfirmations={stepConfirmations}
          />
        </div>

        {/* Desktop Sidebar - Stepper (Vertical) */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-6">
            <AssessmentStepper
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              unconfirmedSteps={unconfirmedSteps}
              stepConfirmations={stepConfirmations}
            />
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
            onPackageSelect={handlePackageSelect}
            onCurrencyChange={handleCurrencyChange}
            validateSteps={validateSteps}
          />
        </div>
      </div>
      {/* Navigation Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FluidLayout>
          <div className="flex justify-end items-end md:items-center gap-2 md:gap-3 bg-white p-4 border-y border-t">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-1"
            >
              {currentStep === 5 && (
                <>
                  <Icon
                    icon="material-symbols:arrow-back-ios-new-rounded"
                    className="size-4 md:hidden"
                  />
                  <span className="md:block hidden">Back</span>
                </>
              )}
              {currentStep !== 5 && <span className="block">Back</span>}
            </Button>

            {currentStep === totalSteps && (
              <div className="flex flex-row gap-2 items-center justify-end w-fit">
                {/* Start Assessment Later */}
                <div className="flex flex-col items-center gap-2 max-w-xs">
                  <Button
                    disabled={
                      assessment.candidate_status !== "COMPLETED" &&
                      assessment.candidate_status !== null
                    }
                    variant="secondary"
                    className="text-xs sm:text-sm px-1 md:px-4 py-2 w-fit"
                    onClick={handleStartLaterButtonClick}
                  >
                    Start Assessment Later
                  </Button>
                  <Dialog
                    open={isStartLaterDialogOpen}
                    onOpenChange={setIsStartLaterDialogOpen}
                  >
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
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>

                        <Button onClick={handleProceedStartLater}>
                          Proceed
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Start Assessment Now */}
                <div className="flex flex-col items-center gap-2 max-w-xs">
                  <Button
                    disabled={
                      assessment.candidate_status !== "COMPLETED" &&
                      assessment.candidate_status !== null
                    }
                    className="text-xs sm:text-sm px-1 md:px-4 py-2 w-fit"
                    onClick={handleStartNowButtonClick}
                  >
                    Start Assessment Now
                  </Button>
                  <Dialog
                    open={isStartNowDialogOpen}
                    onOpenChange={setIsStartNowDialogOpen}
                  >
                    <DialogContent className="py-4 px-0 md:max-w-100!">
                      <DialogHeader className="px-6">
                        <DialogTitle className="text-left text-base md:text-lg">
                          Start Assessment Now
                        </DialogTitle>
                      </DialogHeader>
                      <hr className="border-gray-200" />
                      <div className="pl-6">
                        {selectedPackageType === "PLATINUM" ||
                        assessmentPayment?.package_type === "PLATINUM" ? (
                          <p className="text-xs text-amber-600 leading-relaxed font-medium">
                            Platinum package requires mentorship preparation.
                            Please use &quot;Start Assessment Later&quot;
                            option.
                          </p>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end px-6">
                        <DialogClose asChild>
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>

                        <Button onClick={handleProceedStartNow}>Proceed</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
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

      {/* Popup Blocked Dialog */}
      <Dialog
        open={isPopupBlockedDialogOpen}
        onOpenChange={(open) => {
          setIsPopupBlockedDialogOpen(open);
          if (!open) {
            setPopupBlockedLink(null);
            router.push(`/assessments`);
          }
        }}
      >
        <DialogContent className="py-6 px-6 md:max-w-md!">
          <DialogHeader>
            <DialogTitle className="text-center text-base md:text-lg">
              Your Assessment is Ready!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Icon
              icon="material-symbols:rocket-launch-outline-rounded"
              className="size-12 text-primary"
            />
            <p className="text-sm md:text-base text-gray-600 text-center">
              Click the button below to start your assessment:
            </p>
            {popupBlockedLink && (
              <a
                href={popupBlockedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Icon icon="material-symbols:open-in-new" className="size-5" />
                Start Assessment
              </a>
            )}
          </div>
          <div className="flex justify-center">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
