import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminArticlesClient from "@/components/admin/AdminArticlesClient";
import { isAdminRole } from "@/lib/role";

async function getArticles(page: number = 1) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles?page=${page}`, { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { last_page: 1 } };
    return res.json();
  } catch (error) {
    return { data: [], meta: { last_page: 1 } };
  }
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session || !isAdminRole(session.user.role as string | undefined)) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const { data: articles, meta } = await getArticles(currentPage);

  return (
    <div className="fade-in">
      <AdminArticlesClient 
        articles={articles} 
        pagination={{ page: currentPage, last_page: meta.last_page }} 
      />
    </div>
  );
}
