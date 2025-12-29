"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  DollarSign,
  Lock,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import SignupModal from "./signup-modal";

const jobListings = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "GraphQL"],
    experience: "5+ years",
    location: "Remote",
    salary: "$120k - $160k",
    company: "████████ Inc.",
    posted: "2 days ago",
    applicants: 45,
  },
  {
    id: 2,
    role: "Full Stack Engineer",
    skills: ["Node.js", "React", "PostgreSQL"],
    experience: "3-5 years",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    company: "████████ Labs",
    posted: "1 day ago",
    applicants: 32,
  },
  {
    id: 3,
    role: "Backend Developer",
    skills: ["Python", "Django", "AWS"],
    experience: "4+ years",
    location: "New York, NY",
    salary: "$130k - $170k",
    company: "████████ Tech",
    posted: "3 days ago",
    applicants: 58,
  },
  {
    id: 4,
    role: "DevOps Engineer",
    skills: ["Kubernetes", "Docker", "CI/CD"],
    experience: "3+ years",
    location: "Remote",
    salary: "$125k - $155k",
    company: "████████ Cloud",
    posted: "5 hours ago",
    applicants: 21,
  },
];

const JobSearchPreview = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="job-search" className="py-24 relative">
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
            Explore Open Positions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse real job opportunities. Sign up to apply and unlock company
            details.
          </p>
        </motion.div>

        {/* Job cards grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {jobListings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {job.role}
                    </h3>
                    <p className="text-sm text-muted-foreground/70 flex items-center gap-1 mt-1">
                      <Lock className="w-3 h-3" />
                      {job.company}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 border-primary/20 text-primary"
                  >
                    {job.posted}
                  </Badge>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-muted border-muted/20 text-foreground/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary/60" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent/80" />
                    <span className="text-accent font-medium">
                      {job.salary}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary/60" />
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>

                {/* Apply button */}
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setShowModal(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Apply Now
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
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowModal(true)}
          >
            View All Jobs
          </Button>
        </motion.div>
      </div>

      <SignupModal open={showModal} onOpenChange={setShowModal} />
    </section>
  );
};

export default JobSearchPreview;
