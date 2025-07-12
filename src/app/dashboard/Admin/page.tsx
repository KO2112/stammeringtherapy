"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  getDoc,
  where,
  deleteDoc,
  type Timestamp,
} from "firebase/firestore";
import {
  Search,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  UserPlus,
  AlertCircle,
  CheckCircle,
  X,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { deleteUserComplete } from "../../../../lib/actions/delete-user-action";

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: Timestamp | Date;
}

interface AlertState {
  show: boolean;
  type: "success" | "error";
  message: string;
}

interface AdminCheckState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "success",
    message: "",
  });
  const [adminCheck, setAdminCheck] = useState<AdminCheckState>({
    isAdmin: false,
    loading: true,
    error: null,
  });
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "You must be logged in to access this page",
        });
        return;
      }

      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        if (!currentUserDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "User profile not found",
          });
          return;
        }

        const currentUserData = currentUserDoc.data();
        if (currentUserData.role !== "admin") {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "Access denied. Admin privileges required.",
          });
          return;
        }

        setAdminCheck({
          isAdmin: true,
          loading: false,
          error: null,
        });
        await fetchUsers();
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Failed to verify admin permissions",
        });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName || ""} ${user.lastName || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const usersList: User[] = [];

      querySnapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data(),
        } as User);
      });

      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("error", "Failed to fetch users");
      setLoading(false);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 5000);
  };

  const validateUsername = (username: string): boolean => {
    if (username.includes(" ")) return false;
    if (username.length < 3) return false;
    return true;
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      let exists = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.username?.toLowerCase() === username.toLowerCase()) {
          exists = true;
        }
      });
      return exists;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("add-user");

    if (!validateUsername(newUser.username)) {
      showAlert(
        "error",
        "Username must be at least 3 characters and contain no spaces"
      );
      setActionLoading(null);
      return;
    }

    const usernameExists = await checkUsernameExists(newUser.username);
    if (usernameExists) {
      showAlert(
        "error",
        "Username already exists. Please choose a different username."
      );
      setActionLoading(null);
      return;
    }

    try {
      console.log("Calling API with data:", newUser);
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        showAlert("success", result.message);
        setNewUser({
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          password: "",
        });
        setShowAddUserForm(false);
        fetchUsers();
      } else {
        showAlert("error", result.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      showAlert("error", `Failed to add user: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    setActionLoading(userId);
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      showAlert("success", `User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      showAlert("error", "Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };

  // New function to toggle user activation status
  const toggleUserStatus = async (userId: string, currentRole: string) => {
    setActionLoading(`status-${userId}`);
    try {
      const newRole = currentRole === "nouser" ? "user" : "nouser";
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      const statusText = newRole === "user" ? "aktif" : "devre dışı";
      showAlert("success", `Kullanıcı durumu ${statusText} olarak güncellendi`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      showAlert("error", "Kullanıcı durumu güncellenirken hata oluştu");
    } finally {
      setActionLoading(null);
    }
  };

  // Updated delete function with story visits cleanup
  const deleteUserAccount = async (userId: string, email: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user ${email}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      console.log(`🗑️ Starting deletion for user: ${email}`);
      // 1. Delete story visits first
      console.log("🧹 Cleaning up story visits...");
      const visitsRef = collection(db, "storyVisits");
      const visitsQuery = query(visitsRef, where("userId", "==", userId));
      const visitsSnapshot = await getDocs(visitsQuery);

      if (!visitsSnapshot.empty) {
        console.log(`Found ${visitsSnapshot.size} story visits to delete`);
        const deleteVisitsPromises: Promise<void>[] = [];
        visitsSnapshot.forEach((visitDoc) => {
          deleteVisitsPromises.push(
            deleteDoc(doc(db, "storyVisits", visitDoc.id))
          );
        });
        await Promise.all(deleteVisitsPromises);
        console.log(`✅ Deleted ${visitsSnapshot.size} story visits`);
      }

      // 2. Delete story completions
      console.log("🧹 Cleaning up story completions...");
      const completionsRef = collection(db, "storyCompletions");
      const completionsQuery = query(
        completionsRef,
        where("userId", "==", userId)
      );
      const completionsSnapshot = await getDocs(completionsQuery);

      if (!completionsSnapshot.empty) {
        console.log(
          `Found ${completionsSnapshot.size} story completions to delete`
        );
        const deleteCompletionsPromises: Promise<void>[] = [];
        completionsSnapshot.forEach((completionDoc) => {
          deleteCompletionsPromises.push(
            deleteDoc(doc(db, "storyCompletions", completionDoc.id))
          );
        });
        await Promise.all(deleteCompletionsPromises);
        console.log(`✅ Deleted ${completionsSnapshot.size} story completions`);
      }

      // 3. Call the server action to delete user from auth and users collection
      const result = await deleteUserComplete(userId);
      if (result.success) {
        showAlert(
          "success",
          `User deleted successfully! Cleaned up ${visitsSnapshot.size} visits and ${completionsSnapshot.size} completions.`
        );
        fetchUsers();
      } else {
        showAlert("error", result.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      showAlert("error", `Failed to delete user: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper function to get role display info
  const getRoleDisplayInfo = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          icon: ShieldCheck,
          className: "bg-teal-100 text-teal-800",
        };
      case "user":
        return {
          label: "Aktif Kullanıcı",
          icon: UserCheck,
          className: "bg-green-100 text-green-800",
        };
      case "nouser":
        return {
          label: "Devre Dışı",
          icon: UserX,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: "Kullanıcı",
          icon: Users,
          className: "bg-slate-100 text-slate-800",
        };
    }
  };

  if (adminCheck.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">
            Verifying admin permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!adminCheck.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-6">
            {adminCheck.error ||
              "You don't have permission to access this page."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium text-sm md:text-base">
            {alert.message}
          </span>
          <button
            onClick={() =>
              setAlert({ show: false, type: "success", message: "" })
            }
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Yönetici paneli
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-600">
            Kullanıcıları, rolleri ve sistem ayarlarını yönetin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Toplam Kullanıcı
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-teal-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Admin Sayısı
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Aktif Kullanıcı
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "user").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-red-50 rounded-lg">
                <UserX className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Devre Dışı
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "nouser").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Kullanıcı Ekle
                </h2>
              </div>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="flex items-center gap-2 px-3 py-2 md:px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm md:text-base"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Kullanıcı Ekle</span>
                <span className="sm:hidden">Ekle</span>
              </button>
            </div>
          </div>

          {showAddUserForm && (
            <div className="p-4 md:p-6">
              <form
                onSubmit={handleAddUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => {
                      const username = e.target.value
                        .replace(/\s/g, "")
                        .toLowerCase();
                      setNewUser({ ...newUser, username });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="kemalorhan (Boşluk Olmadan)"
                    minLength={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Username must be at least 6 characters, no spaces allowed
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Minimum 6 characters"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Doe"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading === "add-user"}
                    className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
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
                      setShowAddUserForm(false);
                      setNewUser({
                        email: "",
                        username: "",
                        firstName: "",
                        lastName: "",
                        password: "",
                      });
                    }}
                    className="px-4 py-2 md:px-6 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Kullanıcı Yönetimi
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64 text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            {filteredUsers.length > 0 ? (
              <div className="p-4 space-y-4">
                {filteredUsers
                  .slice(
                    (currentPage - 1) * usersPerPage,
                    currentPage * usersPerPage
                  )
                  .map((user) => {
                    const roleInfo = getRoleDisplayInfo(user.role || "user");
                    const IconComponent = roleInfo.icon;

                    return (
                      <div
                        key={user.id}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.firstName
                                  ? user.firstName.charAt(0).toUpperCase()
                                  : user.username
                                    ? user.username.charAt(0).toUpperCase()
                                    : user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.firstName ||
                                    user.username ||
                                    "No name"}
                              </div>
                              <div className="text-xs text-slate-600">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo.className}`}
                          >
                            <IconComponent className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </span>
                        </div>
                        {user.username && (
                          <div className="mb-3">
                            <span className="font-mono bg-white px-2 py-1 rounded text-xs border">
                              @{user.username}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                toggleUserStatus(user.id, user.role || "user")
                              }
                              disabled={actionLoading === `status-${user.id}`}
                              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                user.role === "nouser"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {actionLoading === `status-${user.id}` ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current"></div>
                              ) : user.role === "nouser" ? (
                                <UserCheck className="h-3 w-3" />
                              ) : (
                                <UserX className="h-3 w-3" />
                              )}
                              {user.role === "nouser" ? "Aktif" : "Devre Dışı"}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              toggleAdminRole(user.id, user.role || "user")
                            }
                            disabled={actionLoading === user.id}
                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
                            {user.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin"}
                          </button>
                          <button
                            onClick={() =>
                              deleteUserAccount(user.id, user.email)
                            }
                            disabled={actionLoading === user.id}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users found"}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kullanıcı Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Eylemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers
                  .slice(
                    (currentPage - 1) * usersPerPage,
                    currentPage * usersPerPage
                  )
                  .map((user) => {
                    const roleInfo = getRoleDisplayInfo(user.role || "user");
                    const IconComponent = roleInfo.icon;

                    return (
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
                                  : user.firstName ||
                                    user.username ||
                                    "No name"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {user.username ? (
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                              @{user.username}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">
                              No username
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.className}`}
                          >
                            <IconComponent className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  toggleUserStatus(user.id, user.role || "user")
                                }
                                disabled={actionLoading === `status-${user.id}`}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  user.role === "nouser"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {actionLoading === `status-${user.id}` ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current"></div>
                                ) : user.role === "nouser" ? (
                                  <UserCheck className="h-3 w-3" />
                                ) : (
                                  <UserX className="h-3 w-3" />
                                )}
                                {user.role === "nouser"
                                  ? "Aktif"
                                  : "Devre Dışı"}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                toggleAdminRole(user.id, user.role || "user")
                              }
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
                              {user.role === "admin"
                                ? "Remove Admin"
                                : "Make Admin"}
                            </button>
                            <button
                              onClick={() =>
                                deleteUserAccount(user.id, user.email)
                              }
                              disabled={actionLoading === user.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users found"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > usersPerPage && (
            <div className="px-4 md:px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {(currentPage - 1) * usersPerPage + 1} -{" "}
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)} /{" "}
                  {filteredUsers.length} kullanıcı gösteriliyor
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Önceki
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-slate-700">
                    Sayfa {currentPage} /{" "}
                    {Math.ceil(filteredUsers.length / usersPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage >=
                      Math.ceil(filteredUsers.length / usersPerPage)
                    }
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
