import { auth } from "@/auth";
import Article from "@/models/Article";
import User from "@/models/User";
import Category from "@/models/Category";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { writeFile, mkdir } from "fs/promises";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const limit = 6;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    await connectDB();
    
    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate({ path: "author", model: User, select: "name email" })
        .populate({ path: "category", model: Category, select: "name" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(query)
    ]);

    return NextResponse.json({
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error("GET ARTICLES ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = req.auth.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    let image = '';
    if (imageFile) {
      await mkdir('public/uploads', { recursive: true });
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filepath = `public/uploads/${filename}`;
      await writeFile(filepath, buffer);
      image = `/uploads/${filename}`;
    }

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    await connectDB();

    const slug = `${slugify(title, { lower: true })}-${Date.now()}`;

    const article = await Article.create({
      title,
      slug,
      content,
      image,
      author: userId,
      category,
    });

    const populatedArticle = await Article.findById(article._id).populate("author", "name email").populate("category", "name slug");

    return NextResponse.json(populatedArticle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
