"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SkillScorecard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative max-w-md mx-auto"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl rounded-3xl" />

      <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-foreground">
              QA Automation Engineer
            </h4>
            <p className="text-xs text-subtle">ID: C-4821</p>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary"
            >
              Invite to Job
            </Badge>
          </div>
        </div>

        {/* Score Section */}
        <div className="flex gap-6 mb-4">
          <div>
            <p className="text-xs text-subtle mb-1">Total Score</p>
            <p className="text-2xl font-bold text-primary">92%</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-subtle mb-2">Skills Assessed</p>
            <div className="flex flex-wrap gap-1.5">
              {["Playwright", "Selenium", "API Testing", "AI Agents"].map(
                (skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-muted/50 text-subtle"
                  >
                    {skill}
                  </Badge>
                )
              )}
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-muted/50 text-subtle"
              >
                +4
              </Badge>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-subtle">
            <Briefcase className="w-4 h-4" />
            <span>5-7 Years</span>
          </div>
          <div className="flex items-center gap-2 text-subtle">
            <MapPin className="w-4 h-4" />
            <span>Bangalore, KA</span>
          </div>
          <div className="flex items-center gap-2 text-subtle">
            <Clock className="w-4 h-4" />
            <span>Immediate</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Proctored</span>
          </div>
        </div>

        {/* Assessment Badges */}
        <div>
          <p className="text-xs text-subtle mb-2">Assessment Taken</p>
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-0 text-xs">
              EXAM-FS-201
            </Badge>
            <Badge variant="outline" className="text-xs">
              EXAM-JS-102
            </Badge>
            <Badge variant="outline" className="text-xs">
              EXAM-DB-301
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillScorecard;
