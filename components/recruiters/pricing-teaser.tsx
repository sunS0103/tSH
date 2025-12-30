"use client";

import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingTeaser = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-primary to-accent rounded-3xl blur-xl opacity-20" />
            <div className="relative bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-card overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-accent/10 to-transparent rounded-full blur-2xl -ml-24 -mb-24" />

              <div className="relative text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary mb-6">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Simple Pricing</span>
                </div>

                {/* Headline */}
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Start <span className="gradient-text">Free.</span>
                </h2>
                <p className="text-xl text-text mb-8 max-w-lg mx-auto">
                  Use credits only when you want to contact candidates.
                  <br />
                  No subscription. No hidden fees.
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                  {[
                    "Unlimited browsing",
                    "Free skill filters",
                    "AI-ranked results",
                    "Pay per unlock",
                  ].map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-secondary"
                    >
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button size="lg" className="group">
                  <Sparkles className="w-5 h-5" />
                  Create Recruiter Account
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>

                {/* Trust note */}
                <p className="text-sm text-text mt-6">
                  Join 500+ companies already hiring smarter
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingTeaser;
