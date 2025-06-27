"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { auth, db } from "../../../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, doc, updateDoc, query, orderBy, getDoc, type Timestamp } from "firebase/firestore"
import { Search, Plus, Shield, ShieldCheck, Trash2, Users, UserPlus, AlertCircle, CheckCircle, X } from "lucide-react"
import { deleteUserComplete } from "../../../../lib/actions/delete-user-action"

interface User {
  id: string
  email: string
  username?: string
  firstName?: string
  lastName?: string
  role?: string
  createdAt?: Timestamp | Date
}

interface AlertState {
  show: boolean
  type: "success" | "error"
  message: string
}

interface AdminCheckState {
  isAdmin: boolean
  loading: boolean
  error: string | null
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [alert, setAlert] = useState<AlertState>({ show: false, type: "success", message: "" })
  const [adminCheck, setAdminCheck] = useState<AdminCheckState>({
    isAdmin: false,
    loading: true,
    error: null,
  })
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "You must be logged in to access this page",
        })
        return
      }

      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid))
        if (!currentUserDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "User profile not found",
          })
          return
        }

        const currentUserData = currentUserDoc.data()
        if (currentUserData.role !== "admin") {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "Access denied. Admin privileges required.",
          })
          return
        }

        setAdminCheck({
          isAdmin: true,
          loading: false,
          error: null,
        })
        await fetchUsers()
      } catch (error) {
        console.error("Error checking admin status:", error)
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Failed to verify admin permissions",
        })
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("email"))
      const querySnapshot = await getDocs(q)
      const usersList: User[] = []
      querySnapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data(),
        } as User)
      })
      setUsers(usersList)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      showAlert("error", "Failed to fetch users")
      setLoading(false)
    }
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" })
    }, 5000)
  }

  const validateUsername = (username: string): boolean => {
    if (username.includes(" ")) return false
    if (username.length < 3) return false
    return true
  }

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users")
      const querySnapshot = await getDocs(usersRef)
      let exists = false
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        if (userData.username?.toLowerCase() === username.toLowerCase()) {
          exists = true
        }
      })
      return exists
    } catch (error) {
      console.error("Error checking username:", error)
      return false
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading("add-user")

    if (!validateUsername(newUser.username)) {
      showAlert("error", "Username must be at least 3 characters and contain no spaces")
      setActionLoading(null)
      return
    }

    const usernameExists = await checkUsernameExists(newUser.username)
    if (usernameExists) {
      showAlert("error", "Username already exists. Please choose a different username.")
      setActionLoading(null)
      return
    }

    try {
      console.log("Calling API with data:", newUser)
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server returned non-JSON response")
      }

      const result = await response.json()
      console.log("API Response:", result)

      if (result.success) {
        showAlert("success", result.message)
        setNewUser({ email: "", username: "", firstName: "", lastName: "", password: "" })
        setShowAddUserForm(false)
        fetchUsers()
      } else {
        showAlert("error", result.message)
      }
    } catch (error) {
      console.error("Error adding user:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      showAlert("error", `Failed to add user: ${errorMessage}`)
    } finally {
      setActionLoading(null)
    }
  }

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    setActionLoading(userId)
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      })
      showAlert("success", `User role updated to ${newRole}`)
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      showAlert("error", "Failed to update user role")
    } finally {
      setActionLoading(null)
    }
  }

  // Updated delete function using server action
  const deleteUserAccount = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return
    }

    setActionLoading(userId)
    try {
      const result = await deleteUserComplete(userId)
      if (result.success) {
        showAlert("success", result.message)
        fetchUsers()
      } else {
        showAlert("error", result.message)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      showAlert("error", `Failed to delete user: ${errorMessage}`)
    } finally {
      setActionLoading(null)
    }
  }

  if (adminCheck.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Verifying admin permissions...</p>
        </div>
      </div>
    )
  }

  if (!adminCheck.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">{adminCheck.error || "You don't have permission to access this page."}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {alert.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-medium">{alert.message}</span>
          <button
            onClick={() => setAlert({ show: false, type: "success", message: "" })}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-slate-600">Manage users, roles, and system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Admin Users</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Regular Users</p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role !== "admin").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-slate-900">Add New User</h2>
              </div>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>

          {showAddUserForm && (
            <div className="p-6">
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username *</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => {
                      const username = e.target.value.replace(/\s/g, "").toLowerCase()
                      setNewUser({ ...newUser, username })
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="kemalorhan (no spaces)"
                    minLength={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Username must be at least 3 characters, no spaces allowed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Minimum 6 characters"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading === "add-user"}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading === "add-user" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {actionLoading === "add-user" ? "Adding..." : "Add User"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserForm(false)
                      setNewUser({ email: "", username: "", firstName: "", lastName: "", password: "" })
                    }}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.firstName
                              ? user.firstName.charAt(0).toUpperCase()
                              : user.username
                                ? user.username.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.firstName || user.username || "No name"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {user.username ? (
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">@{user.username}</span>
                      ) : (
                        <span className="text-slate-400 italic">No username</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <Users className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleAdminRole(user.id, user.role || "user")}
                          disabled={actionLoading === user.id}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            user.role === "admin"
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current"></div>
                          ) : user.role === "admin" ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>

                        <button
                          onClick={() => deleteUserAccount(user.id, user.email)}
                          disabled={actionLoading === user.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  {searchTerm ? "No users found matching your search" : "No users found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
