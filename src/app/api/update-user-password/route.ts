import { type NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebase-admin";

// Only allow POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, newPassword } = body;

    if (!uid || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Missing uid or newPassword" },
        { status: 400 }
      );
    }

    // TODO: Add admin authentication/authorization check here if needed

    // Update the user's password
    await adminAuth.updateUser(uid, { password: newPassword });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating user password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update password" },
      { status: 500 }
    );
  }
}
