"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  UserCircle,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: FileCheck,
    title: "Take Assessments",
    description:
      "Complete skill-based tests that showcase your real abilities to employers.",
    features: ["Industry-standard tests", "Verified scores", "One-time effort"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    icon: UserCircle,
    title: "Get Skill Profile",
    description:
      "Your verified skill scores create a comprehensive profile that stands out.",
    features: ["Skill percentiles", "Badge system", "Portfolio integration"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    icon: Briefcase,
    title: "Recruiters Shortlist You",
    description:
      "Get discovered by top companies actively searching for your skill set.",
    features: ["Auto-matching", "Direct messages", "Interview invites"],
    color: "from-accent to-green-500",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Happens After Signup?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to transform your job search experience
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-linear-to-r from-primary/20 via-accent/40 to-primary/20" />

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Arrow between cards (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-24 z-10">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}

                <div className="relative group">
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${step.color} opacity-0 group-hover:opacity-1 blur-2xl transition-opacity duration-500 rounded-3xl`}
                  />

                  <div className="relative bg-card border border-border/50 rounded-3xl p-8 text-center hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div
                        className={`w-8 h-8 rounded-full bg-linear-to-r ${step.color} flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg`}
                      >
                        {step.id}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br ${step.color} p-0.5`}
                    >
                      <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                        <step.icon className="w-9 h-9 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {step.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mobile arrow */}
                {index < steps.length - 1 && (
                  <div className="flex md:hidden justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
