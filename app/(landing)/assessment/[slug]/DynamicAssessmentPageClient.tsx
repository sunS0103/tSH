"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Globe,
  FileText,
  Shield,
  AlertTriangle,
  Camera,
  Monitor,
  Mouse,
  Eye,
  Wifi,
  Code,
  MessageSquare,
  Award,
  ArrowRight,
  Lock,
  PlayCircle,
  Users,
  BarChart3,
  CheckSquare,
  XCircle,
  Zap,
  X,
  Calendar,
  Loader2,
  FileDown,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { getContact, getImports } from "@/api/waitlist";

// TypeScript interfaces for the assessment configuration
export interface Skill {
  name: string;
  level: "Foundation" | "Intermediate" | "Advanced";
}

export interface AssessmentConfig {
  title: string;
  description: string;
  questions: number;
  minutes: number;
  level: "Foundation" | "Intermediate" | "Advanced";
  sampleQuestionsHref: string;
  skills: Skill[];
}

interface QuestionType {
  type: string;
  count: string;
  icon: React.ElementType;
  color: string;
}

interface ProctorRule {
  icon: React.ElementType;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
}

interface FAQItem {
  icon: React.ElementType;
  question: string;
  answer: string;
}

// FAQ Accordion Component
function FAQAccordion({
  onDownloadGuideClick,
}: {
  onDownloadGuideClick: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      icon: Lock,
      question: "Will my score and personal details be visible to everyone?",
      answer: `Absolutely not. Recruiters can only see masked profiles with scores — no name, no email, no phone number.

Your identity and contact details are revealed only when:
• A recruiter shows interest in your profile, and
• You explicitly accept to share your details with that recruiter.

Even then, your details are shared only with that specific recruiter, not publicly. Your privacy is fully in your control.`,
    },
    {
      icon: Zap,
      question:
        "Do I get any advantage by taking the assessment early on the platform?",
      answer: `Absolutely. Profile ranking is partially influenced by the assessment completion date.

For example, if two candidates achieve the same score for the same assessment, the candidate who completed the assessment earlier will rank higher in recruiter search results.

Early participation gives you a visibility advantage.`,
    },
    {
      icon: Globe,
      question:
        "I don't see job postings for my location yet. What's the benefit of taking the assessment now?",
      answer: `TechSmartHire is a newly launched platform, and we are actively onboarding recruiters from across the globe.

If your profile already has a validated score, future recruiters will immediately see your profile higher in search results when they join the platform.

Being an early mover gives you a strong advantage in visibility and opportunities as the platform grows.`,
    },
    {
      icon: CheckCircle,
      question: "Can I retake the exam if I'm not satisfied with my score?",
      answer: `Yes. You can retake the assessment after a 30-day cooling period.

If you attempt the assessment multiple times, we will always consider your best score.`,
    },
    {
      icon: Users,
      question: "When and how will recruiters see my score?",
      answer: `Recruiters receive daily updates of new candidate scores for the roles they are hiring.

They can log in anytime to:
• Filter candidates by skills, score range, experience, and location
• Shortlist profiles that match their job requirements
• Send interview requests to selected candidates

Once you accept, your profile is unlocked only for that recruiter.`,
    },
    {
      icon: Clock,
      question: "How long is my score valid?",
      answer: `Your score is valid for 365 days from the date you take the assessment.`,
    },
    {
      icon: BarChart3,
      question: "How will my score be interpreted?",
      answer: `Your assessment score represents a signal of your practical experience level, not just how many questions you answered correctly.

Recruiters use this score to quickly understand how ready you are for real-world projects and job responsibilities.

📊 Score Bands:

Intermediate (40.01 – 60)
Indicates foundational knowledge with growing hands-on skills.
Suitable for junior roles, trainees, and early career positions.

Experienced (60.01 – 75)
Indicates strong working knowledge and good practical exposure.
Suitable for mid-level roles and independent contributors.

Expert (75.01 – 90)
Indicates deep technical expertise and strong problem-solving ability.
Suitable for senior roles, lead engineers, and critical projects.`,
    },
    {
      icon: Award,
      question: "Will I receive any Professional certificate?",
      answer: `Yes. If you score above 60%, you will be eligible to receive a certification.

This certificate can serve as a strong credential when applying for jobs.`,
    },
    {
      icon: Code,
      question:
        "I see one coding question in each assessment. Do I need to write everything from scratch?",
      answer: `Not necessarily. The coding editor is preconfigured with all required imports and basic setup.

You only need to focus on implementing the correct logic to solve the problem.`,
    },
    {
      icon: Globe,
      question: "Can I apply for international positions?",
      answer: `For most international roles, you need valid work authorization for that country.

UAE Exception:
Dubai/UAE companies actively recruit from India for exceptional profiles and do not require prior work authorization. Indian candidates can apply directly.

Other Countries:
You must hold a valid work visa or permit for that specific country before applying.`,
    },
    {
      icon: Award,
      question: "Why is there a fee to take the assessment?",
      answer: `Each assessment actually costs us around ₹999 / $10 to conduct due to:
• Proctoring infrastructure
• Identity verification
• Secure exam systems

But to keep this accessible for everyone, we charge only ₹100 / $1 to write the exam.

👉 The remaining amount is paid only if a recruiter contacts you and invites you for a job process.

So you invest very little upfront — and pay more only when there is real hiring interest. This keeps the system fair, serious, and focused on genuine job seekers.`,
    },
    {
      icon: FileText,
      question: "How do I know what topics are covered and how to prepare?",
      answer: `We provide a complete Exam Guide that includes:
• Topics covered
• Sample questions
• Preparation tips

👉 Download the Exam Guide to know exactly what to expect before taking the test. No surprises. Full transparency.`,
    },
    {
      icon: GraduationCap,
      question:
        "Do I get mentorship support to prepare and clear this assessment?",
      answer: `Yes. Once you sign up on TechSmartHire, you will see an option in the Assessment window to enroll in a Mentorship Guidance + Exam package.

This package is designed to help you prepare effectively, strengthen your skills, and confidently attempt the assessment.`,
    },
    {
      icon: CheckSquare,
      question: "Will everyone get the same questions in the assessment?",
      answer: `No. Every candidate gets a different set of questions.

We use a large, continuously updated question pool, and for each attempt:
• Questions are randomly selected
• The order of questions is also shuffled

We also regularly:
• Retire old questions
• Add new questions to the pool

This ensures:
• No sharing of question papers
• Fair evaluation for all candidates
• Strong protection of exam integrity

While the topics and difficulty level remain consistent, the exact questions differ for each candidate.`,
    },
    {
      icon: Shield,
      question: "How strict are the proctoring and anti-cheating standards?",
      answer: `Very strict — because recruiters trust these scores for hiring.

Our proctoring system can detect:
• Looking away from the screen
• Multiple faces
• Phone usage
• Tab switching
• Suspicious behavior patterns

All violations are marked with red flags in your score report.

⚠️ If more than two serious violations are detected:
• Your exam will be terminated immediately
• You may be blocked from taking future assessments

This protects honest candidates and keeps scores credible.`,
    },
    {
      icon: Camera,
      question: "How do you verify that I am the person taking the exam?",
      answer: `We use multiple identity checks, including:
• Government photo ID verification
• Face match during the exam
• First name, last name, and date of birth validation

This helps prevent:
• Fake profiles
• Multiple attempts using different emails

Our goal is simple: one real person = one real score.`,
    },
    {
      icon: Clock,
      question: "Can I retake the same assessment multiple times?",
      answer: `No. There is a 30-day lock period before you can retake the same assessment.

This prevents trial-and-error attempts and ensures scores reflect real skill readiness.

We strongly recommend using the Exam Guide and preparing well before attempting.`,
    },
    {
      icon: BarChart3,
      question: "Is score the only factor recruiters look at?",
      answer: `Not at all. Your score is important — but it's not the only factor.

Recruiters also consider:
• Experience level
• Salary expectations
• Role requirements
• Location and local hiring market

For example:
• A candidate with 8/10 score and 7 years experience may not fit a junior-level role budget
• A candidate with 6/10 score and the right experience may be a better match

Also, what is considered a strong score can vary by:
• City
• Skill demand vs supply
• Role complexity

👉 Your score is a signal of skill — not a judgment of your career.`,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`rounded-xl border-2 transition-all ${
            openIndex === index
              ? "border-blue-400 bg-blue-50 shadow-lg"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-5 flex items-start gap-4 text-left cursor-pointer"
          >
            <div
              className={`p-2 rounded-lg shrink-0 transition-colors ${
                openIndex === index
                  ? "bg-blue-100 border-2 border-blue-300"
                  : "bg-slate-100 border-2 border-slate-200"
              }`}
            >
              <faq.icon
                className={`w-5 h-5 transition-colors ${
                  openIndex === index ? "text-blue-600" : "text-slate-600"
                }`}
              />
            </div>

            <div className="flex-1">
              <h3
                className={`font-bold text-lg leading-tight transition-colors ${
                  openIndex === index ? "text-blue-900" : "text-slate-900"
                }`}
              >
                {faq.question}
              </h3>
            </div>

            <div
              className={`p-2 rounded-full shrink-0 transition-all ${
                openIndex === index ? "bg-blue-200 rotate-180" : "bg-slate-100"
              }`}
            >
              <ArrowRight
                className={`w-5 h-5 transition-colors transform rotate-90 ${
                  openIndex === index ? "text-blue-700" : "text-slate-600"
                }`}
              />
            </div>
          </button>

          {openIndex === index && (
            <div className="px-6 pb-6 pt-2 animate-fade-in">
              <div className="pl-14">
                <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {faq.answer
                    .split("Download the Exam Guide")
                    .map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadGuideClick();
                            }}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                          >
                            Download the Exam Guide
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// This component accepts assessment configuration as props
interface DynamicAssessmentPageClientProps {
  config: AssessmentConfig;
}

export default function DynamicAssessmentPageClient({
  config,
}: DynamicAssessmentPageClientProps) {
  const router = useRouter();
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleStep, setSampleStep] = useState<"form" | "download">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isLive, setIsLive] = useState(false);
  const [launchDateDisplay, setLaunchDateDisplay] = useState("February 6");

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_ENV;
    let launchDateStr = "2026-02-05T00:00:00"; // Production default

    if (env === "staging") {
      launchDateStr = "2026-01-28T00:00:00";
    } else if (env === "development") {
      launchDateStr = "2024-01-01T00:00:00"; // Creating a past date to open immediately
    }

    const launchDate = new Date(launchDateStr).getTime();

    // Format display date (e.g., "February 6" or "January 28")
    const dateObj = new Date(launchDateStr);
    const month = dateObj.toLocaleString("default", { month: "long" });
    const day = dateObj.getDate();
    setLaunchDateDisplay(`${month} ${day}`);

    // Check immediately to avoid delay
    setIsLive(new Date().getTime() >= launchDate);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
      setIsLive(now >= launchDate);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Use provided config or fallback to default
  const assessmentConfig: AssessmentConfig = config || {
    title: "SDET Java Automation Profile – Level 1",
    description:
      "Prove your expertise in Selenium WebDriver, API Testing, Core Java, and Testing Fundamentals through our comprehensive, AI-proctored assessment.",
    questions: 20,
    minutes: 25,
    level: "Intermediate",
    sampleQuestionsHref: "https://aws.com/sample",
    skills: [
      { name: "Selenium WebDriver", level: "Advanced" },
      { name: "API Testing", level: "Intermediate" },
      { name: "Core Java", level: "Intermediate" },
      { name: "Testing Fundamentals", level: "Foundation" },
    ],
  };

  // Calculate question type percentages (static for all assessments)
  const questionTypes: QuestionType[] = [
    {
      type: "Single Choice",
      count: "55%",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      type: "Multi-Select & Fill in the Blanks",
      count: "35%",
      icon: CheckSquare,
      color: "blue",
    },
    { type: "Coding Challenge", count: "5%", icon: Code, color: "purple" },
    { type: "Video Interview", count: "5%", icon: Camera, color: "orange" },
  ];

  // Static proctoring rules (same for all assessments)
  const proctorRules: ProctorRule[] = [
    {
      icon: Monitor,
      title: "Full-Screen Mode Required",
      description:
        "Maintain full-screen throughout the exam. Exiting triggers an automatic violation.",
      severity: "critical",
    },
    {
      icon: Mouse,
      title: "No Tab Switching",
      description:
        "Switching tabs or windows is strictly prohibited and monitored.",
      severity: "critical",
    },
    {
      icon: FileText,
      title: "No Copy/Paste or Screenshots",
      description:
        "All clipboard and screenshot activities are blocked and flagged.",
      severity: "critical",
    },
    {
      icon: Eye,
      title: "Maintain Eye Contact",
      description:
        "AI monitors your gaze. Looking away frequently will raise red flags.",
      severity: "high",
    },
    {
      icon: MessageSquare,
      title: "No Background Conversations",
      description:
        "Audio monitoring detects conversations. Ensure a quiet environment.",
      severity: "high",
    },
    {
      icon: Wifi,
      title: "Single Device Only",
      description:
        "No additional devices (phones, tablets, laptops) allowed in proximity.",
      severity: "high",
    },
    {
      icon: Zap,
      title: "No AI Plugins",
      description:
        "Browser extensions and AI tools are automatically detected, flagged, and shown in report as violation.",
      severity: "critical",
    },
    {
      icon: Camera,
      title: "Stay in Camera Frame",
      description:
        "Leaving the camera view for extended periods triggers violations.",
      severity: "medium",
    },
  ];

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      default:
        return "slate";
    }
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    setRecaptchaError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
      return;
    }

    setIsSubmitting(true);
    setRecaptchaError(null);

    try {
      // Check if email already exists
      let listIds = [];
      try {
        try {
          const response = await getContact(email);
          listIds = response.listIds || [];
        } catch (error) {}
        if (!listIds.includes(23)) {
          // Import contact to waitlist
          const importBody = {
            jsonBody: [
              {
                email: email,
                attributes: {
                  FIRSTNAME: name,
                },
              },
            ],
            listIds: [23], // Candidate list ID
            recaptchaToken: recaptchaToken,
          };

          await getImports({ data: importBody });
        }
      } catch (error: any) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          throw error;
        }
      }

      // toast.success("Sample questions sent to your email!");

      // Proceed to download step
      setSampleStep("download");

      // Trigger PDF download
      handleDownload();

      resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Sample Questions Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    resetRecaptcha();
  };

  const handleDownload = () => {
    // In production, trigger actual download
    window.open(assessmentConfig.sampleQuestionsHref, "_blank");
  };

  const handleNotifyMe = () => {
    router.push("/#waitlist");
  };

  const closeSampleModal = () => {
    setIsSampleModalOpen(false);
    setSampleStep("form");
    resetForm();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[64px_64px]"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Award className="w-4 h-4" />
              Skill Validation Assessment
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {assessmentConfig.title}
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              {assessmentConfig.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">
                  {assessmentConfig.questions} Questions
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  {assessmentConfig.minutes} Minutes
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <BarChart3 className="w-5 h-5" />
                <span className="font-semibold">{assessmentConfig.level}</span>
              </div>
            </div>

            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="group cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:shadow-2xl hover:shadow-white/50 transition-all hover:scale-105"
            >
              <PlayCircle className="w-6 h-6" />
              <span>View Sample Questions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Skills Assessed Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Skills Assessed
            </h2>
            <p className="text-sm text-slate-600">
              Critical areas evaluated in this assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {assessmentConfig.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all"
              >
                <h3 className="text-base font-bold text-slate-900">
                  {skill.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    skill.level === "Advanced"
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : skill.level === "Intermediate"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  }`}
                >
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Overview Section */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Assessment Overview
            </h2>
            <p className="text-sm text-slate-600">Key exam details</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 p-5 rounded-xl bg-white border-2 border-blue-200 hover:shadow-lg transition-all">
              <div className="p-3 rounded-lg bg-blue-100 border border-blue-300">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  {assessmentConfig.questions}
                </p>
                <p className="text-sm text-slate-600">Questions</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-xl bg-white border-2 border-emerald-200 hover:shadow-lg transition-all">
              <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">
                  {assessmentConfig.minutes}
                </p>
                <p className="text-sm text-slate-600">Minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-xl bg-white border-2 border-purple-200 hover:shadow-lg transition-all">
              <div className="p-3 rounded-lg bg-purple-100 border border-purple-300">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {assessmentConfig.level}
                </p>
                <p className="text-sm text-slate-600">Difficulty</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-xl bg-white border-2 border-orange-200 hover:shadow-lg transition-all">
              <div className="p-3 rounded-lg bg-orange-100 border border-orange-300">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">100% AI</p>
                <p className="text-sm text-slate-600">Proctored</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Question Format Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Question Format Breakdown
            </h2>
            <p className="text-sm text-slate-600">Diverse question types</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {questionTypes.map((type, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all md:overflow-visible overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 md:-mr-12 md:-mt-12 -mr-4 -mt-4 bg-linear-to-br from-blue-100 to-emerald-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 rounded-lg bg-${type.color}-100 border border-${type.color}-300`}
                    >
                      <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {type.count}
                      </h3>
                      <p className="text-xs text-slate-600">of exam</p>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {type.type}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {type.type === "Single Choice" &&
                      "Choose correct answer from options. Tests fundamental knowledge."}
                    {type.type === "Multi-Select & Fill in the Blanks" &&
                      "Select multiple answers or complete code. Evaluates comprehension."}
                    {type.type === "Coding Challenge" &&
                      "Write functional code for real-world problems. Tests coding ability."}
                    {type.type === "Video Interview" &&
                      "Record video response to testing scenario. Assesses communication."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Identity Validation Section */}
      <section className="py-10 bg-linear-to-br from-blue-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <Lock className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Candidate Validation
            </h2>
            <p className="text-sm text-slate-600">
              Identity verification for assessment integrity
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border-2 border-blue-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-300 shrink-0">
                  <Camera className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Photo ID Verification
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Upload <strong>government-issued photo ID</strong>. AI
                    compares ID photo & name with live camera to verify identity
                    match.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border-2 border-emerald-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300 shrink-0">
                  <Eye className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Continuous Live Monitoring
                  </h3>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    You authorize monitoring via webcam and screen recording
                    throughout exam.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Live video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Screen recording</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Eye tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Audio monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proctoring Standards Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border-2 border-red-300 text-red-700 font-bold mb-3 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Strict Enforcement
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Proctoring Standards
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl mx-auto">
              AI-powered monitoring ensures fair environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {proctorRules.map((rule, idx) => {
              const color = getSeverityColor(rule.severity);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg bg-white border-2 border-${color}-300 hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg bg-${color}-100 border border-${color}-300 shrink-0`}
                    >
                      <rule.icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {rule.title}
                        </h3>
                        {rule.severity === "critical" && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            !
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto p-5 rounded-xl bg-linear-to-br from-red-50 to-orange-50 border-2 border-red-300">
            <div className="flex items-start gap-3">
              <XCircle className="w-8 h-8 text-red-600 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Violation Consequences
                </h3>
                <p className="text-sm text-slate-800 mb-3">
                  Violations are <strong>automatically flagged</strong> in your
                  assessment report.
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-red-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                    <span>Red flags in your report</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                    <span>Automatic disqualification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                    <span>Shared with recruiters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                    <span>Permanent ban possible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fairness Commitment */}
      <section className="py-6 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-5 rounded-xl bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-300">
            <div className="flex items-start gap-3">
              <Shield className="w-7 h-7 text-purple-600 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  Our Commitment to Fairness
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  These measures prevent cheating and maintain integrity.
                  Recordings are securely stored and deleted after 90 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold mb-4 text-sm">
              <MessageSquare className="w-4 h-4" />
              Candidate FAQs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Questions{" "}
              <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Answered
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about the assessment process
            </p>
          </div>

          <FAQAccordion
            onDownloadGuideClick={() => setIsSampleModalOpen(true)}
          />
        </div>
      </section>

      {/* Smart CTA - Email Capture Before Launch, Active Signup After */}
      <section className="py-16 bg-linear-to-br from-emerald-600 via-emerald-700 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[64px_64px]"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {isLive ? (
            // PHASE 2: Assessments Are Open - UNLOCKED
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-semibold mb-4 animate-pulse">
                <Zap className="w-4 h-4" />
                Assessments Are Now Open!
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Get into Top Recruiters' Attention?
              </h2>

              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                Prove your QA skills through our skill-based assessments and get
                shortlisted by leading companies.
              </p>

              {/* UNLOCKED BUTTON */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <button
                    onClick={() => window.open("/authentication", "_blank")}
                    className="cursor-pointer px-12 py-5 rounded-xl bg-white text-emerald-600 font-black text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Signup & Begin Assessment</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  {/* Live Badge */}
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-green-400 text-slate-900 text-xs font-black shadow-lg animate-pulse">
                    ✨ LIVE NOW
                  </div>
                </div>

                <p className="text-sm text-emerald-200 mt-3">
                  Take the assessment anytime until Feb 27
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>22 QA Positions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>7 Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Multiple Cities</span>
                </div>
              </div>
            </>
          ) : (
            // PHASE 1: Pre-Launch - LOCKED
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-100 text-sm font-semibold mb-4">
                <Calendar className="w-4 h-4" />
                Open Window: {launchDateDisplay}–27, 2026
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Get into Top Recruiters' Attention?
              </h2>

              {/* Dynamic Countdown */}
              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                Registration opens in{" "}
                <strong className="text-yellow-300">
                  {timeLeft.days} days, {timeLeft.hours} hours
                </strong>
              </p>

              {/* LOCKED BUTTON */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <button
                    disabled
                    className="px-12 py-5 rounded-xl bg-slate-700/50 text-slate-300 font-bold text-xl cursor-not-allowed border-2 border-slate-600 backdrop-blur-sm flex items-center gap-3"
                  >
                    <Lock className="w-6 h-6" />
                    <span>Signup Opens {launchDateDisplay}</span>
                  </button>

                  {/* Lock Badge */}
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-xs font-black shadow-lg animate-pulse">
                    🔒 LOCKED
                  </div>
                </div>

                <p className="text-sm text-emerald-200 mt-3">
                  Button will unlock automatically on {launchDateDisplay} at
                  12:00 AM
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 max-w-md mx-auto mb-8">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-sm font-semibold text-emerald-200">
                  Meanwhile
                </span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Email Capture Button */}
              <div className="max-w-2xl mx-auto mb-8">
                <button
                  onClick={handleNotifyMe}
                  className="group cursor-pointer inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-yellow-400 text-slate-900 font-bold text-lg hover:bg-yellow-300 hover:shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
                >
                  <span className="text-wrap">
                    🔔 Join the List to Get Notified When It's Live!
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}

              <p className="text-sm text-emerald-200">
                Take the assessment anytime between {launchDateDisplay}-27, 2026
                • Be first in line when it opens
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 mb-2">
            Questions about the assessment process? Contact us at
          </p>
          <a
            href="mailto:info@techsmarthire.com"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            info@techsmarthire.com
          </a>
        </div>
      </footer>

      {/* Sample Questions Modal */}
      {isSampleModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-start z-50"
          onClick={closeSampleModal}
        >
          <div
            className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-emerald-600 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Sample Questions</h3>
                <p className="text-sm text-blue-100">
                  Get a preview of the assessment
                </p>
              </div>
              <button
                onClick={closeSampleModal}
                className="p-2 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {sampleStep === "form" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      Enter Your Details
                    </h4>
                    <p className="text-sm text-slate-600">
                      Get sample questions to your email and get started
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900"
                      />
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex justify-start">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={
                          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
                        }
                        onChange={(token: string | null) => {
                          setRecaptchaToken(token);
                          setRecaptchaError(null);
                        }}
                        onExpired={() => {
                          setRecaptchaToken(null);
                          setRecaptchaError(
                            "reCAPTCHA expired. Please complete the challenge again.",
                          );
                        }}
                        onErrored={() => {
                          setRecaptchaToken(null);
                          setRecaptchaError(
                            "reCAPTCHA error. Please try again.",
                          );
                        }}
                        theme="light"
                        size="normal"
                      />
                    </div>
                    {recaptchaError && (
                      <p className="text-xs text-red-500 text-center">
                        {recaptchaError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer py-3 rounded-lg bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Access PDF
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                      By continuing, you agree to receive assessment-related
                      communications
                    </p>
                  </div>
                </div>
              )}

              {sampleStep === "download" && (
                <>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">
                        Success!
                      </h4>
                      <h6 className="text-md font-semibold text-slate-900 mb-4">
                        Your Sample Questions Are Ready.
                      </h6>
                      <p className="text-sm text-slate-600">
                        You can download them directly below.
                      </p>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full cursor-pointer py-3 rounded-lg bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FileDown className="w-5 h-5" />
                      Download Sample Questions PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
