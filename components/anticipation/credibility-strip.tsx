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
            Built by an expert team led by{" "}
            <a
              href="https://www.linkedin.com/in/rahul-shetty-venkatesh/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              <span className="gradient-text hover:text-primary/80 underline underline-offset-4 decoration-2 decoration-primary/30 hover:decoration-primary transition-all">
                Rahul Shetty
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 382 382"
                xmlSpace="preserve"
                className="w-4 md:w-5 h-4 md:h-5 md:mt-1"
              >
                <path
                  style={{ fill: "#0077B7" }}
                  d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889  C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056  H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806  c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1  s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73  c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079  c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426  c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472  L341.91,330.654L341.91,330.654z"
                />
              </svg>
            </a>{" "}
            — a global instructor empowering{" "}
            <span className="gradient-text font-bold">
              1M+ tech professionals
            </span>{" "}
            worldwide.
          </h3>

          <p className="text-subtle text-lg">
            We understand skills. Now we're fixing hiring.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CredibilityStrip;
