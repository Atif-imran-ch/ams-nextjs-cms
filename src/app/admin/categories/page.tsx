import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";
import { isAdminRole } from "@/lib/role";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session || !isAdminRole(session.user.role as string | undefined)) {
    redirect("/login");
  }

  const categories = await getCategories();

  return (
    <div className="fade-in">
      <AdminCategoriesClient initialCategories={categories} />
    </div>
  );
}
