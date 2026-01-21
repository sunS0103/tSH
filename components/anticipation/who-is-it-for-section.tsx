"use client";

import { motion } from "framer-motion";
import { UserCircle, Briefcase, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WhoIsItForSectionProps {
  onRoleSelect: (role: "candidate" | "recruiter") => void;
}

const WhoIsItForSection: React.FC<WhoIsItForSectionProps> = ({
  onRoleSelect,
}) => {
  const router = useRouter();
  const personas = [
    {
      icon: UserCircle,
      title: "For Candidates",
      emoji: "🧑‍💻",
      color: "from-primary to-primary/70",
      benefits: [
        "Show what you know with skill-based assessments",
        "Let recruiters find you - no chasing required",
        "Move beyond resume-based rejections",
      ],
      buttonText: "Get Insider Access",
      subtext:
        "Beat the rush. Secure your priority spot for our upcoming Pilot Job Fair before the platform goes public.",
      role: "candidate" as const,
    },
    {
      icon: Briefcase,
      title: "For Recruiters",
      emoji: "🧑‍💼",
      color: "from-secondary to-secondary/70",
      benefits: [
        "Discover candidates based on verified skills",
        "Avoid resume spam and blind screening",
        "Shortlist with confidence using role-based skill benchmarks",
      ],
      buttonText: "Join the Pilot Program",
      subtext:
        "Hiring in coming weeks? Email <a href='mailto:info@techsmarthire.com' class='text-primary hover:underline font-medium'>info@techsmarthire.com</a> to get immediate access to our next Pilot Job Fair.",
      role: "recruiter" as const,
      badge: "100% Proctored & AI-Proof Assessments",
    },
  ];

  return (
    <section id="who-is-it-for" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background" />

      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Who Is TechSmartHire <span className="gradient-text">For?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="group h-full p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card-hover flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${persona.color} flex items-center justify-center shadow-glow`}
                  >
                    <persona.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-2xl mr-2">{persona.emoji}</span>
                    <h3 className="text-xl font-bold inline">
                      {persona.title}
                    </h3>
                  </div>
                </div>

                {/* Benefits */}
                <ul className="space-y-4 mb-6">
                  {persona.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.2 + i * 0.1,
                      }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-subtle leading-relaxed">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Badge for Recruiters */}
                {"badge" in persona && persona.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-auto mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 w-fit"
                  >
                    <span className="text-sm font-medium text-secondary">
                      {persona.badge}
                    </span>
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-auto"
                >
                  <button
                    onClick={() => {
                      if (persona.role === "recruiter") {
                        router.push("/qa-job-fair-feb");
                      } else {
                        onRoleSelect(persona.role);
                      }
                    }}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      persona.role === "candidate"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow"
                        : "bg-secondary text-primary-foreground hover:bg-secondary/90 hover:shadow-glow-secondary"
                    }`}
                  >
                    {persona.buttonText}
                  </button>
                  <p
                    dangerouslySetInnerHTML={{ __html: persona.subtext }}
                    className="mt-3 text-sm text-subtle text-center leading-relaxed"
                  ></p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsItForSection;
