import { auth } from "@/auth";
import User from "@/models/User";
import Article from "@/models/Article";
import Category from "@/models/Category";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/role";

export const GET = auth(async function GET(req) {
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    const [total_users, total_articles, total_categories, recent_articles, recent_users] = await Promise.all([
      User.countDocuments({}),
      Article.countDocuments({}),
      Category.countDocuments({}),
      Article.find({}).sort({ createdAt: -1 }).limit(5).populate("author", "name").populate("category", "name"),
      User.find({}).sort({ createdAt: -1 }).limit(5).select("-password"),
    ]);

    return NextResponse.json({
      total_users,
      total_articles,
      total_categories,
      recent_articles,
      recent_users,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
