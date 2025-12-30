"use client";

import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";

const CredibilityStrip = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-accent/5 to-primary/5" />

      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
            Built by the team behind learning platforms trusted by{" "}
            <span className="gradient-text font-bold">
              1M+ tech professionals
            </span>{" "}
            worldwide.
          </h3>

          <p className="text-text text-lg">
            We understand skills. Now we're fixing hiring.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CredibilityStrip;
