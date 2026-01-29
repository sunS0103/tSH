"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProfileCompletionPercentage } from "@/api/profile";
import Logo from "@/components/logo";

interface ProfileSection {
  name: string;
  route: string;
  icon: string;
}

const PROFILE_SECTIONS: ProfileSection[] = [
  {
    name: "Account & Identity",
    route: "/profile-details/edit-account-and-identity",
    icon: "material-symbols:person-outline-rounded",
  },
  {
    name: "Personal & Social",
    route: "/profile-details/edit-personal-social",
    icon: "material-symbols:id-card-outline-rounded",
  },
  {
    name: "Employment",
    route: "/profile-details/edit-employment",
    icon: "material-symbols:work-outline-rounded",
  },
  {
    name: "Education",
    route: "/profile-details/edit-education",
    icon: "material-symbols:school-outline-rounded",
  },
  {
    name: "Skills",
    route: "/profile-details/edit-skills",
    icon: "material-symbols:stars-outline-rounded",
  },
  {
    name: "Location & Work Preferences",
    route: "/profile-details/edit-location-and-work-preferences",
    icon: "material-symbols:location-on-outline-rounded",
  },
];

export default function ProfileOnboardingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileCompletion, setProfileCompletion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const response = await getProfileCompletionPercentage();
        setProfileCompletion(response);
        
        // If profile is 100% complete, redirect to dashboard
        if (response.total_percentage === 100) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching profile completion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, [router, pathname]); // Re-fetch when pathname changes (user navigates to different section)

  const isProfileComplete = profileCompletion?.total_percentage === 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-20">
      {/* Left Sidebar - Profile Sections Progress */}
      <div className="lg:w-80 lg:sticky lg:top-8 lg:self-start">
        {/* Logo */}
        <div className="mb-6">
          <Logo />
        </div>

        {/* Welcome Message */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to TechSmartHire! 👋
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Complete your profile to unlock the dashboard and start exploring job opportunities.
          </p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm font-semibold text-primary-600">
                {profileCompletion?.total_percentage || 0}%
              </span>
            </div>
            <Progress value={profileCompletion?.total_percentage || 0} />
          </div>

          {/* Dashboard Button */}
          <Button
            className="w-full"
            disabled={!isProfileComplete}
            onClick={() => router.push("/dashboard")}
          >
            <Icon icon="material-symbols:dashboard-outline" className="mr-2 size-5" />
            Go to Dashboard
            {!isProfileComplete && (
              <Icon icon="material-symbols:lock-outline" className="ml-2 size-4" />
            )}
          </Button>
          
          {!isProfileComplete && (
            <p className="text-xs text-center text-gray-500 mt-3">
              Complete all sections to unlock
            </p>
          )}
        </div>

        {/* Profile Sections Checklist */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon icon="material-symbols:checklist" className="size-6 text-primary-500" />
            Profile Sections
          </h2>
          
          <div className="space-y-3">
            {PROFILE_SECTIONS.map((section, index) => {
              const sectionKey = section.name;
              const isCompleted = profileCompletion?.sections?.[sectionKey] || false;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    isCompleted
                      ? "border-success-200 bg-success-50"
                      : "border-gray-200 bg-white hover:border-primary-200"
                  }`}
                  onClick={() => router.push(section.route)}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <Icon
                        icon="mdi:check-circle"
                        className="size-6 text-success-600"
                      />
                    ) : (
                      <div className="size-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon icon={section.icon} className="size-5 text-gray-600 flex-shrink-0" />
                      <span
                        className={`text-sm font-medium truncate ${
                          isCompleted ? "text-success-700" : "text-gray-700"
                        }`}
                      >
                        {section.name}
                      </span>
                    </div>
                  </div>
                  
                  <Icon
                    icon="material-symbols:chevron-right"
                    className="size-5 text-gray-400 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
