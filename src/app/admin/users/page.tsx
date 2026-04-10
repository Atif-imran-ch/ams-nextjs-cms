import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/admin/AdminUsersClient";
import { isAdminRole } from "@/lib/role";
import { headers } from "next/headers";

async function getUsers() {
  try {
    const h = await headers();
    const cookie = h.get('cookie');
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/users`, {
      headers: { cookie: cookie || '' },
      cache: 'no-store'
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Users API error:', res.status, text);
      return { error: `API error: ${res.status} - ${text}` };
    }
    return res.json();
  } catch (error: any) {
    console.error('Users fetch error:', error);
    return { error: `Fetch error: ${error.message}` };
  }
}

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || !isAdminRole(session.user.role as string | undefined)) {
    redirect("/login");
  }

  const users = await getUsers();

  if (users?.error) {
    return (
      <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold">
        {users.error}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
