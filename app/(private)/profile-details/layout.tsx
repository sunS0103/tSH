import ProfileOnboardingWrapper from "@/components/profile/profile-onboarding-wrapper";

export default function ProfileDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProfileOnboardingWrapper>
      {children}
    </ProfileOnboardingWrapper>
  );
}
