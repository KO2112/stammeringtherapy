import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "../../../../lib/firebase-admin"
import { db } from "../../../../firebase" // Use client SDK for Firestore
import { doc, setDoc } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    console.log("API route called - creating user")

    const body = await request.json()
    console.log("Request body:", body)

    const { email, password, username, firstName, lastName } = body

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password, and username are required",
        },
        { status: 400 },
      )
    }

    // Create user with Firebase Admin Auth
    console.log("Creating user with Firebase Admin Auth...")
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: firstName && lastName ? `${firstName} ${lastName}` : username,
    })

    console.log("User created in Auth:", userRecord.uid)

    // Add user data to Firestore using client SDK
    console.log("Adding user data to Firestore...")
    await setDoc(doc(db, "users", userRecord.uid), {
      email,
      username,
      firstName: firstName || "",
      lastName: lastName || "",
      role: "user",
      createdAt: new Date(),
    })

    console.log("User data added to Firestore successfully")

    return NextResponse.json({
      success: true,
      message: `User ${email} created successfully!`,
      userId: userRecord.uid,
    })
  } catch (error: any) {
    console.error("API Error:", error)

    // Handle specific Firebase errors
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create user",
      },
      { status: 500 },
    )
  }
}
