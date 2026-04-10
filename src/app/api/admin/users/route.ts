import { auth } from "@/auth";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/role";

export const GET = auth(async function GET(req) {
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
