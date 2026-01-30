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
import Link from "next/link";
import { RecruiterJob } from "@/types/job";

interface DashboardStats {
  active_jobs: number;
  requested_assessment: number;
  shortlisted_candidate: number;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    active_jobs: 0,
    requested_assessment: 0,
    shortlisted_candidate: 0,
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
        // Fetch dashboard statistics - API provides all 3 card values and greeting
        const statsRes = await getDashboardStatistics();
        if (statsRes) {
          // Extract greeting from API response
          if (statsRes.greeting) {
            // Extract name from greeting (e.g., "Hello, Winston 👋" -> "Winston")
            const nameMatch = statsRes.greeting.match(/Hello,?\s*(\w+)/i);
            setUserName(nameMatch ? nameMatch[1] : "");
          }

          // Set statistics from API response
          setStats({
            active_jobs: statsRes.active_jobs || 0,
            requested_assessment: statsRes.requested_assessment || 0,
            shortlisted_candidate: statsRes.shortlisted_candidate || 0,
          });
        }

        // Fetch recent jobs (limit to 2)
        const jobsRes = await getRecruiterJobs({
          page: 1,
          pageSize: 10,
        });

        // Map jobs to JobCard format
        const allJobs = jobsRes?.data || [];
        const mappedJobs = allJobs.map((job: RecruiterJob) => {
          const primarySkills = job.primary_skills || job.skills || [];
          const skillsArray = primarySkills
            .map((skill: any) => {
              if (typeof skill === "string") {
                return skill;
              }
              // Handle JobSkill structure
              if (skill.skill && typeof skill.skill === "object") {
                return skill.skill.name || "";
              }
              return skill.name || "";
            })
            .filter((skill: string) => skill !== "");

          return {
            slug: job.slug,
            id: job.id,
            title: job.title,
            status:
              job.status === "published"
                ? "Active"
                : job.status === "in_review"
                  ? "In Review"
                  : job.status === "draft"
                    ? "Draft"
                    : job.status,
            experience_range: job.experience_range || "",
            companyName: job.company_name,
            skills: skillsArray,
            location: job.job_serving_location || job.city?.name || "",
            applicants: 0, // This might need to come from a different endpoint
          };
        });

        setJobs(mappedJobs.slice(0, 2));

        // Fetch favorite talents (limit to 2)
        const talentsRes = await getRecruiterTalentPool({
          page: 1,
          pageSize: 2,
          favorite_only: true,
        });
        if (talentsRes?.data) {
          const mappedTalents = talentsRes.data.map((candidate: Candidate) =>
            mapCandidateToTalentCard(candidate),
          );
          setFavoriteTalents(mappedTalents.slice(0, 2));
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
      id: candidate.user_id,
      role: candidate.expertise || "N/A",
      expertise: candidate.bio || "N/A",
      location_code: candidate.location || "N/A",
      totalScore: candidate.score || 0,
      skillsAssessed: candidate.skills_assessed?.map((s) => s.skill_name) || [],
      experience: candidate.years_of_experience || 0,
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
        <p className="text-sm font-medium text-slate-700">
          Unlock up to 10 candidate profiles and discover amazing talent waiting
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
                svg: (
                  <svg
                    width="32"
                    height="30"
                    viewBox="0 0 32 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 md:size-10"
                  >
                    <path
                      d="M14.1667 20V16.6667H17.5V20H14.1667ZM12.5 5.83333H19.1667V3.01292C19.1667 2.88458 19.1132 2.76708 19.0063 2.66042C18.8996 2.55347 18.7821 2.5 18.6537 2.5H13.0129C12.8846 2.5 12.7671 2.55347 12.6604 2.66042C12.5535 2.76708 12.5 2.88458 12.5 3.01292V5.83333ZM3.01292 29.1667C2.17097 29.1667 1.45833 28.875 0.875 28.2917C0.291667 27.7083 0 26.9957 0 26.1537V19.5833H11.6667V20.9933C11.6667 21.4231 11.8104 21.7815 12.0979 22.0688C12.3851 22.3562 12.7436 22.5 13.1733 22.5H18.4933C18.9231 22.5 19.2815 22.3562 19.5688 22.0688C19.8563 21.7815 20 21.4231 20 20.9933V19.5833H31.6667V26.1537C31.6667 26.9957 31.375 27.7083 30.7917 28.2917C30.2083 28.875 29.4957 29.1667 28.6537 29.1667H3.01292ZM0 17.0833V8.84625C0 8.0043 0.291667 7.29167 0.875 6.70833C1.45833 6.125 2.17097 5.83333 3.01292 5.83333H10V3.01292C10 2.17097 10.2917 1.45833 10.875 0.875C11.4583 0.291667 12.171 0 13.0129 0H18.6537C19.4957 0 20.2083 0.291667 20.7917 0.875C21.375 1.45833 21.6667 2.17097 21.6667 3.01292V5.83333H28.6537C29.4957 5.83333 30.2083 6.125 30.7917 6.70833C31.375 7.29167 31.6667 8.0043 31.6667 8.84625V17.0833H20V15.6733C20 15.2436 19.8563 14.8851 19.5688 14.5979C19.2815 14.3104 18.9231 14.1667 18.4933 14.1667H13.1733C12.7436 14.1667 12.3851 14.3104 12.0979 14.5979C11.8104 14.8851 11.6667 15.2436 11.6667 15.6733V17.0833H0Z"
                      fill="url(#paint0_linear_5711_39210_0)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5711_39210_0"
                        x1="15.8333"
                        y1="0"
                        x2="15.8333"
                        y2="29.1667"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#5245E5" />
                        <stop offset="1" stopColor="#9134EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                ),
              },
              {
                value: stats.requested_assessment,
                label: "Requested Assessment",
                svg: (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 md:size-10"
                  >
                    <path
                      d="M22.9163 24.6148C23.3244 24.6148 23.6806 24.4625 23.9851 24.1581C24.2895 23.8537 24.4418 23.4973 24.4418 23.0889C24.4418 22.6809 24.2895 22.3246 23.9851 22.0202C23.6806 21.7157 23.3244 21.5635 22.9163 21.5635C22.5083 21.5635 22.152 21.7157 21.8476 22.0202C21.5429 22.3246 21.3905 22.6809 21.3905 23.0889C21.3905 23.4973 21.5429 23.8537 21.8476 24.1581C22.152 24.4625 22.5083 24.6148 22.9163 24.6148ZM22.9163 19.6018C23.1686 19.6018 23.3972 19.5121 23.6022 19.3327C23.8072 19.1532 23.9322 18.9257 23.9772 18.6502C24.0327 18.2632 24.1561 17.9256 24.3472 17.6373C24.5386 17.3487 24.897 16.9523 25.4226 16.4481C26.1918 15.7109 26.7152 15.088 26.993 14.5793C27.2708 14.071 27.4097 13.4803 27.4097 12.8073C27.4097 11.6212 26.9909 10.643 26.1534 9.87268C25.3159 9.10241 24.2369 8.71727 22.9163 8.71727C22.0638 8.71727 21.284 8.91491 20.5768 9.31018C19.8693 9.70546 19.304 10.2706 18.8809 11.0056C18.7465 11.23 18.7326 11.4657 18.8393 11.7127C18.9462 11.9593 19.129 12.1362 19.3876 12.2431C19.629 12.3498 19.8715 12.3609 20.1151 12.2764C20.3587 12.1923 20.5563 12.038 20.708 11.8135C20.9794 11.4096 21.2977 11.1067 21.663 10.9048C22.0286 10.7028 22.4463 10.6019 22.9163 10.6019C23.6472 10.6019 24.2476 10.8134 24.7176 11.2364C25.1876 11.6595 25.4226 12.2173 25.4226 12.9098C25.4226 13.3306 25.3036 13.7253 25.0655 14.0939C24.8272 14.4625 24.4143 14.916 23.8268 15.4543C23.1065 16.0741 22.63 16.5848 22.3972 16.9864C22.1641 17.3881 22.0198 17.9288 21.9643 18.6085C21.9365 18.8668 22.0166 19.097 22.2047 19.2989C22.3927 19.5009 22.63 19.6018 22.9163 19.6018ZM13.4293 29.166C12.5873 29.166 11.8747 28.8743 11.2913 28.291C10.708 27.7077 10.4163 26.995 10.4163 26.1531V7.17893C10.4163 6.33699 10.708 5.62435 11.2913 5.04102C11.8747 4.45768 12.5873 4.16602 13.4293 4.16602H32.4034C33.2454 4.16602 33.958 4.45768 34.5413 5.04102C35.1247 5.62435 35.4163 6.33699 35.4163 7.17893V26.1531C35.4163 26.995 35.1247 27.7077 34.5413 28.291C33.958 28.8743 33.2454 29.166 32.4034 29.166H13.4293ZM7.59592 34.9993C6.75398 34.9993 6.04134 34.7077 5.45801 34.1243C4.87467 33.541 4.58301 32.8284 4.58301 31.9864V11.7623C4.58301 11.4075 4.70273 11.1105 4.94217 10.871C5.18134 10.6318 5.47829 10.5123 5.83301 10.5123C6.18773 10.5123 6.48481 10.6318 6.72426 10.871C6.96342 11.1105 7.08301 11.4075 7.08301 11.7623V31.9864C7.08301 32.1148 7.13648 32.2323 7.24342 32.3389C7.35009 32.4459 7.46759 32.4993 7.59592 32.4993H27.8201C28.1748 32.4993 28.4719 32.6189 28.7113 32.8581C28.9505 33.0975 29.0701 33.3946 29.0701 33.7493C29.0701 34.1041 28.9505 34.401 28.7113 34.6402C28.4719 34.8796 28.1748 34.9993 27.8201 34.9993H7.59592Z"
                      fill="url(#paint0_linear_5711_39216_1)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5711_39216_1"
                        x1="19.9997"
                        y1="4.16602"
                        x2="19.9997"
                        y2="34.9993"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#5245E5" />
                        <stop offset="1" stopColor="#9134EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                ),
              },
              {
                value: stats.shortlisted_candidate,
                label: "Shortlisted Candidate",
                svg: (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 md:size-10"
                  >
                    <path
                      d="M34.4874 14.1665C35.2802 14.1665 35.9805 14.4705 36.5882 15.0786C37.1963 15.6863 37.5003 16.3866 37.5003 17.1794V19.8715C37.5003 20.0445 37.4821 20.2315 37.4457 20.4323C37.4094 20.6331 37.3549 20.8202 37.2824 20.9936L32.5066 32.2627C32.2674 32.7969 31.8669 33.2477 31.3049 33.6152C30.743 33.9827 30.1585 34.1665 29.5516 34.1665H16.0578C15.2267 34.1665 14.5169 33.8722 13.9282 33.2836C13.3396 32.6947 13.0453 31.9847 13.0453 31.1536V15.4131C13.0453 15.0115 13.1275 14.6254 13.292 14.2548C13.4564 13.884 13.6755 13.5618 13.9491 13.2881L22.7662 4.52856C23.0975 4.21467 23.4812 4.02134 23.917 3.94856C24.3528 3.87606 24.7705 3.9412 25.1699 4.14398C25.5696 4.34704 25.8581 4.64509 26.0353 5.03815C26.2128 5.43148 26.2481 5.84926 26.1412 6.29148L24.3462 14.1665H34.4874ZM7.17991 34.1665C6.3488 34.1665 5.6388 33.8722 5.04991 33.2836C4.4613 32.6947 4.16699 31.9847 4.16699 31.1536V17.1794C4.16699 16.3483 4.4613 15.6383 5.04991 15.0494C5.6388 14.4608 6.3488 14.1665 7.17991 14.1665H7.53241C8.36352 14.1665 9.07352 14.4608 9.66241 15.0494C10.251 15.6383 10.5453 16.3483 10.5453 17.1794V31.1698C10.5453 32.0009 10.251 32.7081 9.66241 33.2915C9.07352 33.8748 8.36352 34.1665 7.53241 34.1665H7.17991Z"
                      fill="url(#paint0_linear_5711_39223_2)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5711_39223_2"
                        x1="20.8337"
                        y1="3.91992"
                        x2="20.8337"
                        y2="34.1665"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#5245E5" />
                        <stop offset="1" stopColor="#9134EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                ),
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white h-36 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col h-full justify-between gap-2">
                  <p className="text-2xl md:text-3xl font-bold text-black">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    {stat.label}
                  </p>
                </div>
                <div className="relative overflow-hidden shrink-0 h-full">
                  {stat.svg}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Postings Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Job Postings
            </h2>
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
                {jobs.map((job, index) => (
                  <JobCard key={`${index}`} {...job} id={job.id} />
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
              <div className="grid grid-cols-1 gap-4">
                {favoriteTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    id={talent.id}
                    role={talent.role}
                    expertise={talent.expertise}
                    location_code={talent.location_code}
                    totalScore={talent.totalScore}
                    skillsAssessed={talent.skillsAssessed}
                    experience={talent.experience}
                    company={talent.company}
                    availability={talent.availability}
                    location={talent.location}
                    assessmentTaken={talent.assessmentTaken}
                    assessments={talent.assessments}
                    about={talent.about}
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
            <h2 className="font-semibold text-base md:text-lg text-black">
              Assessments
            </h2>
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
                    questionCount={assessment.total_questions || 0}
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
