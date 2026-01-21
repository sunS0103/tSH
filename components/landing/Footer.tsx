"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/Logo.svg"
              alt="techSmartHire Logo"
              width={150}
              height={150}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-subtle">Beta Version • Full Platform Launches March 2026</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-subtle">
            © {new Date().getFullYear()} techSmartHire. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
