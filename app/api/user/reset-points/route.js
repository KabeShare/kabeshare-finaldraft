import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      // Return 404 status if user not found in MongoDB
      return NextResponse.json(
        {
          success: false,
          message: "User not found in database. Cannot reset points.",
        },
        { status: 404 }
      );
    }

    user.points = 0;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User points reset to 0 successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
