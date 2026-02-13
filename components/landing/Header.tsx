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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
              alt="SmartTechHire Logo"
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
            <Link
              href="/assessments"
              className={`text-base font-semibold transition-all flex items-center gap-2 ${
                pathname === "/assessments"
                  ? "text-blue-600 scale-105"
                  : "text-slate-700 hover:text-blue-600 hover:scale-105"
              }`}
            >
              <FileText className="w-5 h-5" />
              Assessments
            </Link>
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
            <Link
              className="flex gap-2 items-center rounded-md px-4 py-2 cursor-pointer bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              href="/authentication"
            >
              <LogIn className="w-5 h-5 mr-1" />
              Signup/Signin
            </Link>
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
            <Link
              href="/assessments"
              className={`text-base font-semibold transition-all flex items-center gap-2 py-2 ${
                pathname === "/assessments"
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText className="w-5 h-5" />
              Assessments
            </Link>
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

            <Link
              className="flex gap-2 items-center justify-center rounded-md px-4 py-3 mt-2 cursor-pointer bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white font-semibold shadow-md"
              href="/authentication"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="w-5 h-5 mr-1" />
              Signup/Signin
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Header;
