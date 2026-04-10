import ProfileClient from "@/components/profile/ProfileClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile | Article Management System",
  description: "Manage your account settings and security",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 min-h-screen">
      <ProfileClient />
    </main>
  );
}
