import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Define the correct type for Next.js route parameters
type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: RouteContext  // Use the correct type here
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    await connectDB();

    const task = await Task.findById(params.id).populate('assignedTo', 'username email');

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    const data = await req.json();

    await connectDB();

    const task = await Task.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    ).populate('assignedTo', 'username email');

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    await connectDB();

    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Task DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
} 