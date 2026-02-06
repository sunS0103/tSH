import { redirect } from "next/navigation";

export default async function ProfileDetailsPage() {
  // Redirect to the first section
  redirect("/profile-details/edit-account-and-identity");
}
