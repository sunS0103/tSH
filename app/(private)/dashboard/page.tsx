import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";
import Footer from "@/components/footer";
import { getProfileCompletionPercentageServer } from "@/api/profile";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const token = cookieStore.get("token")?.value;

  // Check profile completion for candidates
  if (role === "CANDIDATE" && token) {
    try {
      const profileCompletion = await getProfileCompletionPercentageServer(
        token
      );
      if (
        profileCompletion &&
        profileCompletion.total_percentage !== undefined &&
        profileCompletion.total_percentage < 100
      ) {
        // Redirect to profile-details onboarding if profile is not 100% complete
        redirect("/profile-details/edit-account-and-identity");
      }
    } catch (error) {
      // If API call fails, allow access but log error
      // This prevents blocking users if there's an API issue
      console.error("Error checking profile completion:", error);
    }
  }

  return (
    <>
      <DashboardWrapper />
      <Footer />
    </>
  );
}
