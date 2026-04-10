import { auth } from "@/auth";
import Comment from "@/models/Comment";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { body, article_id } = await req.json();
    if (!body || !article_id) return NextResponse.json({ message: "Body and article_id are required" }, { status: 400 });

    await connectDB();
    const comment = await Comment.create({
      body,
      user: req.auth.user.id,
      article: article_id,
    });

    return NextResponse.json(await comment.populate("user", "name email"), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
