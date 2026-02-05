"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Users } from "lucide-react";

// Custom icon for No Spam
const NoSpamIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
    />
  </svg>
);

export default function TrustStrip() {
  const features = [
    {
      icon: CheckCircle2,
      title: "Skill-Verified",
      description: "Pre-vetted talent",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: "AI-Based Matching",
      description: "Perfect role fit",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: NoSpamIcon,
      title: "No Spam",
      description: "Curated applications",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Users,
      title: "1M+ Learners",
      description: "Proven track record",
      color: "text-indigo-600",
      bgColor: "bg-indigo-600/10",
    },
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${feature.bgColor} ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground">{feature.title}</h3>
              <p className="text-xs text-subtle">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
