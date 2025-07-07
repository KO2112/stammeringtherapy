"use server"

import { adminAuth } from "./../firebase-admin"
import { db } from "../../firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"

export async function deleteUserComplete(uid: string) {
  try {
    // Try to delete from Firebase Auth using Admin SDK
    try {
      await adminAuth.deleteUser(uid)
      console.log(`✅ Deleted user from Firebase Auth: ${uid}`)
    } catch (authError: unknown) {
      // Type guard to check if it's a Firebase Auth error
      if (authError && typeof authError === "object" && "code" in authError) {
        const firebaseError = authError as { code: string; message?: string }

        if (firebaseError.code === "auth/user-not-found") {
          console.log(`⚠️ User not found in Firebase Auth (already deleted or never existed): ${uid}`)
        } else {
          // For other auth errors, still log but continue
          console.error("Error deleting from Firebase Auth:", firebaseError)
        }
      } else {
        // For non-Firebase errors
        console.error("Unknown error deleting from Firebase Auth:", authError)
      }
    }

    // Delete from Firestore using client SDK (same as your working setup)
    await deleteDoc(doc(db, "users", uid))
    console.log(`✅ Deleted user from Firestore: ${uid}`)

    revalidatePath("/admin")

    return { success: true, message: "User deleted successfully!" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}
