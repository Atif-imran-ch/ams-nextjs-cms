import { auth } from "@/auth";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET /api/user/profile - Fetch personal profile
export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(req.auth.user.id).select("-password");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// PATCH /api/user/profile - Update personal profile
export const PATCH = auth(async function PATCH(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, email, image } = await req.json();
    await connectDB();

    const user = await User.findById(req.auth.user.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "Email already taken" }, { status: 400 });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    const result = user.toObject();
    delete result.password;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: result
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
