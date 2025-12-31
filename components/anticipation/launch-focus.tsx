"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const LaunchFocus = () => {
  return (
    <section className="py-12 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>

          <p className="text-lg md:text-xl font-medium text-foreground max-w-2xl">
            Launching first with{" "}
            <span className="text-primary font-bold">
              high-signal QA & Automation roles
            </span>{" "}
            — expanding to more tech roles soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LaunchFocus;
