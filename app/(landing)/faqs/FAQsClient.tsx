"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  Lock,
  Zap,
  Globe,
  CheckCircle,
  Clock,
  BarChart3,
  Code,
  FileText,
  GraduationCap,
  CheckSquare,
  Shield,
  Camera,
  MessageSquare,
  ArrowRight,
  Search,
  EyeOff,
  Brain,
  PieChart,
  Puzzle,
  Bell,
  Briefcase,
  UserPlus,
  Building2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface FAQItem {
  icon: React.ElementType;
  question: string;
  answer: string;
}

export default function FAQsClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"candidate" | "recruiter">(
    "candidate"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Set active tab from URL parameter on mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "recruiter" || tab === "candidate") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
  }, [searchParams]);

  const candidateFAQs: FAQItem[] = [
    // Platform Understanding
    {
      icon: Briefcase,
      question:
        "How is this skill-first hiring platform different from traditional hiring portals?",
      answer: `TechSmartHire replaces resume-based shortlisting with skill-based evaluation.

Instead of recruiters spending hours scanning resumes filled with keywords, they can directly see:

• Your verified skill score
• The exact areas you were assessed on
• Your readiness for the role

This saves time for recruiters and gives genuine candidates a fair chance to be noticed for what they can actually do — not how well their resume is written.`,
    },
    {
      icon: Users,
      question:
        "Is this skill assessment only for candidates who are actively looking for a job change?",
      answer: `Not at all.

Once you take an assessment, your score and profile remain active on the platform for over a year.

So even if you're not planning a job switch right now, recruiters can still discover your profile when:
• Your skills match their requirements, and
• The opportunity aligns with your expected salary and preferences.

Who knows — a great opportunity you simply can't ignore might knock on your door when you're present on the platform with your skills at the core.

You're always in control and can choose to respond only when the right opportunity comes along.`,
    },
    {
      icon: Award,
      question:
        "Is the skill score useful only for jobs, or can it help with freelancing and side-hustle opportunities too?",
      answer: `It goes beyond full-time jobs.

Your assessment score is a verified proof of your skill level, and we plan to use it for more than just hiring.

In Phase 2 of TechSmartHire, we will introduce a freelance and job-support marketplace where:
• Professionals and teams needing short-term help can search for talent based on skill scores
• They can invite suitable candidates for freelance tasks, job support, or short projects
• Once you connect, you're free to take the discussion offline and complete the work independently.

A strong score today can unlock both career opportunities and side-income opportunities tomorrow.`,
    },
    {
      icon: Search,
      question: "As a candidate, can I apply for jobs using my skill score?",
      answer: `Yes.

Our Jobs module will be live in March.

This will make the platform bidirectional:

• Recruiters can discover you by viewing your profile and skill score
and
• You can find relevant job openings and apply by showcasing your verified skill score along with your profile

Your score becomes your strongest proof while applying for jobs.`,
    },
    // Assessment Process
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
      icon: Code,
      question:
        "I see one coding question in each assessment. Do I need to write everything from scratch?",
      answer: `Not necessarily. The coding editor is preconfigured with all required imports and basic setup.

You only need to focus on implementing the correct logic to solve the problem.`,
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
    // Security & Proctoring
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
    // Scoring & Results
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
      icon: CheckCircle,
      question: "Will I receive any Professional certificate?",
      answer: `Yes. If you score above 60%, you will be eligible to receive a certification.

This certificate can serve as a strong credential when applying for jobs.`,
    },
    {
      icon: Clock,
      question: "How long is my assessment score valid on the platform?",
      answer: `Your score remains valid and visible to recruiters for a full 365 days from the date of assessment.

After that period:
• Your score will expire
• You will need to retake the assessment if you wish to remain visible to recruiters

This ensures that scores reflect current, up-to-date skill levels — not outdated credentials.`,
    },
    {
      icon: CheckCircle,
      question: "Can I retake the assessment if I'm not happy with my score?",
      answer: `Yes, but with conditions to maintain fairness:

You can retake the assessment:
• Only after a 2-month cooling period from your last attempt

However:
• Recruiters will see both your scores — the old one and the new one
• Multiple low attempts may raise concerns with recruiters

We recommend using the cooling period to upskill rather than attempting blindly.`,
    },
    // Privacy & Control
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
      icon: EyeOff,
      question:
        "Can recruiters see my profile and score even if I'm currently working and don't want my employer to know?",
      answer: `Absolutely. Your profile remains discoverable by recruiters based on your skills and preferences — but your identity (name, email, phone) stays hidden.

A recruiter can only see:
• Your masked profile
• Your skill score
• Your assessment name and date

They cannot know who you are unless you choose to reveal your details.

So even if you're employed or not actively looking, recruiters can still discover you based on your skills and reach out. You decide if you want to engage.`,
    },
    // Career Benefits & Opportunities
    {
      icon: Search,
      question: "How will recruiters find my profile?",
      answer: `Recruiters can discover you by:
• Searching for specific skills
• Filtering by score ranges
• Reviewing top performers in particular assessments

If your profile matches their search criteria and your score aligns with what they're looking for, you'll show up in their talent pool.`,
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
      icon: Globe,
      question:
        "Can candidates from outside India take this assessment and be eligible for international positions?",
      answer: `Yes. TechSmartHire welcomes candidates from all over the world.

However, we are currently launching job postings in the UAE only. If your location is UAE or if you're open to opportunities in the UAE, you'll see relevant job postings.

For other regions, we will expand job postings gradually as we onboard more recruiters from different geographies.`,
    },
    {
      icon: Brain,
      question: "Is my assessment score the only factor recruiters consider?",
      answer: `No. Your score is a strong foundation, but it's not the only factor.

Recruiters also look at:
• Your overall profile details
• Your educational background
• Your work experience
• Your expected salary
• How well your profile aligns with the role they're hiring for

A good score opens the door — but your complete profile helps you stand out.`,
    },
  ];

  const recruiterFAQs: FAQItem[] = [
    // Platform Understanding
    {
      icon: Briefcase,
      question:
        "How is this skill-first hiring platform different from traditional hiring portals?",
      answer: `TechSmartHire replaces resume-based shortlisting with skill-based evaluation.

Instead of spending hours reviewing resumes filled with keywords, you get instant access to:

• Verified skill scores of candidates
• The exact skills they were assessed on
• Their readiness for the role based on real performance

This allows you to shortlist candidates based on proven ability, not resume formatting.

The result: faster screening, better quality candidates, and significantly reduced hiring time.`,
    },
    {
      icon: Search,
      question:
        "As a recruiter, can I post a job and allow candidates to apply using their skill scores?",
      answer: `Yes.

With the Jobs module going live in March, you will be able to post job openings directly on TechSmartHire.

This makes the platform bidirectional:

• You can discover candidates from the Talent Pool based on their skill scores
and
• Candidates can apply to your posted jobs by submitting their profile along with their verified assessment score

This means you don't receive resumes — you receive applications backed by proven skill scores, making shortlisting faster and far more reliable.`,
    },
    // Finding & Filtering Talent
    {
      icon: Search,
      question: "How do I find the best talent for my requirement?",
      answer: `You get access to the Talent Pool where you can apply smart filters such as:
• Location
• Experience
• Expected salary
• Notice period

Once filtered, you can instantly see candidate scores and the skills they were assessed on — helping you quickly decide whom to reach out to.

No resumes. No guesswork. Just skill-based filtering.`,
    },
    {
      icon: Brain,
      question: "How do I know what skills a candidate was assessed on?",
      answer: `In the Talent Pool view, every score is clearly shown along with the skills covered in that assessment.

This gives you a complete picture in a single glance — score + skill area.`,
    },
    {
      icon: PieChart,
      question:
        "Can I see a detailed score report of how the candidate performed in each skill?",
      answer: `Yes.

You can request a detailed assessment report, which includes:
• Skill-wise performance breakdown
• Proctoring report
• Exam session recording (if required)

Just reach out to us, and we'll share the full report.`,
    },
    {
      icon: Bell,
      question:
        "I can't log in every day to check the Talent Pool. Is there a better way?",
      answer: `Absolutely.

Share your hiring criteria with us, and we will set up smart notifications.

You'll receive an email alert whenever a candidate matching your filters appears on the platform.`,
    },
    // Connecting with Candidates
    {
      icon: EyeOff,
      question:
        "I don't see candidate contact details. Do I need to invite them first?",
      answer: `Yes.

For privacy reasons, candidate contact details are hidden by default.

To unlock them:
• Create a job on the portal
• Invite the candidate to apply
• If the candidate is interested and applies, their contact details are revealed to you

This ensures candidates feel safe and you connect only with interested profiles.`,
    },
    // Custom Requirements & Scaling
    {
      icon: Puzzle,
      question:
        "What if my job requirement doesn't match any existing assessments?",
      answer: `No problem.

Share your custom requirement with us, and we will:
• Design a tailored assessment specific to your needs
• Provide you with a dedicated assessment link to share with candidates

You can then evaluate candidates based on that custom test.`,
    },
    {
      icon: Globe,
      question:
        "I have a job opening. Can I share the assessment link publicly?",
      answer: `Yes.

If an existing assessment matches your job role, you can:
• Share the assessment link publicly
• Invite external candidates to take the test

Their scores will automatically appear in your Talent Pool, where you can review and shortlist them.`,
    },
    {
      icon: Building2,
      question:
        "I have bulk hiring needs and don't have time to manage this process. Can you help?",
      answer: `Definitely.

For multiple openings, our team can:
• Promote your job requirements
• Invite relevant candidates to take assessments
• Pre-filter and shortlist profiles based on your criteria

You get a ready list of qualified candidates without spending hours screening.`,
    },
    // Additional Use Cases
    {
      icon: Briefcase,
      question:
        "I am an employee and need job support for short-term tasks. Can I use this platform?",
      answer: `Yes.

In Phase 2, we will open a freelance/job-support feature where you can:
• Post short-term requirements
• Invite candidates based on skill scores
• Coordinate directly with them for your tasks`,
    },
    {
      icon: UserPlus,
      question:
        "I'm an employee and see internal openings in my company. Can I refer candidates from here?",
      answer: `Absolutely.

This is a great way to:
• Identify strong candidates based on verified skill scores
• Refer them for internal openings in your company
• Earn referral bonuses with confidence

Skill scores make your referral far more credible.`,
    },
  ];

  const currentFAQs = activeTab === "candidate" ? candidateFAQs : recruiterFAQs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-purple-600 via-violet-600 to-purple-700 text-white py-16 mt-16 md:mt-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[64px_64px]"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Find answers to common questions about assessments, hiring, and
              the TechSmartHire platform
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => {
                setActiveTab("candidate");
                setOpenIndex(null);
              }}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeTab === "candidate"
                  ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Candidate FAQs</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("recruiter");
                setOpenIndex(null);
              }}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeTab === "recruiter"
                  ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>Recruiter FAQs</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {activeTab === "candidate"
                ? "Candidate Questions"
                : "Recruiter Questions"}
            </h2>
            <p className="text-slate-600">
              {activeTab === "candidate"
                ? "Everything you need to know about assessments and career opportunities"
                : "Learn how to find, evaluate, and hire the best talent"}
            </p>
          </div>

          <div className="space-y-4">
            {currentFAQs.map((faq, index) => (
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
                      openIndex === index
                        ? "bg-blue-200 rotate-180"
                        : "bg-slate-100"
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
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-linear-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help.
          </p>
          <a
            href="mailto:info@techsmarthire.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Contact Support</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
