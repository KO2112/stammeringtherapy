"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { auth, db, storage } from "../../../../firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Calendar,
  LinkIcon,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  LogOut,
} from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  bio: string
  photoURL: string
  location: string
  occupation?: string
  birthday?: string
  website?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  github?: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    photoURL: "",
    location: "",
    occupation: "",
    birthday: "",
    website: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
    visible: boolean
  }>({
    message: "",
    type: "success",
    visible: false,
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) return

      try {
        // Get user document from Firestore
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userDocRef)

        // Initialize profile with data from auth
        const initialProfile: UserProfile = {
          firstName: "",
          lastName: "",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || "",
          bio: "",
          photoURL: currentUser.photoURL || "",
          location: "",
          occupation: "",
          birthday: "",
          website: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          github: "",
        }

        // If user document exists, use that data
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: currentUser.email || "",
            phoneNumber: userData.phoneNumber || "",
            bio: userData.bio || "",
            photoURL: currentUser.photoURL || userData.photoURL || "",
            location: userData.location || "",
            occupation: userData.occupation || "",
            birthday: userData.birthday || "",
            website: userData.website || "",
            twitter: userData.twitter || "",
            instagram: userData.instagram || "",
            linkedin: userData.linkedin || "",
            github: userData.github || "",
          })
        } else {
          // If no document exists yet, use data from auth
          setProfileData(initialProfile)
          // Create a new user document
          await setDoc(userDocRef, {
            ...initialProfile,
            createdAt: new Date(),
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        showNotification("Profil verileri yüklenemedi", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      message,
      type,
      visible: true,
    })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("No user logged in")

      let photoURL = profileData.photoURL

      // Upload image if a new one is selected
      if (image) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`)
        await uploadBytes(storageRef, image)
        photoURL = await getDownloadURL(storageRef)

        // Update auth profile
        await updateProfile(currentUser, {
          photoURL: photoURL,
        })
      }

      // Update firestore document
      const userDocRef = doc(db, "users", currentUser.uid)
      await updateDoc(userDocRef, {
        ...profileData,
        photoURL: photoURL,
        updatedAt: new Date(),
      })

      // Update local state
      setProfileData((prev) => ({ ...prev, photoURL }))
      setImage(null)

      // Success notification
      showNotification("Profil başarıyla güncellendi!", "success")
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification("Profil güncellenemedi. Lütfen tekrar deneyin.", "error")
    } finally {
      setSaving(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getInitials = () => {
    const first = profileData.firstName ? profileData.firstName.charAt(0).toUpperCase() : ""
    const last = profileData.lastName ? profileData.lastName.charAt(0).toUpperCase() : ""
    return first + last || "?"
  }

  const getFullName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`
    } else if (profileData.firstName) {
      return profileData.firstName
    } else if (profileData.lastName) {
      return profileData.lastName
    } else {
      return "Anonim Kullanıcı"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin"></div>
          <p className="text-slate-600 font-medium">Profil yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 ${
          notification.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        } ${
          notification.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-rose-50 border border-rose-200 text-rose-800"
        }`}
      >
        {notification.type === "success" ? (
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
        )}
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={() => setNotification((prev) => ({ ...prev, visible: false }))}
          className="ml-auto text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-24 relative">
                  <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                        {previewUrl || profileData.photoURL ? (
                          <img
                            src={previewUrl || profileData.photoURL}
                            alt="Profil"
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 rounded-full">
                            <span className="text-2xl font-bold text-violet-500">{getInitials()}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-0 right-0 bg-violet-500 text-white p-1.5 rounded-full shadow-md hover:bg-violet-600 transition-all"
                          aria-label="Profil fotoğrafını değiştir"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-14 pb-6 px-6 text-center">
                  <h2 className="text-xl font-bold text-slate-900">{getFullName()}</h2>
                  {profileData.occupation && (
                    <p className="text-slate-600 mt-1 flex items-center justify-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{profileData.occupation}</span>
                    </p>
                  )}
                  {profileData.location && (
                    <p className="text-slate-600 mt-1 flex items-center justify-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{profileData.location}</span>
                    </p>
                  )}
                  {profileData.bio && <p className="mt-4 text-slate-700 text-sm">{profileData.bio}</p>}

                  {/* Social links */}
                  <div className="flex justify-center gap-3 mt-5">
                    {profileData.twitter && (
                      <a
                        href={`https://twitter.com/${profileData.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-violet-500 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profileData.instagram && (
                      <a
                        href={`https://instagram.com/${profileData.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-violet-500 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {profileData.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${profileData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-violet-500 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {profileData.github && (
                      <a
                        href={`https://github.com/${profileData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-violet-500 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {profileData.website && (
                      <a
                        href={
                          profileData.website.startsWith("http")
                            ? profileData.website
                            : `https://${profileData.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-violet-500 transition-colors"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <nav className="p-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${
                      activeTab === "profile" ? "bg-violet-50 text-violet-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profil Bilgileri</span>
                  </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-200">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-rose-600 hover:bg-rose-50">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSave}>
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-900">Kişisel Bilgiler</h2>
                      <Edit2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Ad
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={profileData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            placeholder="Adınızı girin"
                          />
                        </div>

                        {/* Last Name */}
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Soyad
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={profileData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            placeholder="Soyadınızı girin"
                          />
                        </div>

                        {/* Occupation */}
                        <div>
                          <label htmlFor="occupation" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Meslek
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Briefcase className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              name="occupation"
                              id="occupation"
                              value={profileData.occupation || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="Ne iş yapıyorsunuz?"
                            />
                          </div>
                        </div>

                        {/* Birthday */}
                        <div>
                          <label htmlFor="birthday" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Doğum Tarihi
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Calendar className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="date"
                              name="birthday"
                              id="birthday"
                              value={profileData.birthday || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Konum
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <MapPin className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              value={profileData.location}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="Şehir, Ülke"
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Telefon Numarası
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="tel"
                              name="phoneNumber"
                              id="phoneNumber"
                              value={profileData.phoneNumber}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="Telefon numaranızı girin"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mt-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Hakkımda
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={4}
                          value={profileData.bio}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                          placeholder="Kendiniz hakkında biraz bilgi verin..."
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                          Biyografiniz herkese açık profilinizde görüntülenecektir
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Profiles */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-900">Sosyal Medya Profilleri</h2>
                      <Edit2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Website */}
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Web Sitesi
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="url"
                              name="website"
                              id="website"
                              value={profileData.website || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="https://websitesi.com"
                            />
                          </div>
                        </div>

                        {/* Twitter */}
                        <div>
                          <label htmlFor="twitter" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Twitter
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Twitter className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              name="twitter"
                              id="twitter"
                              value={profileData.twitter || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="kullanıcıadı (@ olmadan)"
                            />
                          </div>
                        </div>

                        {/* Instagram */}
                        <div>
                          <label htmlFor="instagram" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Instagram
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Instagram className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              name="instagram"
                              id="instagram"
                              value={profileData.instagram || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="kullanıcıadı (@ olmadan)"
                            />
                          </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                          <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-1.5">
                            LinkedIn
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Linkedin className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              name="linkedin"
                              id="linkedin"
                              value={profileData.linkedin || ""}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              placeholder="kullanıcıadı veya profil yolu"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-slate-900">Hesap Bilgileri</h2>
                      <Edit2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="p-6">
                      {/* Email - Read only */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                          E-posta Adresi
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={profileData.email}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-500"
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500">
                          E-posta değiştirilemez. Yardım için destek ekibiyle iletişime geçin.
                        </p>
                      </div>

                      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h3 className="text-sm font-medium text-amber-800">Hesap Doğrulama</h3>
                        <p className="mt-1 text-xs text-amber-700">
                          Hesabınız doğrulanmamış. Lütfen doğrulama talimatları için e-postanızı kontrol edin veya yeni
                          bir doğrulama e-postası isteyin.
                        </p>
                        <button
                          type="button"
                          className="mt-3 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-medium rounded-lg transition-colors"
                        >
                          Doğrulama E-postasını Tekrar Gönder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-violet-600 rounded-lg text-white font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors disabled:opacity-70 flex items-center"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Değişiklikler Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
