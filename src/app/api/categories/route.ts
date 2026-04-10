import { auth } from "@/auth";
import Category from "@/models/Category";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isAdminRole } from "@/lib/role";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const POST = auth(async function POST(req) {
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    await connectDB();

    const slug = slugify(name, { lower: true });
    
    // Check if slug exists
    const existing = await Category.findOne({ slug });
    if (existing) return NextResponse.json({ message: "Category with this name already exists" }, { status: 400 });

    const category = await Category.create({ name, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
