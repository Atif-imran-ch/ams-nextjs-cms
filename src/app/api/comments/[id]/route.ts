import { auth } from "@/auth";
import Comment from "@/models/Comment";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/role";

export const DELETE = auth(async function DELETE(req, { params }: { params: any }) {
  const { id } = await params;
  if (!req.auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    // Owner or Admin check
    if (comment.user.toString() !== req.auth.user.id && !isAdminRole(req.auth.user.role as string | undefined)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Comment.deleteOne({ _id: comment._id });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
