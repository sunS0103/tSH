"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { getDashboardStatistics } from "@/api/recruiter/dashboard";
import { getRecruiterJobs } from "@/api/jobs/recruiter";
import { getRecruiterTalentPool, Candidate } from "@/api/recruiter/talent-pool";
import {
  getAssessmentList,
  getRequestedAssessmentsList,
} from "@/api/assessments";
import JobCard from "@/components/jobs/recruiter-jobs/listing/job-card";
import TalentCard from "@/components/talent-pool/talent-card";
import AssessmentCard from "@/components/assessments/assessment-card";
import AssessmentRecruiterRequestedCard from "@/components/assessments/assessment-recruiter-requested-card";
import { getRecruiterProfile } from "@/api/profile";
import Link from "next/link";
import { RecruiterJob } from "@/types/job";

interface DashboardStats {
  active_jobs: number;
  requested_assessments: number;
  shortlisted_candidates: number;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    active_jobs: 0,
    requested_assessments: 0,
    shortlisted_candidates: 0,
  });
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [favoriteTalents, setFavoriteTalents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [requestedAssessments, setRequestedAssessments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile for name
        const profileRes = await getRecruiterProfile();
        if (profileRes?.data) {
          const firstName = profileRes.data.first_name || "";
          setUserName(firstName);
        }

        // Fetch recent jobs (limit to 3)
        const jobsRes = await getRecruiterJobs({
          page: 1,
          pageSize: 10,
        });
        
        // Map jobs to JobCard format
        const allJobs = jobsRes?.data || [];
        const mappedJobs = allJobs.map((job: RecruiterJob) => {
          const primarySkills = job.primary_skills || job.skills || [];
          const skillsArray = primarySkills.map((skill: any) => {
            if (typeof skill === "string") {
              return skill;
            }
            // Handle JobSkill structure
            if (skill.skill && typeof skill.skill === "object") {
              return skill.skill.name || "";
            }
            return skill.name || "";
          }).filter((skill: string) => skill !== "");
          
          return {
            id: job.id,
            title: job.title,
            status: job.status === "published" ? "Active" : job.status === "in_review" ? "In Review" : job.status === "draft" ? "Draft" : job.status,
            minExperience: job.experience_min_years || 0,
            maxExperience: job.experience_max_years || 0,
            companyName: job.company_name,
            skills: skillsArray,
            location: job.job_serving_location || job.city?.name || "",
            applicants: 0, // This might need to come from a different endpoint
          };
        });
        
        setJobs(mappedJobs.slice(0, 2));
        
        // Calculate active jobs count
        const activeJobsCount = allJobs.filter(
          (job: RecruiterJob) => job.status === "published"
        ).length;

        // Fetch dashboard statistics
        try {
          const statsRes = await getDashboardStatistics();
          if (statsRes?.data) {
            setStats(statsRes.data);
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
          // If API doesn't exist, calculate from other endpoints
          setStats((prev) => ({
            ...prev,
            active_jobs: activeJobsCount,
          }));
        }

        // Fetch favorite talents (limit to 2)
        const talentsRes = await getRecruiterTalentPool({
          page: 1,
          pageSize: 2,
          favorite_only: true,
        });
        if (talentsRes?.data?.candidates) {
          const mappedTalents = talentsRes.data.candidates.map(
            (candidate: Candidate) => mapCandidateToTalentCard(candidate)
          );
          setFavoriteTalents(mappedTalents.slice(0, 2));
          
          // Update shortlisted candidates count if stats API failed
          setStats((prev) => ({
            ...prev,
            shortlisted_candidates: talentsRes.data.total_count || 0,
          }));
        }

        // Fetch recent assessments (limit to 2)
        const assessmentsRes = await getAssessmentList({
          page: 1,
          pageSize: 2,
          sortBy: "created_at",
          sortDirection: "desc",
        });
        if (assessmentsRes?.data?.assessments) {
          setAssessments(assessmentsRes.data.assessments.slice(0, 2));
        }

        // Fetch requested assessments (limit to 2)
        const requestedRes = await getRequestedAssessmentsList({
          page: 1,
          pageSize: 2,
          sortBy: "created_at",
          sortDirection: "desc",
        });
        if (requestedRes?.data?.requests || requestedRes?.data) {
          const requests =
            requestedRes.data.requests || requestedRes.data || [];
          setRequestedAssessments(requests.slice(0, 2));
          
          // Update requested assessments count if stats API failed
          const totalRequested = requestedRes?.meta?.pagination?.total || requests.length;
          setStats((prev) => ({
            ...prev,
            requested_assessments: totalRequested,
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to map candidate to talent card format
  const mapCandidateToTalentCard = (candidate: Candidate) => {
    return {
      id: candidate.candidate_id,
      role: candidate.expertise || "N/A",
      location_code: candidate.location || "N/A",
      totalScore: candidate.score || 0,
      skillsAssessed: candidate.skills_assessed?.map((s) => s.skill_name) || [],
      experience: `${candidate.years_of_experience || 0} Years`,
      company: candidate.company || "N/A",
      availability: candidate.availability || "N/A",
      location: candidate.city || candidate.location || "N/A",
      assessmentTaken:
        candidate.assessments_taken?.map((a) => a.assessment_title) || [],
      assessments: candidate.assessments_taken || [],
      about: candidate.about || "",
      isFavorite: candidate.is_favorite || false,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6">
      {/* Did You Know Card */}
      <div className="w-full lg:col-span-1 h-fit bg-primary-50 border border-primary-500 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:lightbulb-outline-rounded"
            className="size-6 text-primary-500"
          />
          <h3 className="font-semibold text-base md:text-lg text-black">
            You are on Free Plan
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-700">
          Unlock up to 3 candidate profiles and discover amazing talent waiting
          for opportunities.
        </p>
        <Button
          variant="outline"
          className="border-primary-500 text-primary-500 hover:bg-primary-100 w-full md:w-auto"
          onClick={() => router.push("/credits")}
        >
          See Plans
          <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:gap-6 pb-8 w-full lg:col-span-3">
        {/* Hello + Statistics */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-black">
            Hello, {userName || "Recruiter"} 👋
          </h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                value: stats.active_jobs,
                label: "Active Jobs",
                icon: "majesticons:briefcase-line",
              },
              {
                value: stats.requested_assessments,
                label: "Requested Assessment",
                icon: "mdi:help-box-multiple-outline",
              },
              {
                value: stats.shortlisted_candidates,
                label: "Shortlisted Candidate",
                icon: "mdi:thumb-up-outline",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-16">
                  <p className="text-2xl md:text-3xl font-bold text-black">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    {stat.label}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-2.5 relative overflow-hidden shrink-0 ">
                  <Icon
                    icon={stat.icon}
                    className="size-8 md:size-10 relative z-10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Postings Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">Job Postings</h2>
            {jobs.length > 0 && (
              <Link
                href="/jobs"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="majesticons:briefcase-line"
                    className="size-8 text-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-black mb-1">
                    Looks like you haven't posted a job yet.
                  </p>
                  <p className="font-semibold text-base text-black">
                    Great talent is waiting. Let's get started!
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-100"
                  onClick={() => router.push("/jobs/create")}
                >
                  Create Your First Job
                  <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} id={job.id} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favorite Profile Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Favorite Profile
            </h2>
            {favoriteTalents.length > 0 && (
              <Link
                href="/talent-pool?favorite=true"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {favoriteTalents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="mdi:cards-heart"
                    className="size-8 text-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-black mb-1">
                    You haven't bookmarked any profiles yet.
                  </p>
                  <p className="font-semibold text-base text-black">
                    Checkout Talent Pool and bookmark your favourites to reach
                    out for job opportunities
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-100"
                  onClick={() => router.push("/talent-pool")}
                >
                  View Talent Pool
                  <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    {...talent}
                    isFavorite={talent.isFavorite}
                    onToggleFavorite={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assessments Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">Assessments</h2>
            <Link
              href="/assessments"
              className="text-xs text-gray-900 underline hover:text-primary-500"
            >
              View All
            </Link>
          </div>
          <div className="p-4">
            {assessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="mdi:help-box-multiple-outline"
                    className="size-8 text-primary-500"
                  />
                </div>
                <p className="font-semibold text-base text-black text-center">
                  No assessments available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id || assessment.slug}
                    slug={assessment.slug}
                    category={assessment.category || "Technology"}
                    title={assessment.title}
                    topics={
                      assessment.topics?.map((t: any, idx: number) => ({
                        id: t.id || idx.toString(),
                        value: t.value || t,
                      })) || []
                    }
                    duration={assessment.duration || 0}
                    questionCount={assessment.question_count || 0}
                    score={assessment.score || 0}
                    selectedTab="all"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requested Assessment Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Requested Assessment
            </h2>
            {requestedAssessments.length > 0 && (
              <Link
                href="/assessments?tab=requested"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {requestedAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="mdi:help-box-multiple-outline"
                    className="size-8 text-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-black mb-1">
                    You haven't taken any Requested assessments yet.
                  </p>
                  <p className="font-semibold text-base text-black">
                    Assessments help recruiters discover and shortlist your
                    profile faster.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-100"
                  onClick={() => router.push("/assessments?tab=requested")}
                >
                  Request Assessments
                  <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requestedAssessments.map((assessment: any) => (
                  <AssessmentRecruiterRequestedCard
                    key={assessment.id}
                    id={assessment.id}
                    assessmentName={
                      assessment.assessment_title ||
                      assessment.assessmentName ||
                      "N/A"
                    }
                    name={assessment.name || "N/A"}
                    companyEmail={
                      assessment.company_email ||
                      assessment.companyEmail ||
                      "N/A"
                    }
                    skillsToAssess={
                      assessment.skills_to_assess ||
                      assessment.skillsToAssess ||
                      "N/A"
                    }
                    phoneNumber={
                      assessment.mobile_number ||
                      assessment.phoneNumber ||
                      "N/A"
                    }
                    assessmentCreationPreference={
                      assessment.assessment_creation_preference ||
                      assessment.assessmentCreationPreference ||
                      "N/A"
                    }
                    jobDescription={
                      assessment.job_description || assessment.jobDescription
                    }
                    customInstructions={
                      assessment.custom_instructions ||
                      assessment.customInstructions
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
