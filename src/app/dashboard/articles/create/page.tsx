import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ArticleForm from "@/components/articles/ArticleForm";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function CreateArticlePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <ArticleForm categories={categories} />
      </main>
    </div>
  );
}
