import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ArticleForm from "@/components/articles/ArticleForm";
import { isAdminRole } from "@/lib/role";

async function getArticle(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [article, categories] = await Promise.all([
    getArticle(id),
    getCategories(),
  ]);

  if (!article) return notFound();

  // Basic ownership check
  const isOwner = session.user.id === (article.author?._id || article.author);
  const isAdmin = isAdminRole(session.user.role as string | undefined);
  if (!isOwner && !isAdmin) redirect("/articles");

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <ArticleForm initialData={article} categories={categories} />
      </main>
    </div>
  );
}
