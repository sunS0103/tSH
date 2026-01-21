"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Globe,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  MapPin,
  Building2,
  FileText,
} from "lucide-react";
import config from "./config.json";
import RecruiterForm from "@/components/qa-job-fair-feb/recruiter-form";

// Icon mapping for config icons
const iconMap: Record<string, React.ElementType> = {
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
};

interface Job {
  jobId: string;
  title: string;
  companies: string[];
  experience: string[];
  location: string[];
  examId: string;
  route: string;
}

interface SelectionStep {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function techSmartHireLanding() {
  const router = useRouter();
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownLabel, setCountdownLabel] = useState(
    config.countdownLabels.beforeStart
  );

  const startDate = new Date(config.event.startDate).getTime();
  const endDate = new Date(config.event.endDate).getTime();

  // Smart countdown timer - shows time until start date, then switches to time until end date
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();

      // If before start date, count down to start
      if (now < startDate) {
        const distance = startDate - now;
        setCountdownLabel(config.countdownLabels.beforeStart);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
      // If after start but before end, count down to end
      else if (now >= startDate && now < endDate) {
        const distance = endDate - now;
        setCountdownLabel(config.countdownLabels.during);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
      // If after end date, show zeros
      else {
        setCountdownLabel(config.countdownLabels.ended);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  const jobs: Job[] = config.jobs;

  const selectionSteps: SelectionStep[] = config.selectionSteps.map((step) => ({
    ...step,
    icon: iconMap[step.icon] || Shield,
  }));

  const handleViewDetailsAndSignup = (job: Job) => {
    // Navigate to exam registration page
    router.push(job.route);
  };

  const handleRecruiterClick = () => {
    setIsFormPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-blue-50 to-white">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-size-[64px_64px]"></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-48 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-100 to-blue-100 border-2 border-emerald-500 text-sm font-semibold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                {config.event.name}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900">
              <span className="block">{config.hero.title.primary}</span>
              <span className="block mt-2 pb-2 md:pb-4 bg-linear-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {config.hero.title.secondary}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-700 leading-relaxed">
              {config.hero.description.split("instantly")[0]}
              <span className="text-emerald-600 font-semibold">instantly</span>.
            </p>

            {/* Event Details Bar */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-slate-200 shadow-xl p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-linear-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-300">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-600 mb-1 font-medium">
                        {config.labels.assessmentPeriod}
                      </p>
                      <p className="font-bold text-slate-900">
                        {config.hero.assessmentPeriod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 border-2 border-blue-300">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-600 mb-1 font-medium">
                        {config.labels.companiesParticipating}
                      </p>
                      <p className="font-bold text-slate-900">
                        {config.stats.companiesParticipating}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-linear-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-300">
                      <Globe className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-slate-600 mb-1 font-medium">
                        {config.labels.positionsOpen}
                      </p>
                      <p className="font-bold text-slate-900">
                        {config.stats.positionsOpen}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Fair Stats */}
            <div className="max-w-3xl mx-auto mt-8">
              <div className="bg-linear-to-r from-blue-50 to-emerald-50 rounded-2xl border-2 border-blue-200 p-6">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-900 font-semibold">
                      {config.labels.jobLocations}: {config.stats.jobLocations}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="max-w-2xl mx-auto mt-12">
              <p className="text-sm uppercase tracking-wider text-slate-600 font-semibold mb-4">
                {countdownLabel}
              </p>
              <div className="grid grid-cols-4 md:gap-4 gap-2">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white backdrop-blur-xl rounded-xl border-2 py-3 md:py-6 border-slate-200 shadow-lg"
                  >
                    <div className="text-2xl md:text-5xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs md:text-sm text-slate-600 mt-2 uppercase tracking-wider font-semibold">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions & Associated Assessments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Open Positions &{" "}
              <span className="bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Associated Assessments
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Each position requires a specific assessment to validate your
              skills. Take the exam to get shortlisted by hiring companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-400 p-8 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-100 to-blue-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative flex flex-col grow">
                  {/* Job ID Badge */}
                  <div className="w-max inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-mono text-slate-700 mb-4">
                    <FileText className="w-3.5 h-3.5" />
                    {job.jobId}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {job.title}
                  </h3>

                  {/* Company Names - HIGHLIGHTED */}
                  <div className="mb-4 p-4 rounded-xl bg-linear-to-r from-emerald-50 to-blue-50 border-2 border-emerald-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        {config.labels.hiringCompanies}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.companies.map((company, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-white border-2 border-emerald-400 text-sm font-bold text-emerald-700 shadow-sm"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Location */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-sm text-emerald-700 font-medium"
                      >
                        {exp}
                      </div>
                    ))}
                    {job.location.map((loc, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-300 text-sm text-blue-700 font-medium"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {loc}
                      </div>
                    ))}
                  </div>

                  {/* Assessment Info */}
                  <div className="mb-6 p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs text-slate-600 mb-1 font-semibold uppercase tracking-wide">
                      {config.labels.requiredAssessment}
                    </p>
                    <p className="font-mono text-sm text-blue-600 font-bold mb-1">
                      {job.examId}
                    </p>
                  </div>

                  {/* Single Strong Action Button */}
                  <button
                    onClick={() => handleViewDetailsAndSignup(job)}
                    className="relative w-full group/btn overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 via-blue-600 to-emerald-600 p-[3px] transition-all hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-[1.02] animate-gradient mt-auto cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity"></div>
                    <div className="relative bg-linear-to-r from-emerald-600 to-blue-600 rounded-[10px] px-8 py-4 flex items-center justify-center gap-3">
                      <FileText className="w-5 h-5 text-white" />
                      <span className="font-black text-lg text-white">
                        {config.cta.viewDetailsButton}
                      </span>
                      <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Story */}
      <section className="py-20 bg-linear-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                The Selection Story
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              A transparent 6-step workflow designed for fairness
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-linear-to-b from-emerald-400 via-blue-400 to-emerald-400"></div>

              <div className="space-y-4">
                {selectionSteps.map((step, idx) => (
                  <div key={idx} className="relative flex gap-8 group">
                    {/* Number circle */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                        {step.number}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-12">
                      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 md:p-8 group-hover:border-emerald-400 group-hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                          <div className="p-3 rounded-xl bg-linear-to-br from-emerald-100 to-blue-100 border-2 border-emerald-300">
                            <step.icon className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-slate-900">
                              {step.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Form Popup */}
      {isFormPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFormPopupOpen(false)}
          />

          {/* Modal Panel - centered */}
          <div className="relative w-full max-w-2xl md:max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsFormPopupOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Recruiter Registration Section Content */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-white to-emerald-50 border-2 border-blue-300">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-size-[32px_32px]"></div>

              <div className="relative p-2 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border-2 border-blue-400 text-sm font-bold text-blue-700 mb-6">
                    <Users className="w-4 h-4" />
                    {config.recruiterSection.badge}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                    {config.recruiterSection.title}
                  </h2>

                  <p className="text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto mb-8">
                    {config.recruiterSection.description}
                  </p>

                  {/* Benefits */}
                  <div className="mb-8 p-6 rounded-2xl bg-white border-2 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">
                      What You Get:
                    </h4>
                    <ul className="space-y-2 text-slate-700">
                      {config.recruiterSection.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-start">
                            <strong>{benefit.title}:</strong>{" "}
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

        
                </div>

                {/* Recruiter Form */}
                <RecruiterForm />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Call-to-Action Banner - Bottom */}
      <section className="py-16 bg-white border-t-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div
            onClick={handleRecruiterClick}
            className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-700 to-emerald-600 p-1 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>

            <div className="relative bg-linear-to-br from-blue-50 to-emerald-50 rounded-[22px] p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border-2 border-blue-300 text-sm font-bold text-blue-700 mb-4">
                    <Users className="w-4 h-4" />
                    {config.cta.recruiterBadge}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    {config.cta.recruiterTitle}
                  </h3>

                  <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
                    {
                      config.cta.recruiterDescription.split(
                        "pre-vetted, skill-verified QA talent"
                      )[0]
                    }
                    <span className="font-bold text-blue-700">
                      pre-vetted, skill-verified QA talent
                    </span>
                    . Skip weeks of resume screening and interview only
                    candidates who've already proven their expertise.
                  </p>
                </div>

                <div className="shrink-0">
                  <button className="group/cta relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 font-bold text-lg text-white hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105 cursor-pointer">
                    <span>{config.cta.recruiterButton}</span>
                    <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform" />
                  </button>

                  <p className="mt-3 text-center text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                      {config.cta.recruiterSlots}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-700 mb-2">
                {config.footer.builtBy}
              </p>
              <p className="text-sm text-slate-600">
                {config.footer.instructorDescription}
              </p>
            </div>

            <a
              href={config.footer.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
            >
              <svg
                className="w-6 h-6 fill-current text-slate-600 group-hover:text-emerald-600 transition-colors"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                {config.footer.linkedinText}
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
