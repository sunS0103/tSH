"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Users, Briefcase, Rocket } from "lucide-react";
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
    if (pathname === "/anticipation") {
      document
        .getElementById("waitlist")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/anticipation#waitlist");
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
          ? "bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo.svg"
              alt="TechSmartHire Logo"
              width={150}
              height={150}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/for-candidates"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              For Candidates
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/for-recruiters"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              For Recruiters
            </Link>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === "/anticipation"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Rocket className="w-4 h-4" />
              Anticipation
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" size="sm" onClick={scrollToForm}>
              Join Waitlist
            </Button>
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
          className="md:hidden bg-card border-b border-border"
        >
          <div className="container px-4 py-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/for-candidates"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-4 h-4" />
              For Candidates
            </Link>
            <Link
              href="/for-recruiters"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Briefcase className="w-4 h-4" />
              For Recruiters
            </Link>
            <Link
              href="/anticipation"
              className="flex items-center gap-2 text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Rocket className="w-4 h-4" />
              Anticipation
            </Link>
            <div className="pt-4 border-t border-border">
              <Button
                variant="default"
                className="w-full"
                onClick={scrollToForm}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Header;
