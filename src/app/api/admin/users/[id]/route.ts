import { auth } from "@/auth";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/role";

export const PATCH = auth(async function PATCH(req, { params }: { params: any }) {
  const { id } = await params;
  if (!isAdminRole(req.auth?.user?.role as string | undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, email, role } = await req.json();
    await connectDB();

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ["User", "Admin"].includes(role)) user.role = role;

    await user.save();

    const result = user.toObject();
    delete result.password;

    return NextResponse.json(result);
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
    const user = await User.findByIdAndDelete(id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
