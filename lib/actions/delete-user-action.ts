"use server"

import { adminAuth } from "./../firebase-admin"
import { db } from "../../firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"

export async function deleteUserComplete(uid: string) {
  try {
    // Delete from Firebase Auth using Admin SDK
    await adminAuth.deleteUser(uid)
    
    // Delete from Firestore using client SDK (same as your working setup)
    await deleteDoc(doc(db, "users", uid))
    
    revalidatePath('/admin')
    
    return { success: true, message: "User deleted successfully!" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}
