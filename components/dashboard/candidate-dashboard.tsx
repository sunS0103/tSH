"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getCandidateDashboardStatistics,
  getCandidateAppliedJobs,
} from "@/api/candidate/dashboard";
import { getCandidateProfile } from "@/api/profile";
import {
  getTakenAssessmentsList,
  getAssessmentList,
} from "@/api/assessments";
import AssessmentCard from "@/components/assessments/assessment-card";

interface CandidateDashboardStats {
  applied_jobs: number;
  average_score: number;
  recruiters_shortlisted_you: number;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<CandidateDashboardStats>({
    applied_jobs: 0,
    average_score: 0,
    recruiters_shortlisted_you: 0,
  });
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [takenAssessments, setTakenAssessments] = useState<any[]>([]);
  const [recommendedAssessments, setRecommendedAssessments] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile for name and completion
        const profileRes = await getCandidateProfile();
        if (profileRes?.data) {
          const firstName = profileRes.data.first_name || "";
          setUserName(firstName);
          // Calculate profile completion (this might need to come from API)
          setProfileCompletion(profileRes.data.profile_completion || 0);
        }

        // Fetch dashboard statistics
        try {
          const statsRes = await getCandidateDashboardStatistics();
          if (statsRes?.data) {
            setStats(statsRes.data);
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }

        // Fetch taken assessments (limit to 3)
        try {
          const takenRes = await getTakenAssessmentsList({
            page: 1,
            pageSize: 3,
            sortBy: "created_at",
            sortDirection: "desc",
          });
          if (takenRes?.data?.assessments) {
            setTakenAssessments(takenRes.data.assessments);
          }
        } catch (error) {
          console.error("Error fetching taken assessments:", error);
        }

        // Fetch recommended assessments (limit to 3)
        try {
          const recommendedRes = await getAssessmentList({
            page: 1,
            pageSize: 3,
            sortBy: "created_at",
            sortDirection: "desc",
          });
          if (recommendedRes?.data?.assessments) {
            setRecommendedAssessments(recommendedRes.data.assessments);
          }
        } catch (error) {
          console.error("Error fetching recommended assessments:", error);
        }

        // Fetch applied jobs (limit to 2)
        try {
          const jobsRes = await getCandidateAppliedJobs({
            page: 1,
            pageSize: 2,
          });
          if (jobsRes?.data) {
            setAppliedJobs(jobsRes.data);
          }
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6">
      {/* Left Sidebar - Did You Know Card */}
      <div className="w-full lg:col-span-1 h-fit bg-primary-50 border border-primary-500 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-base md:text-lg text-black">Did You Know?</h3>
          <p className="text-sm font-medium text-gray-700">
            Rotating tips/messages such as:
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <div className="size-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
            <p className="text-sm font-medium text-gray-800">
              Candidates with 2+ assessments get 3x more recruiter views.
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <div className="size-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
            <p className="text-sm font-medium text-gray-800">
              Profiles with 80%+ completion are shortlisted faster.
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <div className="size-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
            <p className="text-sm font-medium text-gray-800">
              Retaking assessments can improve your visibility.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-primary-500 text-primary-500 hover:bg-primary-100 flex-1 text-sm"
            onClick={() => router.push("/assessments")}
          >
            Take Assessment
          </Button>
          <Button
            variant="outline"
            className="border-primary-500 text-primary-500 hover:bg-primary-100 flex-1 text-sm"
            onClick={() => router.push("/jobs")}
          >
            Explore Jobs
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 md:gap-6 pb-8 w-full lg:col-span-3">
        {/* Hello + Statistics */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-black">
            Hello, {userName || "Candidate"} 👋
          </h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                value: stats.applied_jobs,
                label: "Applied jobs",
                icon: "mdi:file-document-check-outline",
              },
              {
                value: stats.average_score,
                label: "Average Score",
                icon: "mdi:speedometer",
              },
              {
                value: stats.recruiters_shortlisted_you,
                label: "Recruiters Shortlisted You",
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
                <div className="bg-primary-50 rounded-lg p-2.5 shrink-0">
                  <Icon
                    icon={stat.icon}
                    className="size-8 md:size-10 text-primary-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Assessments Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Your Assessments
            </h2>
            {takenAssessments.length > 0 && (
              <Link
                href="/assessments?tab=taken"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {takenAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="mdi:help-box-multiple-outline"
                    className="size-8 text-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-black mb-1">
                    You haven't taken any assessments yet.
                  </p>
                  <p className="font-semibold text-base text-black">
                    Assessments help recruiters discover and shortlist your
                    profile faster.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-100"
                  onClick={() => router.push("/assessments")}
                >
                  Checkout Assessments
                  <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {takenAssessments.map((assessment) => (
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
                    selectedTab="taken"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended for You Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Recommended for You
            </h2>
            {recommendedAssessments.length > 0 && (
              <Link
                href="/assessments"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {recommendedAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="mdi:help-box-multiple-outline"
                    className="size-8 text-primary-500"
                  />
                </div>
                <p className="font-semibold text-base text-black text-center">
                  No recommended assessments available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedAssessments.map((assessment) => (
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

        {/* Jobs You've Applied For Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-base md:text-lg text-black">
              Jobs You've Applied For
            </h2>
            {appliedJobs.length > 0 && (
              <Link
                href="/jobs"
                className="text-xs text-gray-900 underline hover:text-primary-500"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-4">
            {appliedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="bg-primary-50 rounded-full p-4">
                  <Icon
                    icon="majesticons:briefcase-line"
                    className="size-8 text-primary-500"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-black mb-1">
                    You haven't applied to any jobs yet.
                  </p>
                  <p className="font-semibold text-base text-black">
                    Start exploring opportunities that match your skills.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-100"
                  onClick={() => router.push("/jobs")}
                >
                  Checkout Latest Jobs
                  <Icon icon="mdi:arrow-top-right" className="ml-2 size-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appliedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col gap-4"
                  >
                    <h3 className="font-semibold text-base md:text-lg text-black">
                      {job.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-900 uppercase mb-1">
                          Company Name
                        </p>
                        <p className="text-gray-900">{job.company_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-900 uppercase mb-1">
                          Years of Experience
                        </p>
                        <p className="text-gray-900">
                          {job.experience_min_years} - {job.experience_max_years}{" "}
                          Years
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-900 uppercase mb-1">
                          Work Mode
                        </p>
                        <p className="text-gray-900">{job.work_mode}</p>
                      </div>
                    </div>
                    {job.relevant_assessments && job.relevant_assessments.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-900 uppercase mb-2">
                          Relevant Assessments
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {job.relevant_assessments.map((assessment, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full italic underline"
                            >
                              {assessment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="bg-primary-50 px-2 py-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:map-marker-outline"
                          className="size-3.5 text-primary-700"
                        />
                        <span className="text-xs text-primary-700">
                          {job.location}
                        </span>
                      </div>
                      <Icon
                        icon="mdi:arrow-top-right"
                        className="size-8 text-primary-500 border border-primary-500 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
