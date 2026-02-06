"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            A Dual-Sided Experience
          </h2>
          <p className="text-subtle">
            Tailored journeys for both sides of the hiring table.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidate Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group hover:-translate-y-1 transition-transform duration-300 bg-card p-8 md:p-12 rounded-[2.5rem] border border-border/50 relative overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100%] opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-6 block">
                For Candidates
              </span>
              <h3 className="text-3xl font-bold mb-8 text-foreground">
                Accelerate your career through skills.
              </h3>
              <ul className="space-y-6 mb-10">
                <ListItem
                  icon={Check}
                  title="Take skill assessments"
                  description="Standardized tests that verify your actual coding and problem-solving abilities."
                  color="text-primary"
                  bgColor="bg-primary/10"
                />
                <ListItem
                  icon={Check}
                  title="Get discovered"
                  description="Recruiters search for top scorers, not just buzzwords on a PDF."
                  color="text-primary"
                  bgColor="bg-primary/10"
                />
                <ListItem
                  icon={Check}
                  title="Apply to relevant jobs"
                  description="AI matches you with roles where your skills are the primary requirement."
                  color="text-primary"
                  bgColor="bg-primary/10"
                />
              </ul>
              <a
                href="#"
                className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all"
              >
                Explore Candidate Experience
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Recruiter Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group hover:-translate-y-1 transition-transform duration-300 bg-card p-8 md:p-12 rounded-[2.5rem] border border-border/50 relative overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-[100%] opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-6 block">
                For Recruiters
              </span>
              <h3 className="text-3xl font-bold mb-8 text-foreground">
                Build high-performing teams, faster.
              </h3>
              <ul className="space-y-6 mb-10">
                <ListItem
                  icon={Check}
                  title="Search skill-verified talent"
                  description="Instantly filter for candidates with proven competency in specific technologies."
                  color="text-secondary"
                  bgColor="bg-secondary/10"
                />
                <ListItem
                  icon={Check}
                  title="Review score breakdowns"
                  description="See exactly how candidates performed in logic, architecture, and coding efficiency."
                  color="text-secondary"
                  bgColor="bg-secondary/10"
                />
                <ListItem
                  icon={Check}
                  title="Unlock talent profiles"
                  description="Request access to detailed profiles and contact info only when you're ready to hire."
                  color="text-secondary"
                  bgColor="bg-secondary/10"
                />
              </ul>
              <a
                href="#"
                className="inline-flex items-center gap-2 font-bold text-secondary hover:gap-4 transition-all"
              >
                Explore Recruiter Experience
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ListItem({
  icon: Icon,
  title,
  description,
  color,
  bgColor,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shrink-0 ${bgColor}`}
      >
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-subtle">{description}</p>
      </div>
    </li>
  );
}
