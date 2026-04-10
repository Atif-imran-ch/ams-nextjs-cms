import { auth } from "@/auth";
import Category from "@/models/Category";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isAdminRole } from "@/lib/role";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const PATCH = auth(async function PATCH(req, { params }: { params: any }) {
  const { id } = await params;
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    await connectDB();
    const slug = slugify(name, { lower: true });
    
    // Check if slug exists in OTHER categories
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) return NextResponse.json({ message: "Name already taken" }, { status: 400 });

    const category = await Category.findByIdAndUpdate(id, { name, slug }, { new: true });
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }: { params: any }) {
  const { id } = await params;
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
