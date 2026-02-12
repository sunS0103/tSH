"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo.svg"
              alt="techSmartHire Logo"
              width={150}
              height={150}
            />
          </Link>
          <div className="hidden md:block">
            <Link
              href="/"
              className="text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="block py-2 text-base font-semibold text-slate-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Header;
