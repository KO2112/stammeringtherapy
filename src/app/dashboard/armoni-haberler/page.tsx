"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { auth, db, storage } from "../../../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  getDoc,
  type Timestamp,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type UpdateData, // Add this import
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import {
  Search,
  Plus,
  Shield,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  ImageIcon,
  Video,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react"

interface Haber {
  id: string
  title: string
  content: string
  imageUrls?: string[]
  videoUrls?: string[]
  createdAt: Timestamp | Date
  updatedAt?: Timestamp | Date
  authorId: string
  authorName: string
}

interface User {
  uid: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  role?: string
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

interface PaginationState {
  currentPage: number
  totalPages: number
  lastDoc: QueryDocumentSnapshot | null
  firstDoc: QueryDocumentSnapshot | null
  pageHistory: QueryDocumentSnapshot[]
}

interface FullscreenState {
  isOpen: boolean
  url: string
  type: "image" | "video"
}

interface MediaCarouselState {
  [haberId: string]: {
    mediaIndex: number
  }
}

export default function ArmoniHaberlerPage() {
  const [haberler, setHaberler] = useState<Haber[]>([])
  const [filteredHaberler, setFilteredHaberler] = useState<Haber[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showAddHaberForm, setShowAddHaberForm] = useState(false)
  const [editingHaber, setEditingHaber] = useState<Haber | null>(null)
  const [alert, setAlert] = useState<AlertState>({ show: false, type: "success", message: "" })
  const [adminCheck, setAdminCheck] = useState<AdminCheckState>({
    isAdmin: false,
    loading: true,
    error: null,
  })
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    lastDoc: null,
    firstDoc: null,
    pageHistory: [],
  })
  const [fullscreen, setFullscreen] = useState<FullscreenState>({
    isOpen: false,
    url: "",
    type: "image",
  })
  const [mediaCarousel, setMediaCarousel] = useState<MediaCarouselState>({})
  const [newHaber, setNewHaber] = useState({
    title: "",
    content: "",
    mediaFiles: [] as File[],
  })
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "You must be logged in to access this page",
        })
        setCurrentUser(null)
        await fetchHaberler()
        return
      }

      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid))
        if (!currentUserDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: null,
          })
          setCurrentUser(null)
          await fetchHaberler()
          return
        }

        const currentUserData = currentUserDoc.data()
        setCurrentUser({ uid: user.uid, ...currentUserData } as User)

        if (currentUserData.role === "admin") {
          setAdminCheck({
            isAdmin: true,
            loading: false,
            error: null,
          })
        } else {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: null,
          })
        }

        await fetchHaberler()
      } catch (error) {
        console.error("Error checking admin status:", error)
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Failed to verify permissions",
        })
        setCurrentUser(null)
        await fetchHaberler()
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const filtered = haberler.filter(
      (haber) =>
        haber.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        haber.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        haber.authorName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHaberler(filtered)
  }, [haberler, searchTerm])

  const fetchHaberler = async (pageDirection?: "next" | "prev") => {
    try {
      const haberlerRef = collection(db, "haberler")
      let q = query(haberlerRef, orderBy("createdAt", "desc"), limit(5))

      if (pageDirection === "next" && pagination.lastDoc) {
        q = query(haberlerRef, orderBy("createdAt", "desc"), startAfter(pagination.lastDoc), limit(5))
      } else if (pageDirection === "prev" && pagination.pageHistory.length > 0) {
        // Get the document to start from for the previous page
        const prevPageStartDoc = pagination.pageHistory[pagination.pageHistory.length - 2]
        if (prevPageStartDoc) {
          q = query(haberlerRef, orderBy("createdAt", "desc"), startAfter(prevPageStartDoc), limit(5))
        } else {
          // If we're going back to the first page
          q = query(haberlerRef, orderBy("createdAt", "desc"), limit(5))
        }
      }

      const querySnapshot = await getDocs(q)
      const haberlerList: Haber[] = []
      querySnapshot.forEach((doc) => {
        haberlerList.push({
          id: doc.id,
          ...doc.data(),
        } as Haber)
      })

      setHaberler(haberlerList)

      if (querySnapshot.docs.length > 0) {
        setPagination((prev) => {
          let newPageHistory = [...prev.pageHistory]
          let newCurrentPage = prev.currentPage

          console.log("Before update:", {
            pageDirection,
            currentPage: prev.currentPage,
            historyLength: prev.pageHistory.length,
          })

          if (pageDirection === "next") {
            // Add current first doc to history before moving to next page
            if (prev.firstDoc) {
              newPageHistory.push(prev.firstDoc)
            }
            newCurrentPage = prev.currentPage + 1
          } else if (pageDirection === "prev") {
            // Remove the last entry from history when going back
            if (newPageHistory.length > 0) {
              newPageHistory.pop()
            }
            newCurrentPage = Math.max(1, prev.currentPage - 1)
          } else {
            // Initial load or reset
            newPageHistory = []
            newCurrentPage = 1
          }

          console.log("After update:", {
            newCurrentPage,
            newHistoryLength: newPageHistory.length,
          })

          return {
            ...prev,
            lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
            firstDoc: querySnapshot.docs[0],
            currentPage: newCurrentPage,
            pageHistory: newPageHistory,
          }
        })
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching haberler:", error)
      showAlert("error", "Failed to fetch haberler")
      setLoading(false)
    }
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ show: true, type, message })
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" })
    }, 5000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const validFiles = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      if (validFiles.length !== files.length) {
        showAlert("error", "Some files were skipped. Please select only image or video files.")
      }

      setNewHaber({
        ...newHaber,
        mediaFiles: [...newHaber.mediaFiles, ...validFiles],
      })
      e.target.value = ""
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = newHaber.mediaFiles.filter((_, i) => i !== index)
    setNewHaber({ ...newHaber, mediaFiles: updatedFiles })
  }

  const uploadMedia = async (file: File): Promise<string> => {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const storageRef = ref(storage, `haberler/${fileName}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  const handleAddHaber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setActionLoading("add-haber")
    try {
      const imageUrls: string[] = []
      const videoUrls: string[] = []

      for (const file of newHaber.mediaFiles) {
        const url = await uploadMedia(file)
        if (file.type.startsWith("image/")) {
          imageUrls.push(url)
        } else if (file.type.startsWith("video/")) {
          videoUrls.push(url)
        }
      }

      const haberData = {
        title: newHaber.title,
        content: newHaber.content,
        ...(imageUrls.length > 0 && { imageUrls }),
        ...(videoUrls.length > 0 && { videoUrls }),
        createdAt: new Date(),
        authorId: currentUser.uid,
        authorName:
          currentUser.firstName && currentUser.lastName
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : currentUser.username || currentUser.email || "Unknown User",
      }

      await addDoc(collection(db, "haberler"), haberData)
      showAlert("success", "Haber successfully added!")
      setNewHaber({ title: "", content: "", mediaFiles: [] })
      setShowAddHaberForm(false)
      fetchHaberler()
    } catch (error) {
      console.error("Error adding haber:", error)
      showAlert("error", "Failed to add haber")
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditHaber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHaber || !currentUser) return

    setActionLoading("edit-haber")
    try {
      const imageUrls: string[] = [...(editingHaber.imageUrls || [])]
      const videoUrls: string[] = [...(editingHaber.videoUrls || [])]

      for (const file of newHaber.mediaFiles) {
        const url = await uploadMedia(file)
        if (file.type.startsWith("image/")) {
          imageUrls.push(url)
        } else if (file.type.startsWith("video/")) {
          videoUrls.push(url)
        }
      }

      const updateData: UpdateData<Haber> = {
        title: newHaber.title,
        content: newHaber.content,
        updatedAt: new Date(),
      }

      if (imageUrls.length > 0) updateData.imageUrls = imageUrls
      if (videoUrls.length > 0) updateData.videoUrls = videoUrls

      await updateDoc(doc(db, "haberler", editingHaber.id), updateData)
      showAlert("success", "Haber successfully updated!")
      setEditingHaber(null)
      setNewHaber({ title: "", content: "", mediaFiles: [] })
      setShowAddHaberForm(false)
      fetchHaberler()
    } catch (error) {
      console.error("Error updating haber:", error)
      showAlert("error", "Failed to update haber")
    } finally {
      setActionLoading(null)
    }
  }

  const deleteHaber = async (haberId: string, imageUrls?: string[], videoUrls?: string[]) => {
    if (!confirm("Are you sure you want to delete this haber? This action cannot be undone.")) {
      return
    }

    setActionLoading(haberId)
    try {
      const allUrls = [...(imageUrls || []), ...(videoUrls || [])]
      for (const url of allUrls) {
        try {
          const mediaRef = ref(storage, url)
          await deleteObject(mediaRef)
        } catch {
          console.log("Media file not found or already deleted")
        }
      }

      await deleteDoc(doc(db, "haberler", haberId))
      showAlert("success", "Haber successfully deleted!")
      fetchHaberler()
    } catch (error) {
      console.error("Error deleting haber:", error)
      showAlert("error", "Failed to delete haber")
    } finally {
      setActionLoading(null)
    }
  }

  const startEdit = (haber: Haber) => {
    setEditingHaber(haber)
    setNewHaber({
      title: haber.title,
      content: haber.content,
      mediaFiles: [],
    })
    setShowAddHaberForm(true)
  }

  const cancelEdit = () => {
    setEditingHaber(null)
    setNewHaber({ title: "", content: "", mediaFiles: [] })
    setShowAddHaberForm(false)
  }

  const openFullscreen = (url: string, type: "image" | "video") => {
    setFullscreen({ isOpen: true, url, type })
  }

  const closeFullscreen = () => {
    setFullscreen({ isOpen: false, url: "", type: "image" })
  }

  const nextMedia = (haberId: string, totalMedia: number) => {
    setMediaCarousel((prev) => ({
      ...prev,
      [haberId]: {
        mediaIndex: ((prev[haberId]?.mediaIndex || 0) + 1) % totalMedia,
      },
    }))
  }

  const prevMedia = (haberId: string, totalMedia: number) => {
    setMediaCarousel((prev) => ({
      ...prev,
      [haberId]: {
        mediaIndex: ((prev[haberId]?.mediaIndex || 0) - 1 + totalMedia) % totalMedia,
      },
    }))
  }

  if (adminCheck.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Loading haberler...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      {/* Fullscreen Modal */}
      {fullscreen.isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            {fullscreen.type === "image" ? (
              <img
                src={fullscreen.url || "/placeholder.svg"}
                alt="Fullscreen"
                className="max-w-full max-h-full object-contain"
                onClick={closeFullscreen}
              />
            ) : (
              <video src={fullscreen.url} controls autoPlay className="max-w-full max-h-full object-contain" />
            )}
          </div>
        </div>
      )}

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
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Newspaper className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Armoni Haberler</h1>
                <p className="text-slate-600 text-sm md:text-base">Armoni topluluğundan en son haberler</p>
              </div>
            </div>

            {adminCheck.isAdmin && (
              <button
                onClick={() => setShowAddHaberForm(!showAddHaberForm)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm md:text-base w-full md:w-auto"
              >
                <Plus className="h-4 w-4" />
                Haber Ekle
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 md:mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Haber ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full text-sm md:text-base"
            />
          </div>
        </div>

        {/* Add/Edit Haber Form */}
        {showAddHaberForm && adminCheck.isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingHaber ? "Haber Düzenle" : "Yeni Haber Ekle"}
              </h2>
            </div>

            <div className="p-6">
              <form onSubmit={editingHaber ? handleEditHaber : handleAddHaber} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Başlık *</label>
                  <input
                    type="text"
                    required
                    value={newHaber.title}
                    onChange={(e) => setNewHaber({ ...newHaber, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Haber başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">İçerik *</label>
                  <textarea
                    required
                    rows={6}
                    value={newHaber.content}
                    onChange={(e) => setNewHaber({ ...newHaber, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Haber içeriği"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Medya (Opsiyonel)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    You can select multiple files at once. Click &ldquo;Choose Files&rdquo; again to add more files.
                  </p>
                  {newHaber.mediaFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-slate-600">Selected files ({newHaber.mediaFiles.length}):</p>
                      {newHaber.mediaFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-sm text-slate-700">
                            {file.name} ({file.type.startsWith("image/") ? "Image" : "Video"})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading === "add-haber" || actionLoading === "edit-haber"}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading === "add-haber" || actionLoading === "edit-haber" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {editingHaber ? "Güncelle" : "Ekle"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Haberler List */}
        <div className="space-y-6">
          {filteredHaberler.map((haber) => {
            // Combine all media into one array
            const allMedia = [
              ...(haber.imageUrls?.map((url) => ({ type: "image" as const, url })) || []),
              ...(haber.videoUrls?.map((url) => ({ type: "video" as const, url })) || []),
            ]
            const currentMediaIndex = mediaCarousel[haber.id]?.mediaIndex || 0
            const currentMedia = allMedia[currentMediaIndex]

            return (
              <div key={haber.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Combined Media */}
                {allMedia.length > 0 && (
                  <div className="w-full relative">
                    <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-black">
                      {currentMedia?.type === "image" ? (
                        <img
                          src={currentMedia.url || "/placeholder.svg"}
                          alt={`${haber.title} - ${currentMediaIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openFullscreen(currentMedia.url, "image")}
                        />
                      ) : currentMedia?.type === "video" ? (
                        <video src={currentMedia.url} controls className="w-full h-full object-contain" />
                      ) : null}
                    </div>

                    {allMedia.length > 1 && (
                      <>
                        <button
                          onClick={() => prevMedia(haber.id, allMedia.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => nextMedia(haber.id, allMedia.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentMediaIndex + 1} / {allMedia.length}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{haber.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          <span>
                            {haber.createdAt instanceof Date
                              ? haber.createdAt.toLocaleDateString("tr-TR")
                              : haber.createdAt.toDate().toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                        <span>By {haber.authorName}</span>
                        {allMedia.length > 0 && (
                          <div className="flex items-center gap-2">
                            {haber.imageUrls && haber.imageUrls.length > 0 && (
                              <div className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                                <span>{haber.imageUrls.length}</span>
                              </div>
                            )}
                            {haber.videoUrls && haber.videoUrls.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Video className="h-3 w-3 md:h-4 md:w-4" />
                                <span>{haber.videoUrls.length}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {adminCheck.isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(haber)}
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden md:inline">Düzenle</span>
                        </button>
                        <button
                          onClick={() => deleteHaber(haber.id, haber.imageUrls, haber.videoUrls)}
                          disabled={actionLoading === haber.id}
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden md:inline">Sil</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {haber.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredHaberler.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                {searchTerm ? "Arama kriterlerinize uygun haber bulunamadı" : "Henüz haber bulunmuyor"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!searchTerm && (pagination.currentPage > 1 || haberler.length === 5) && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => fetchHaberler("prev")}
              disabled={pagination.currentPage <= 1}
              className="flex items-center gap-2 px-3 md:px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Önceki</span>
            </button>
            <span className="text-slate-600 font-medium text-sm md:text-base">Sayfa {pagination.currentPage}</span>
            <button
              onClick={() => fetchHaberler("next")}
              disabled={haberler.length < 5}
              className="flex items-center gap-2 px-3 md:px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            >
              <span className="hidden md:inline">Sonraki</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
