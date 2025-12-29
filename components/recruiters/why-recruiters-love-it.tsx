"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Wallet, Bot, Zap } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "No Spam Applications",
    description:
      "Only skill-verified candidates who meet your requirements can apply. No more wading through unqualified resumes.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Skill-wise Score Breakdown",
    description:
      "See exactly how each candidate performed across different skill areas. Make data-driven hiring decisions.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wallet,
    title: "Pay Only When You Connect",
    description:
      "Browse freely. You only use credits when you decide to unlock a candidate's contact details.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Bot,
    title: "AI-Ranked Talent",
    description:
      "Our AI matches candidates to your requirements and ranks them by relevance. Best fits surface first.",
    color: "from-orange-500 to-red-500",
  },
];

const WhyRecruitersLoveIt = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Why Recruiters Love It</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recruiting, <span className="gradient-text">Reimagined</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to find and hire top talent faster than ever
            before.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div
                    className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center shadow-lg shrink-0`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "70%", label: "Faster Hiring" },
            { value: "3x", label: "Better Matches" },
            { value: "50%", label: "Cost Reduction" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyRecruitersLoveIt;
