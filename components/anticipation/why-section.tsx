"use client";

import { motion } from "framer-motion";
import SkillScorecard from "@/components/anticipation/skill-scorecard";

const WhySection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-linear-to-b from-primary to-accent rounded-r-full" />

      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
            Why We're <span className="gradient-text">Building This</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-linear-to-b from-primary/50 via-accent/50 to-primary/50 rounded-full" />

              <div className="pl-8 space-y-6 text-lg md:text-xl text-subtle leading-relaxed">
                <p className="text-2xl md:text-3xl font-semibold text-foreground">
                  Hiring today is broken.
                </p>

                <div className="space-y-2">
                  <p>Candidates apply blindly.</p>
                  <p>Recruiters screen endlessly.</p>
                  <p>Skills get lost behind resumes.</p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="pt-4"
                >
                  <p className="text-foreground font-medium">
                    TechSmartHire flips the model —
                  </p>
                  <p className="text-primary text-xl md:text-2xl font-semibold mt-2">
                    skills first, matching later, conversations only when it
                    matters.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Skill Scorecard Mockup */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 text-sm font-medium text-subtle bg-background/80 px-3 py-1 rounded-full border border-border/50 z-10">
                Real Candidate Scorecard
              </div>
              <SkillScorecard />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
