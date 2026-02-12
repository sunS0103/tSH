"use client";

import {
  MessageSquare,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import HeroSection from "@/components/anticipation/hero-section";
import WhoIsItForSection from "@/components/anticipation/who-is-it-for-section";
import LaunchFocus from "@/components/anticipation/launch-focus";
import WhySection from "@/components/anticipation/why-section";
import CredibilityStrip from "@/components/anticipation/credibility-strip";

export default function AnticipationPage() {

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsItForSection onRoleSelect={handleRoleSelect} />
      <LaunchFocus />
      <WhySection />
      <CredibilityStrip />
      
      {/* QA Job Fair Promotion */}
      <section className="py-16 bg-linear-to-br from-emerald-600 via-blue-600 to-emerald-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[64px_64px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Limited Time Opportunity
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Join the Feb–March <span className="text-yellow-300">QA Job Fair Program</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Showcase your skills. Get shortlisted faster.
          </p>
          
          <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Take verified skill assessments, get discovered by hiring managers, and unlock opportunities for full-time roles and freelance work — all without relying on resumes.
          </p>
          
          <button
            onClick={() => document.getElementById("who-is-it-for")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-emerald-600 font-bold text-lg md:text-xl hover:bg-yellow-300 hover:text-slate-900 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <span>👉 Explore the QA Job Fair</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-300" />
              <span>Multiple QA Positions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-300" />
              <span>Top Companies Hiring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-300" />
              <span>100% Skill-Based</span>
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
              FAQs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Questions, <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Answered</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Everything you need to know about getting hired and hiring for full-time and freelancing roles on TechSmartHire.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById("who-is-it-for")?.scrollIntoView({ behavior: "smooth" })}
              className="group cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-105"
            >
              <Users className="w-6 h-6" />
              <span>Candidate FAQs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => document.getElementById("who-is-it-for")?.scrollIntoView({ behavior: "smooth" })}
              className="group cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 hover:shadow-xl transition-all hover:scale-105"
            >
              <Briefcase className="w-6 h-6" />
              <span>Recruiter FAQs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
