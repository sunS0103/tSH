"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Briefcase,
  Rocket,
  MessageSquare,
  Home,
  LogIn,
  Calendar,
  Mail,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import jobFairConfig from "@/app/(landing)/qa-job-fair/config.json";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssessmentsOpen, setIsAssessmentsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    if (pathname !== "/") {
      router.push("/#who-is-it-for");
    } else {
      document
        .getElementById("who-is-it-for")
        ?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const isVisible =
    process.env.NODE_ENV !== "production" ||
    new Date() >= new Date("2026-02-06T18:00:00Z");

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo.svg"
              alt="techSmartHire Logo"
              width={150}
              height={150}
            />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-base font-semibold transition-all flex items-center gap-2 ${
                pathname === "/"
                  ? "text-blue-600 scale-105"
                  : "text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/qa-job-fair"
              className={`text-base font-semibold transition-all flex items-center gap-2 ${
                pathname === "/qa-job-fair"
                  ? "text-blue-600 scale-105"
                  : "text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Job Fair
            </Link>

            {/* Assessments Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAssessmentsOpen(true)}
              onMouseLeave={() => setIsAssessmentsOpen(false)}
            >
              <button
                onClick={() => setIsAssessmentsOpen(!isAssessmentsOpen)}
                className={`text-base font-semibold transition-all flex items-center gap-2 ${
                  pathname.startsWith("/assessment") || isAssessmentsOpen
                    ? "text-blue-600 scale-105"
                    : "text-slate-700 hover:text-blue-600 hover:scale-105"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Assessments</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isAssessmentsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isAssessmentsOpen && (
                <div
                  className="absolute top-full left-0 pt-2 z-50"
                  onMouseEnter={() => setIsAssessmentsOpen(true)}
                  onMouseLeave={() => setIsAssessmentsOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-80 bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden"
                  >
                    <div className="py-2">
                      {jobFairConfig.jobs.map((job) => {
                        const isComingSoon = job.status === "coming soon";

                        if (isComingSoon) {
                          return (
                            <div
                              key={job.jobId}
                              className="px-4 py-3 cursor-not-allowed opacity-50 bg-slate-50 border-b border-slate-100 last:border-b-0 pointer-events-none select-none"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-slate-500 mb-1 line-clamp-2">
                                    {job.title}
                                  </div>
                                </div>
                                <span className="shrink-0 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">
                                  Coming Soon
                                </span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={job.jobId}
                            href={job.route}
                            className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
                            onClick={() => setIsAssessmentsOpen(false)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2 hover:text-blue-600">
                                  {job.title}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium border border-green-300">
                                    Live
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            <Link
              href="/faqs"
              className={`text-base font-semibold transition-all flex items-center gap-2 ${
                pathname === "/faqs"
                  ? "text-blue-600 scale-105"
                  : "text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              FAQs
            </Link>
            <Link
              href="/contact"
              className={`text-base font-semibold transition-all flex items-center gap-2 ${
                pathname === "/contact"
                  ? "text-blue-600 scale-105"
                  : "text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isVisible && (
              <Link
                className="flex gap-2 items-center rounded-md px-4 py-2 cursor-pointer bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                href={
                  status === "authenticated" && session
                    ? "/dashboard"
                    : "/authentication"
                }
              >
                <LogIn className="w-5 h-5 mr-1" />
                {status === "authenticated" && session
                  ? "Dashboard"
                  : "Signup/Signin"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-slate-200 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className={`text-base font-semibold transition-all flex items-center gap-2 py-2 ${
                pathname === "/"
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/qa-job-fair"
              className={`text-base font-semibold transition-all flex items-center gap-2 py-2 ${
                pathname === "/qa-job-fair"
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              Job Fair
            </Link>
            {/* Mobile Assessments Links */}
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-slate-700 flex items-center gap-2 py-2">
                <FileText className="w-5 h-5" />
                Assessments
              </span>
              <div className="pl-7 flex flex-col gap-2">
                {jobFairConfig.jobs.map((job) => {
                  const isComingSoon = job.status === "coming soon";
                  if (isComingSoon) {
                    return (
                      <span
                        key={job.jobId}
                        className="text-sm text-slate-400 py-1"
                      >
                        {job.title} (Coming Soon)
                      </span>
                    );
                  }
                  return (
                    <Link
                      key={job.jobId}
                      href={job.route}
                      className="text-sm text-slate-600 hover:text-blue-600 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {job.title}
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link
              href="/faqs"
              className={`text-base font-semibold transition-all flex items-center gap-2 py-2 ${
                pathname === "/faqs"
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="w-5 h-5" />
              FAQs
            </Link>
            <Link
              href="/contact"
              className={`text-base font-semibold transition-all flex items-center gap-2 py-2 ${
                pathname === "/contact"
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
            {(process.env.NODE_ENV !== "production" ||
              new Date() >= new Date("2026-02-06T18:00:00Z")) && (
              <Link
                className="flex gap-2 items-center justify-center rounded-md px-4 py-3 mt-2 cursor-pointer bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white font-semibold shadow-md"
                href={
                  status === "authenticated" && session
                    ? "/dashboard"
                    : "/authentication"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-5 h-5 mr-1" />
                {status === "authenticated" && session
                  ? "Dashboard"
                  : "Signup/Signin"}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Header;
