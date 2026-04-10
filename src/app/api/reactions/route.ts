import { auth } from "@/auth";
import Reaction from "@/models/Reaction";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { article_id, type } = await req.json(); // type: 'like' or 'dislike'
    if (!article_id || !["like", "dislike"].includes(type)) {
      return NextResponse.json({ message: "Valid article_id and type required" }, { status: 400 });
    }

    await connectDB();
    const existing = await Reaction.findOne({
      user: req.auth.user.id,
      article: article_id,
    });

    if (existing) {
      if (existing.type === type) {
        // Toggle off: remove
        await Reaction.deleteOne({ _id: existing._id });
        return NextResponse.json({ message: "Reaction removed" });
      } else {
        // Switch type
        existing.type = type;
        await existing.save();
        return NextResponse.json({ message: "Reaction updated" });
      }
    }

    await Reaction.create({
      user: req.auth.user.id,
      article: article_id,
      type,
    });

    return NextResponse.json({ message: "Reaction added" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
