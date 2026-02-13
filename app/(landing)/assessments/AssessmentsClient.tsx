"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Building2, MapPin, Briefcase } from "lucide-react";

interface Job {
  jobId: string;
  title: string;
  companies: string[];
  experience: string[];
  location: string[];
  examId: string;
  route: string;
  status: string;
}

export default function AssessmentsClient({ jobs }: { jobs: Job[] }) {
  return (
    <div className="min-h-screen text-slate-900">
      <section className="relative overflow-hidden pt-24 md:pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Skill-Based Assessments
          </h1>
          <p className="text-lg text-slate-600 mb-12">
            Take role-based QA assessments and get shortlisted by top engineering teams.
          </p>

          <div className="space-y-6">
            {jobs.map((job) => {
              const isComingSoon = job.status === "coming soon";
              return (
                <div
                  key={job.jobId}
                  className={`rounded-xl border-2 p-6 ${
                    isComingSoon
                      ? "border-slate-200 bg-slate-50 opacity-75"
                      : "border-slate-200 bg-white shadow-sm hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.companies.slice(0, 2).join(", ")}
                          {job.companies.length > 2 && " + more"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.experience.join(", ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location.slice(0, 2).join(", ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Exam ID: {job.examId}</p>
                    </div>
                    <div className="shrink-0">
                      {isComingSoon ? (
                        <span className="inline-flex px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm border border-yellow-300">
                          Coming Soon
                        </span>
                      ) : (
                        <Link
                          href="/authentication"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-700 hover:to-violet-700 transition-all"
                        >
                          Signup for Exam
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
