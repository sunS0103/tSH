"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  getCandidateDashboardStatistics,
  getCandidateAppliedJobs,
} from "@/api/candidate/dashboard";
import { getProfileCompletionPercentage } from "@/api/profile";
import { getTakenAssessmentsList, getAssessmentList } from "@/api/assessments";
import AssessmentCard from "@/components/assessments/assessment-card";
import CandidateJobCard from "@/components/jobs/candidate-jobs/listing/candidate-job-card";

interface CandidateDashboardStats {
  applied_jobs: number;
  average_score: number;
  recruiter_shortlisted_you: number;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<CandidateDashboardStats>({
    applied_jobs: 0,
    average_score: 0,
    recruiter_shortlisted_you: 0,
  });
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [takenAssessments, setTakenAssessments] = useState<any[]>([]);
  const [recommendedAssessments, setRecommendedAssessments] = useState<any[]>(
    [],
  );
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState<{
      success: boolean;
      message: string;
      total_percentage: number;
      sections: Record<string, boolean>;
    } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard statistics - API provides all 3 card values and greeting
        const statsRes = await getCandidateDashboardStatistics();
        if (statsRes) {
          // Extract greeting from API response
          if (statsRes.greeting) {
            // Extract name from greeting (e.g., "Hello, john 👋" -> "john")
            const nameMatch = statsRes.greeting.match(/Hello,?\s*(\w+)/i);
            setUserName(nameMatch ? nameMatch[1] : "");
          }

          // Set statistics from API response
          setStats({
            applied_jobs: statsRes.applied_jobs || 0,
            average_score: statsRes.average_score || 0,
            recruiter_shortlisted_you: statsRes.recruiter_shortlisted_you || 0,
          });
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

        // Fetch profile completion percentage
        try {
          const profileCompletionPercentageRes =
            await getProfileCompletionPercentage();
          if (profileCompletionPercentageRes) {
            setProfileCompletionPercentage(profileCompletionPercentageRes);
          }
        } catch (error) {
          console.error("Error fetching profile completion percentage:", error);
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
      {/* Left Sidebar */}
      <div className="w-full lg:col-span-1 flex flex-col gap-4">
        {/* FAQ Card */}
        <div className="bg-blue-50 border border-blue-300 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:help-circle-outline" className="size-6 text-blue-600" />
              <h3 className="font-semibold text-base md:text-lg text-black">
                Have Questions?
              </h3>
            </div>
            <p className="text-xs font-medium text-gray-700">
              New to skill-based hiring? Our FAQ page covers everything you need to know.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <div className="size-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <p className="text-sm font-medium text-gray-800">
                How assessments work
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="size-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <p className="text-sm font-medium text-gray-800">
                How recruiters find you
              </p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="size-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <p className="text-sm font-medium text-gray-800">
                Score validity & retakes
              </p>
            </div>
          </div>
          <Link
            href="/faqs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 w-full text-sm"
            >
              Visit FAQ Page
              <Icon icon="mdi:open-in-new" className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

        {/* Did You Know Card */}
        <div className="w-full h-fit bg-primary-50 border border-primary-500 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-base md:text-lg text-black">
              Did You Know?
            </h3>
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
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
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
                      d="M28.8363 32.3115L34.8555 26.2669C35.1033 26.0188 35.3976 25.8922 35.7384 25.8869C36.0793 25.8816 36.379 26.0083 36.6376 26.2669C36.8959 26.5252 37.0251 26.8222 37.0251 27.1577C37.0251 27.4933 36.8959 27.7902 36.6376 28.0486L29.8905 34.7794C29.5916 35.0808 29.2365 35.2315 28.8251 35.2315C28.4137 35.2315 28.0573 35.0808 27.7559 34.7794L24.4709 31.5102C24.2295 31.2625 24.1088 30.9682 24.1088 30.6273C24.1088 30.2865 24.238 29.9868 24.4963 29.7282C24.755 29.4695 25.0477 29.3402 25.3747 29.3402C25.7016 29.3402 25.9944 29.4695 26.253 29.7282L28.8363 32.3115ZM13.4301 21.4748C13.8481 21.4748 14.1983 21.3334 14.4805 21.0507C14.7625 20.7679 14.9034 20.4175 14.9034 19.9994C14.9034 19.5813 14.762 19.2313 14.4793 18.9494C14.1965 18.6675 13.8461 18.5265 13.428 18.5265C13.01 18.5265 12.66 18.6679 12.378 18.9507C12.0958 19.2334 11.9547 19.5838 11.9547 20.0019C11.9547 20.42 12.0961 20.77 12.3788 21.0519C12.6619 21.3338 13.0123 21.4748 13.4301 21.4748ZM13.4301 15.0007C13.8481 15.0007 14.1983 14.8593 14.4805 14.5765C14.7625 14.2937 14.9034 13.9433 14.9034 13.5252C14.9034 13.1072 14.762 12.7572 14.4793 12.4752C14.1965 12.193 13.8461 12.0519 13.428 12.0519C13.01 12.0519 12.66 12.1933 12.378 12.4761C12.0958 12.7588 11.9547 13.1093 11.9547 13.5273C11.9547 13.9454 12.0961 14.2955 12.3788 14.5777C12.6619 14.8597 13.0123 15.0007 13.4301 15.0007ZM26.7305 21.2507C27.0847 21.2507 27.3815 21.1308 27.6209 20.8911C27.8606 20.6513 27.9805 20.3544 27.9805 20.0002C27.9805 19.6458 27.8606 19.349 27.6209 19.1098C27.3815 18.8704 27.0847 18.7507 26.7305 18.7507H19.7434C19.3893 18.7507 19.0923 18.8705 18.8526 19.1102C18.6131 19.35 18.4934 19.6469 18.4934 20.0011C18.4934 20.3555 18.6131 20.6523 18.8526 20.8915C19.0923 21.1309 19.3893 21.2507 19.7434 21.2507H26.7305ZM26.7305 14.7761C27.0847 14.7761 27.3815 14.6563 27.6209 14.4169C27.8606 14.1772 27.9805 13.8801 27.9805 13.5257C27.9805 13.1715 27.8606 12.8747 27.6209 12.6352C27.3815 12.3961 27.0847 12.2765 26.7305 12.2765H19.7434C19.3893 12.2765 19.0923 12.3963 18.8526 12.6361C18.6131 12.8755 18.4934 13.1725 18.4934 13.5269C18.4934 13.8811 18.6131 14.1779 18.8526 14.4173C19.0923 14.6565 19.3893 14.7761 19.7434 14.7761H26.7305ZM8.84592 34.1673C8.00398 34.1673 7.29134 33.8757 6.70801 33.2923C6.12467 32.709 5.83301 31.9963 5.83301 31.1544V8.8469C5.83301 8.00496 6.12467 7.29232 6.70801 6.70898C7.29134 6.12565 8.00398 5.83398 8.84592 5.83398H31.1534C31.9954 5.83398 32.708 6.12565 33.2913 6.70898C33.8747 7.29232 34.1663 8.00496 34.1663 8.8469V20.5777C34.1663 20.9794 34.0847 21.3622 33.9213 21.7261C33.7583 22.0902 33.5387 22.4104 33.2626 22.6865L28.8363 27.1544L27.4834 25.8019C26.9076 25.2272 26.2001 24.9398 25.3609 24.9398C24.5218 24.9398 23.8148 25.2272 23.2401 25.8019L20.5701 28.4973C20.269 28.7987 20.043 29.1313 19.8922 29.4952C19.7416 29.8594 19.6663 30.2298 19.6663 30.6065C19.6663 30.9023 19.7031 31.1718 19.7768 31.4148C19.8506 31.6579 19.9666 31.8948 20.1247 32.1257C20.3833 32.5765 20.4163 33.0294 20.2238 33.4844C20.0316 33.9397 19.6983 34.1673 19.2238 34.1673H8.84592Z"
                      fill="url(#paint0_linear_4258_23444_c1)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_4258_23444_c1"
                        x1="21.429"
                        y1="5.83398"
                        x2="21.429"
                        y2="35.2315"
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
                value: stats.average_score,
                label: "Average Score",
                svg: (
                  <svg
                    width="32"
                    height="29"
                    viewBox="0 0 32 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 md:size-10"
                  >
                    <path
                      d="M8.14083 28.375C7.25861 28.3472 6.41944 28.1196 5.62333 27.6921C4.8275 27.2649 4.07486 26.6378 3.36542 25.8108C2.30764 24.5736 1.48236 23.0768 0.889583 21.3204C0.296528 19.564 0 17.751 0 15.8813C0 13.6826 0.413472 11.6175 1.24042 9.68583C2.06736 7.75417 3.19611 6.07305 4.62667 4.6425C6.05722 3.21194 7.73569 2.08056 9.66208 1.24833C11.5882 0.416112 13.6453 0 15.8333 0C18.0214 0 20.0785 0.420417 22.0046 1.26125C23.931 2.10208 25.6068 3.24361 27.0321 4.68583C28.4574 6.12833 29.5861 7.82125 30.4183 9.76458C31.2506 11.7079 31.6667 13.7907 31.6667 16.0129C31.6667 17.9807 31.3487 19.8444 30.7129 21.6042C30.0774 23.3636 29.1849 24.861 28.0354 26.0963C27.3215 26.8526 26.5794 27.4215 25.8092 27.8029C25.0389 28.1843 24.2414 28.375 23.4167 28.375C22.97 28.375 22.5287 28.3206 22.0929 28.2117C21.6571 28.1025 21.2212 27.939 20.7854 27.7213L18.4521 26.5546C18.0546 26.3557 17.6336 26.2067 17.1892 26.1075C16.7447 26.0081 16.2875 25.9583 15.8175 25.9583C15.3367 25.9583 14.8767 26.0081 14.4375 26.1075C13.9983 26.2067 13.5854 26.3557 13.1987 26.5546L10.8812 27.7213C10.4176 27.9668 9.96361 28.1442 9.51917 28.2533C9.07472 28.3622 8.61528 28.4028 8.14083 28.375ZM15.8333 18.75C16.6431 18.75 17.3317 18.4664 17.8992 17.8992C18.4664 17.3317 18.75 16.6431 18.75 15.8333C18.75 15.6006 18.7211 15.3703 18.6633 15.1425C18.6058 14.915 18.5247 14.6956 18.42 14.4842L21 11.0992C21.3697 11.4989 21.6811 11.9187 21.9342 12.3587C22.1875 12.799 22.3889 13.2681 22.5383 13.7658C22.6453 14.0928 22.8056 14.3775 23.0192 14.62C23.2328 14.8625 23.5031 14.9837 23.83 14.9837C24.2575 14.9837 24.5882 14.7994 24.8221 14.4308C25.056 14.0625 25.1142 13.6561 24.9967 13.2117C24.4092 11.1539 23.2687 9.47917 21.5754 8.1875C19.8821 6.89583 17.9681 6.25 15.8333 6.25C13.6817 6.25 11.7607 6.89583 10.0704 8.1875C8.38042 9.47917 7.24153 11.1539 6.65375 13.2117C6.53625 13.6561 6.59722 14.0625 6.83667 14.4308C7.07583 14.7994 7.40375 14.9837 7.82042 14.9837C8.14736 14.9837 8.415 14.8625 8.62333 14.62C8.83167 14.3775 8.9893 14.0928 9.09625 13.7658C9.53847 12.2722 10.3793 11.0629 11.6187 10.1379C12.8579 9.21264 14.2628 8.75 15.8333 8.75C16.3953 8.75 16.9476 8.82097 17.4904 8.96292C18.0332 9.10514 18.5471 9.30764 19.0321 9.57042L16.4262 13.0063C16.3387 12.9851 16.24 12.9649 16.13 12.9454C16.0197 12.9263 15.9208 12.9167 15.8333 12.9167C15.0236 12.9167 14.335 13.2003 13.7675 13.7675C13.2003 14.335 12.9167 15.0236 12.9167 15.8333C12.9167 16.6431 13.2003 17.3317 13.7675 17.8992C14.335 18.4664 15.0236 18.75 15.8333 18.75Z"
                      fill="url(#paint0_linear_4258_23452_c2)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_4258_23452_c2"
                        x1="15.8333"
                        y1="0"
                        x2="15.8333"
                        y2="28.3835"
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
                value: stats.recruiter_shortlisted_you,
                label: "Recruiters Shortlisted You",
                svg: (
                  <svg
                    width="34"
                    height="31"
                    viewBox="0 0 34 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8 md:size-10"
                  >
                    <path
                      d="M30.3204 10.2466C31.1132 10.2466 31.8135 10.5506 32.4212 11.1586C33.0293 11.7664 33.3333 12.4667 33.3333 13.2595V15.9516C33.3333 16.1246 33.3151 16.3116 33.2787 16.5124C33.2424 16.7132 33.1879 16.9003 33.1154 17.0736L28.3396 28.3428C28.1004 28.877 27.6999 29.3278 27.1379 29.6953C26.576 30.0628 25.9915 30.2466 25.3846 30.2466H11.8908C11.0597 30.2466 10.3499 29.9523 9.76125 29.3636C9.17264 28.7748 8.87833 28.0648 8.87833 27.2336V11.4932C8.87833 11.0916 8.96056 10.7054 9.125 10.3349C9.28944 9.96406 9.50847 9.64183 9.78208 9.36822L18.5992 0.608641C18.9306 0.294752 19.3142 0.101419 19.75 0.0286415C20.1858 -0.0438585 20.6035 0.0212805 21.0029 0.224058C21.4026 0.427114 21.6911 0.725168 21.8683 1.11822C22.0458 1.51156 22.0811 1.92934 21.9742 2.37156L20.1792 10.2466H30.3204ZM3.01292 30.2466C2.18181 30.2466 1.47181 29.9523 0.882917 29.3636C0.294306 28.7748 0 28.0648 0 27.2336V13.2595C0 12.4284 0.294306 11.7184 0.882917 11.1295C1.47181 10.5409 2.18181 10.2466 3.01292 10.2466H3.36542C4.19653 10.2466 4.90653 10.5409 5.49542 11.1295C6.08403 11.7184 6.37833 12.4284 6.37833 13.2595V27.2499C6.37833 28.081 6.08403 28.7882 5.49542 29.3716C4.90653 29.9549 4.19653 30.2466 3.36542 30.2466H3.01292Z"
                      fill="url(#paint0_linear_4258_23459_c3)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_4258_23459_c3"
                        x1="16.6667"
                        y1="0"
                        x2="16.6667"
                        y2="30.2466"
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
                    You haven&apos;t taken any assessments yet.
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
                    questionCount={assessment.total_questions || 0}
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
                    questionCount={assessment.total_questions || 0}
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
              Jobs You&apos;ve Applied For
            </h2>
            {appliedJobs.length > 0 && (
              <Link
                href="/jobs?tab=applied"
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
                    You haven&apos;t applied to any jobs yet.
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
                  <CandidateJobCard
                    key={job.id}
                    title={job.title}
                    company_name={job.company_name}
                    experience_range={job.experience_range}
                    work_mode={job.work_mode}
                    city={job.city}
                    country={job.country}
                    slug={job.slug}
                    relevant_assessments={job.relevant_assessments}
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
