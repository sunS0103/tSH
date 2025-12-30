"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Lock, Award, Briefcase, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const candidates = [
  {
    id: 1,
    name: "S.",
    avatar: "JS",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    experience: "6 years",
    score: 94,
    location: "San Francisco, CA",
    availability: "Immediate",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "K.",
    avatar: "PK",
    skills: ["Python", "Django", "AWS", "PostgreSQL"],
    experience: "5 years",
    score: 91,
    location: "New York, NY",
    availability: "2 weeks",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "R.",
    avatar: "AR",
    skills: ["Java", "Spring Boot", "Kubernetes", "MongoDB"],
    experience: "8 years",
    score: 97,
    location: "Austin, TX",
    availability: "Immediate",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    name: "L.",
    avatar: "EL",
    skills: ["Go", "Docker", "CI/CD", "Terraform"],
    experience: "4 years",
    score: 88,
    location: "Remote",
    availability: "1 week",
    color: "from-green-500 to-teal-500",
  },
  {
    id: 5,
    name: "M.",
    avatar: "SM",
    skills: ["Vue.js", "Nuxt", "Firebase", "TailwindCSS"],
    experience: "3 years",
    score: 85,
    location: "Seattle, WA",
    availability: "Immediate",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    name: "T.",
    avatar: "DT",
    skills: ["Ruby", "Rails", "Redis", "Elasticsearch"],
    experience: "7 years",
    score: 92,
    location: "Denver, CO",
    availability: "3 weeks",
    color: "from-rose-500 to-orange-500",
  },
];

const TalentPoolPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse Pre-Verified Talent
          </h2>
          <p className="text-subtle text-lg max-w-2xl mx-auto">
            Every candidate is skill-tested. Unlock contact details when you
            find the right match.
          </p>
        </motion.div>

        {/* Candidate cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                {/* Header with avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${candidate.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {candidate.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-subtle" />
                        <span className="inline-block w-20 h-4 bg-muted-foreground/20 rounded" />
                        <span>{candidate.name}</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-subtle" />
                      <span className="text-sm text-subtle">
                        {candidate.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-secondary font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      {candidate.score}
                    </div>
                    <span className="text-xs text-subtle">Score</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-secondary/10 border-primary/20 text-foreground/80 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge
                      variant="outline"
                      className="bg-secondary/10 border-primary/20 text-xs text-primary"
                    >
                      +{candidate.skills.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm text-subtle mb-5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary/60" />
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-secondary" />
                    <span>{candidate.availability}</span>
                  </div>
                </div>

                {/* Contact locked badge */}
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
                  <Lock className="w-4 h-4 text-subtle" />
                  <span className="text-sm text-subtle">Contact Locked</span>
                </div>

                {/* Unlock button */}
                <Button variant="default" className="w-full group/btn">
                  <Lock className="w-4 h-4 mr-2 group-hover/btn:hidden" />
                  <Code2 className="w-4 h-4 mr-2 hidden group-hover/btn:block" />
                  <span className="group-hover/btn:hidden">
                    Unlock Candidate
                  </span>
                  <span className="hidden group-hover/btn:block">
                    View Full Profile
                  </span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View more hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button variant="outline" size="lg">
            Browse Candidates
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TalentPoolPreview;
