import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Add this to make the route dynamic
export const dynamic = 'force-dynamic';

// Get all tasks
export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    await connectDB();

    // Fetch tasks for the current user and populate assignedTo field
    const tasks = await Task.find({
      $or: [
        { assignedTo: user._id },
        { createdBy: user._id }
      ]
    }).populate('assignedTo', 'username email');

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Tasks GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// Create new task
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    const data = await req.json();

    await connectDB();

    const task = await Task.create({
      ...data,
      createdBy: user._id, // Add the creator's ID
      status: 'TODO',
    });

    // Populate the assignedTo field
    await task.populate('assignedTo', 'username email');

    return NextResponse.json(task);
  } catch (error) {
    console.error("Tasks POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 