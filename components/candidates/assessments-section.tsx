"use client";

import { motion } from "framer-motion";
import { Clock, BarChart3, Users, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const assessments = [
  {
    id: 1,
    code: "FE-REACT-ADV",
    title: "Advanced React Development",
    skills: ["React", "Hooks", "Redux", "Performance"],
    difficulty: "Advanced",
    avgScore: 72,
    duration: "90 min",
    takers: "2.4k",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    code: "BE-NODE-INT",
    title: "Node.js Backend Engineering",
    skills: ["Node.js", "Express", "REST APIs", "MongoDB"],
    difficulty: "Intermediate",
    avgScore: 68,
    duration: "75 min",
    takers: "3.1k",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    code: "FS-MERN-PRO",
    title: "MERN Stack Proficiency",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    difficulty: "Professional",
    avgScore: 65,
    duration: "120 min",
    takers: "1.8k",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    code: "DS-PYTHON-ML",
    title: "Python & Machine Learning",
    skills: ["Python", "NumPy", "Pandas", "Scikit-learn"],
    difficulty: "Advanced",
    avgScore: 58,
    duration: "90 min",
    takers: "2.9k",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    code: "DEVOPS-AWS",
    title: "AWS & DevOps Essentials",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    difficulty: "Intermediate",
    avgScore: 71,
    duration: "60 min",
    takers: "1.5k",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: 6,
    code: "SYS-DESIGN",
    title: "System Design Interview",
    skills: ["Architecture", "Scalability", "Databases", "Caching"],
    difficulty: "Professional",
    avgScore: 54,
    duration: "120 min",
    takers: "4.2k",
    color: "from-indigo-500 to-violet-500",
  },
];

const difficultyColors: Record<string, string> = {
  Intermediate: "bg-green-500/10 text-green-600 border-green-500/30",
  Advanced: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  Professional: "bg-purple-500/10 text-purple-600 border-purple-500/30",
};

const AssessmentsSection = () => {
  return (
    <section id="assessments" className="py-24  relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Skill Assessments</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Prove Your Skills Once.
            <br />
            <span className="gradient-text">
              Get Shortlisted Multiple Times.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take industry-standard assessments and let your verified skills
            speak for themselves.
          </p>
        </motion.div>

        {/* Assessment cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-linear-to-r ${assessment.color}`} />

                <div className="p-6">
                  {/* Code badge */}
                  <div className="flex items-center justify-between mb-4">
                    <code className="text-xs font-mono px-3 py-1.5 rounded-lg bg-muted text-muted-foreground">
                      {assessment.code}
                    </code>
                    <Badge
                      variant="outline"
                      className={difficultyColors[assessment.difficulty]}
                    >
                      {assessment.difficulty}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                    {assessment.title}
                  </h3>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {assessment.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 border-primary/20 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{assessment.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      <span>Avg: {assessment.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{assessment.takers}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button variant="outline" className="w-full group/btn">
                    Take Assessment
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssessmentsSection;
