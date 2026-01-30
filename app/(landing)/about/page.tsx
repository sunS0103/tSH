import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About TechSmartHire
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 leading-relaxed">
              From Empowering Learners to Empowering Careers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Founder Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/pp.jpeg"
                  alt="Founder - TechSmartHire"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 md:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                <Icon
                  icon="material-symbols:rocket-launch-outline"
                  className="w-5 h-5"
                />
                Founder's Story
              </div>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                For over a decade, I've had the privilege of{" "}
                <strong className="text-primary-600">
                  empowering more than 1 million learners worldwide
                </strong>{" "}
                in Quality Assurance, Automation, and modern testing skills.
              </p>

              <p className="text-gray-600 leading-relaxed">
                As a QA practitioner, instructor, and mentor, I've worked
                closely with:
              </p>

              <ul className="space-y-3">
                {[
                  "Freshers trying to break into tech",
                  "Experienced testers struggling to stand out",
                  "Hiring managers overwhelmed with irrelevant resumes",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon
                      icon="material-symbols:check-circle"
                      className="w-6 h-6 text-success-500 shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <p className="text-lg font-semibold text-gray-900 italic">
                  "One truth became painfully clear to me:{" "}
                  <span className="text-red-600">
                    The IT recruitment system is broken.
                  </span>
                  "
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Problem Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold mb-4">
              <Icon
                icon="material-symbols:crisis-alert-outline"
                className="w-5 h-5"
              />
              The Problem
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problem I Saw—Again and Again
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Candidates Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Icon
                    icon="material-symbols:person-search"
                    className="w-8 h-8 text-red-600"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Talented Candidates Rejected
                </h3>
              </div>

              <p className="text-gray-700 mb-4">
                Not because they lacked skills, but because:
              </p>

              <ul className="space-y-3">
                {[
                  'Their resumes didn\'t contain the "right keywords"',
                  'They didn\'t come from the "right" companies',
                  "Their real abilities couldn't be judged on paper",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon
                      icon="material-symbols:close"
                      className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiters Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Icon
                    icon="material-symbols:business-center-outline"
                    className="w-8 h-8 text-red-600"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recruiters Struggling Too
                </h3>
              </div>

              <ul className="space-y-3">
                {[
                  "Hundreds of resumes for a single role",
                  "Too much time spent filtering, interviewing, and re-interviewing",
                  "Candidates who looked good on paper but failed in real projects",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon
                      icon="material-symbols:close"
                      className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-gray-900">
                  Both sides were losing—time, trust, and opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why I Built This Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-8 md:p-12 mb-16 border border-primary-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 rounded-full text-sm font-semibold mb-6">
              <Icon
                icon="material-symbols:lightbulb-outline"
                className="w-5 h-5"
              />
              The Solution
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why I Built TechSmartHire
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              After training hundreds of thousands of QA professionals and
              speaking with countless hiring managers, I realized something:
            </p>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary-300">
              <p className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">
                "Skills should speak louder than resumes."
              </p>
              <p className="text-gray-700 text-lg">
                TechSmartHire was born from this belief.
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mt-8">
              This platform is designed to shift hiring from{" "}
              <strong className="text-red-600">keyword-driven resumes</strong>{" "}
              to{" "}
              <strong className="text-green-600">
                skill-driven assessments
              </strong>
              —where{" "}
              <span className="text-primary-600 font-semibold">
                what you can do matters more than how well your CV is written.
              </span>
            </p>
          </div>
        </div>

        {/* What TechSmartHire Solves */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-4">
              <Icon
                icon="material-symbols:check-circle-outline"
                className="w-5 h-5"
              />
              Our Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What TechSmartHire Solves
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Candidates */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Icon
                    icon="material-symbols:person-celebrate-outline"
                    className="w-8 h-8 text-primary-600"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Candidates
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 font-medium mb-3">No more:</p>
                <ul className="space-y-2">
                  {[
                    "Resume keyword stuffing",
                    "Blind job applications",
                    "Luck-based shortlisting",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-500"
                    >
                      <Icon
                        icon="material-symbols:do-not-disturb-on-outline"
                        className="w-5 h-5 text-red-400"
                      />
                      <span className="line-through">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-900 font-semibold mb-3">Instead:</p>
                <ul className="space-y-2">
                  {[
                    "Prove your skills through structured, real-world assessments",
                    "Get shortlisted based on ability—not background",
                    "Control when and with whom your profile is revealed",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon
                        icon="material-symbols:check-circle"
                        className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Icon
                    icon="material-symbols:badge-outline"
                    className="w-8 h-8 text-primary-600"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Recruiters
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 font-medium mb-3">No more:</p>
                <ul className="space-y-2">
                  {[
                    "Resume overload",
                    "Time wasted on mismatched candidates",
                    "Guesswork",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-500"
                    >
                      <Icon
                        icon="material-symbols:do-not-disturb-on-outline"
                        className="w-5 h-5 text-red-400"
                      />
                      <span className="line-through">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-900 font-semibold mb-3">Instead:</p>
                <ul className="space-y-2">
                  {[
                    "Access a pool of pre-assessed, skill-verified talent",
                    "Hire faster with higher confidence",
                    "Evaluate candidates based on real performance, not claims",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon
                        icon="material-symbols:check-circle"
                        className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Win-Win Model */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 mb-16 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold mb-6">
              <Icon
                icon="material-symbols:handshake-outline"
                className="w-5 h-5"
              />
              Our Model
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Win-Win Model for Modern Hiring
            </h2>

            <p className="text-xl text-primary-100 mb-8">
              TechSmartHire creates a trust-based hiring ecosystem:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: "material-symbols:verified-user-outline",
                  text: "Candidates are evaluated fairly",
                },
                {
                  icon: "material-symbols:schedule-outline",
                  text: "Recruiters save time and effort",
                },
                {
                  icon: "material-symbols:psychology-alt-outline",
                  text: "Skills become the currency—not resumes",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20"
                >
                  <Icon icon={item.icon} className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <p className="text-xl font-semibold mb-2">
                This isn't just another job portal.
              </p>
              <p className="text-2xl font-bold text-primary-100">
                It's a skills intelligence platform built for the future of IT
                hiring.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
                <Icon
                  icon="material-symbols:visibility-outline"
                  className="w-5 h-5"
                />
                Our Vision
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                My Vision
              </h2>
              <p className="text-xl text-gray-700">
                My vision is simple—but powerful:
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-8 mb-8 border-l-4 border-primary-500">
              <p className="text-2xl font-bold text-primary-700 text-center">
                To make skill-first hiring the global standard in tech
                recruitment.
              </p>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              I envision a world where:
            </p>

            <div className="space-y-4">
              {[
                "One strong assessment can open more doors than hundreds of applications",
                "Talent from any background gets equal opportunity",
                "Hiring decisions are driven by ability, not assumptions",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="p-2 bg-primary-100 rounded-lg shrink-0">
                    <Icon
                      icon="material-symbols:star"
                      className="w-6 h-6 text-primary-600"
                    />
                  </div>
                  <p className="text-gray-700 text-lg pt-1">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-700 mt-8 text-center">
              TechSmartHire is my step toward building that future—for learners,
              recruiters, and the tech ecosystem as a whole.
            </p>
          </div>
        </div>

        {/* Personal Commitment */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-semibold mb-6">
              <Icon
                icon="material-symbols:health-and-safety-outline"
                className="w-5 h-5"
              />
              My Commitment
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Personal Commitment
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              As someone whose reputation is built on trust, education, and
              results, I treat TechSmartHire not just as a product—but as a{" "}
              <strong className="text-white">responsibility.</strong>
            </p>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 mb-6">
              <p className="text-xl font-semibold text-primary-300">
                Every assessment, every feature, and every decision is designed
                with one goal in mind:
              </p>
            </div>

            <p className="text-2xl font-bold text-white">
              Helping the right talent meet the right opportunity—faster,
              fairer, and smarter.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 md:p-16 text-white">
          <Icon
            icon="material-symbols:celebration-outline"
            className="w-16 h-16 mx-auto mb-6 opacity-80"
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to TechSmartHire
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-primary-100 mb-8">
            Where skills speak louder than resumes.
          </p>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Today
            <Icon icon="material-symbols:arrow-forward" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
