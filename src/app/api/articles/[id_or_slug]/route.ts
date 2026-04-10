import { auth } from "@/auth";
import Article from "@/models/Article";
import Comment from "@/models/Comment";
import Reaction from "@/models/Reaction";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdminRole } from "@/lib/role";
import { writeFile, mkdir } from "fs/promises";
import slugify from "slugify";

export async function GET(req: Request, { params }: { params: Promise<{ id_or_slug: string }> }) {
  try {
    const { id_or_slug } = await params;
    await connectDB();

    const query = mongoose.isValidObjectId(id_or_slug) 
      ? { _id: id_or_slug } 
      : { slug: id_or_slug };

    const article = await Article.findOne(query)
      .populate("author", "name email")
      .populate("category", "name slug");

    if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

    // Fetch comments and reactions counts manually for performance/clarity, matching Laravel load()
    const [comments, likes_count, dislikes_count] = await Promise.all([
      Comment.find({ article: article._id }).populate("user", "name image").sort({ createdAt: -1 }),
      Reaction.countDocuments({ article: article._id, type: "like" }),
      Reaction.countDocuments({ article: article._id, type: "dislike" }),
    ]);

    // Convert to plain object to attach metadata (like Laravel load/setAttribute)
    const result = {
      ...article.toObject(),
      comments,
      likes_count,
      dislikes_count,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const PATCH = auth(async function PATCH(req, { params }: { params: any }) {
  const { id_or_slug } = await params;
  if (!req.auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const article = await Article.findById(id_or_slug);
    if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

    // Forbidden check (Ownership or Admin)
    if (article.author.toString() !== req.auth.user.id && !isAdminRole(req.auth.user.role as string | undefined)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    if (title) {
      article.title = title;
      article.slug = `${slugify(title, { lower: true })}-${Date.now()}`;
    }
    if (content) article.content = content;
    if (category) article.category = category;

    if (imageFile) {
      await mkdir('public/uploads', { recursive: true });
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filepath = `public/uploads/${filename}`;
      await writeFile(filepath, buffer);
      article.image = `/uploads/${filename}`;
    }

    await article.save();

    const populatedArticle = await Article.findById(article._id).populate("author", "name email").populate("category", "name slug");

    return NextResponse.json(populatedArticle);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }: { params: any }) {
  const { id_or_slug } = await params;
  if (!req.auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const article = await Article.findById(id_or_slug);
    if (!article) return NextResponse.json({ message: "Article not found" }, { status: 404 });

    // Forbidden check (Ownership or Admin)
    if (article.author.toString() !== req.auth.user.id && !isAdminRole(req.auth.user.role as string | undefined)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Article.deleteOne({ _id: article._id });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
