"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  Users,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Database,
  X,
} from "lucide-react";

interface StudentUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  bio?: string;
  birthday?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  location?: string;
  occupation?: string;
  phoneNumber?: string;
  photoURL?: string;
  website?: string;
  // Therapy application fields
  birthDate?: string;
  gender?: string;
  profession?: string;
  city?: string;
  district?: string;
  stutteringStartAge?: string;
  howStutteringStarted?: string;
  familyHistory?: string;
  emotionsDuringStuttering?: string;
  previousTherapy?: string;
  therapyType?: string;
  therapyDuration?: string;
  therapyBenefit?: string;
  learnedMethods?: string;
  therapyExpectations?: string;
  howHeardAbout?: string;
  registrationCompleted?: boolean;
}

interface AlertState {
  show: boolean;
  type: "success" | "error";
  message: string;
}

export default function OgrenciProfiliPage() {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [adminCheck, setAdminCheck] = useState<{
    isAdmin: boolean;
    loading: boolean;
    error: string | null;
  }>({
    isAdmin: false,
    loading: true,
    error: null,
  });
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Giriş yapmanız gerekiyor",
        });
        return;
      }

      try {
        // Check if user is admin
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "Kullanıcı profili bulunamadı",
          });
          return;
        }

        const userData = userDoc.data();
        if (userData.role !== "admin") {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: "Bu sayfaya erişim için admin yetkisi gerekiyor",
          });
          return;
        }

        setAdminCheck({
          isAdmin: true,
          loading: false,
          error: null,
        });

        await fetchStudents();
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Yetki kontrolü sırasında hata oluştu",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.firstName || ""} ${student.lastName || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const studentsList: StudentUser[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Filter for users with role "user" or "nouser" in JavaScript
        if (userData.role === "user" || userData.role === "nouser") {
          studentsList.push({
            id: doc.id,
            ...userData,
          } as StudentUser);
        }
      });

      // Sort by createdAt descending (newest first)
      studentsList.sort((a, b) => {
        const dateA =
          a.createdAt instanceof Date
            ? a.createdAt
            : a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(0);
        const dateB =
          b.createdAt instanceof Date
            ? b.createdAt
            : b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setStudents(studentsList);
      setLoading(false);
    } catch {
      setAlert({
        show: true,
        type: "error",
        message: "Öğrenci bilgileri yüklenirken hata oluştu",
      });
      setLoading(false);
    }
  };

  const formatDate = (date: Timestamp | Date | string | undefined) => {
    if (!date) return "Belirtilmemiş";

    try {
      const dateObj =
        typeof date === "string"
          ? new Date(date)
          : date instanceof Timestamp
            ? date.toDate()
            : date;
      return dateObj.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Geçersiz tarih";
    }
  };

  const formatAge = (birthday: string | undefined) => {
    if (!birthday) return "Belirtilmemiş";

    try {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return `${age} yaşında`;
    } catch {
      return "Geçersiz yaş";
    }
  };

  if (adminCheck.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          <p className="text-slate-600 font-medium">
            Yetki kontrolü yapılıyor...
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
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Erişim Reddedildi
          </h1>
          <p className="text-slate-600 mb-6">
            {adminCheck.error || "Bu sayfaya erişim yetkiniz bulunmuyor."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          <p className="text-slate-600 font-medium">
            Öğrenci profilleri yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-3 md:p-6">
      {alert.show && (
        <div
          className={`fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-50 flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span className="font-medium text-xs sm:text-sm md:text-base">
            {alert.message}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-teal-600" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Öğrenci Profilleri
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            Tüm öğrenci profillerini görüntüleyin ve yönetin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Toplam Öğrenci
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Aktif Öğrenci
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {students.filter((s) => s.role === "user").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="p-1.5 sm:p-2 md:p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Bu Ay Katılan
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {
                    students.filter((s) => {
                      if (!s.createdAt) return false;
                      const created =
                        s.createdAt instanceof Date
                          ? s.createdAt
                          : s.createdAt instanceof Timestamp
                            ? s.createdAt.toDate()
                            : new Date(s.createdAt);
                      const now = new Date();
                      return (
                        created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-teal-600" />
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900">
                Öğrenci Ara
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="İsim, email, meslek veya konum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {filteredStudents
            .slice(
              (currentPage - 1) * studentsPerPage,
              currentPage * studentsPerPage
            )
            .map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header with Photo */}
                <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-teal-500 to-emerald-600">
                  {student.photoURL ? (
                    <img
                      src={student.photoURL}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      <span className="hidden sm:inline">Öğrenci</span>
                      <span className="sm:hidden">Öğr</span>
                    </span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="mb-3 sm:mb-4">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowModal(true);
                      }}
                      className="text-left hover:opacity-80 transition-opacity cursor-pointer w-full"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 hover:text-teal-600 transition-colors">
                        {student.firstName && student.lastName
                          ? `${student.firstName} ${student.lastName}`
                          : student.firstName || student.username || "İsimsiz"}
                      </h3>
                      {student.username && (
                        <p className="text-xs sm:text-sm text-slate-600 font-mono">
                          @{student.username}
                        </p>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-slate-700 italic">
                        &ldquo;{student.bio}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    {student.occupation && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        <span className="truncate">{student.occupation}</span>
                      </div>
                    )}
                    {student.location && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        <span className="truncate">{student.location}</span>
                      </div>
                    )}
                    {student.birthday && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        <span>{formatAge(student.birthday)}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    {student.email && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                    {student.phoneNumber && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                        <span>{student.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {(student.github ||
                    student.instagram ||
                    student.linkedin ||
                    student.twitter ||
                    student.website) && (
                    <div className="border-t border-slate-200 pt-3 sm:pt-4">
                      <p className="text-xs font-medium text-slate-500 mb-2">
                        Sosyal Medya
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {student.github && (
                          <a
                            href={
                              student.github.startsWith("http")
                                ? student.github
                                : `https://github.com/${student.github}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs hover:bg-slate-200 transition-colors"
                          >
                            <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="hidden sm:inline">GitHub</span>
                            <span className="sm:hidden">GH</span>
                          </a>
                        )}
                        {student.instagram && (
                          <a
                            href={
                              student.instagram.startsWith("http")
                                ? student.instagram
                                : `https://instagram.com/${student.instagram}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs hover:bg-pink-200 transition-colors"
                          >
                            <Instagram className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="hidden sm:inline">Instagram</span>
                            <span className="sm:hidden">IG</span>
                          </a>
                        )}
                        {student.linkedin && (
                          <a
                            href={
                              student.linkedin.startsWith("http")
                                ? student.linkedin
                                : `https://linkedin.com/in/${student.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="hidden sm:inline">LinkedIn</span>
                            <span className="sm:hidden">LI</span>
                          </a>
                        )}
                        {student.twitter && (
                          <a
                            href={
                              student.twitter.startsWith("http")
                                ? student.twitter
                                : `https://twitter.com/${student.twitter}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs hover:bg-sky-200 transition-colors"
                          >
                            <Twitter className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="hidden sm:inline">Twitter</span>
                            <span className="sm:hidden">TW</span>
                          </a>
                        )}
                        {student.website && (
                          <a
                            href={student.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs hover:bg-teal-200 transition-colors"
                          >
                            <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="hidden sm:inline">Website</span>
                            <span className="sm:hidden">Web</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Database Info */}
                  <div className="border-t border-slate-200 pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Katılım:</span>
                      <span className="text-right">
                        {formatDate(student.createdAt)}
                      </span>
                    </div>
                    {student.updatedAt && (
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Son Güncelleme:</span>
                        <span className="text-right">
                          {formatDate(student.updatedAt)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Kullanıcı ID:</span>
                      <span className="font-mono text-xs text-right truncate ml-2">
                        {student.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              {searchTerm
                ? "Arama kriterlerinize uygun öğrenci bulunamadı"
                : "Henüz öğrenci profili bulunmuyor"}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredStudents.length > studentsPerPage && (
          <div className="flex items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white rounded-lg shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto">
              <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                {(currentPage - 1) * studentsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * studentsPerPage,
                  filteredStudents.length
                )}{" "}
                / {filteredStudents.length} öğrenci gösteriliyor
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Önceki</span>
                  <span className="sm:hidden">Önce</span>
                </button>
                <span className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700">
                  {currentPage} /{" "}
                  {Math.ceil(filteredStudents.length / studentsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage >=
                    Math.ceil(filteredStudents.length / studentsPerPage)
                  }
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Sonraki</span>
                  <span className="sm:hidden">Sonra</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-slate-200">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    {selectedStudent.photoURL ? (
                      <img
                        src={selectedStudent.photoURL}
                        alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                      {selectedStudent.firstName && selectedStudent.lastName
                        ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                        : selectedStudent.firstName ||
                          selectedStudent.username ||
                          "İsimsiz"}
                    </h2>
                    {selectedStudent.username && (
                      <p className="text-xs sm:text-sm text-slate-600 font-mono">
                        @{selectedStudent.username}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedStudent(null);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {/* Left Column - Personal Info */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Kişisel Bilgiler
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-600">
                              Email
                            </p>
                            <p className="text-xs sm:text-sm text-slate-900 break-all">
                              {selectedStudent.email}
                            </p>
                          </div>
                        </div>
                        {selectedStudent.phoneNumber && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-slate-600">
                                Telefon
                              </p>
                              <p className="text-xs sm:text-sm text-slate-900">
                                {selectedStudent.phoneNumber}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedStudent.birthday && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-slate-600">
                                Doğum Tarihi
                              </p>
                              <p className="text-xs sm:text-sm text-slate-900">
                                {selectedStudent.birthday} (
                                {formatAge(selectedStudent.birthday)})
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedStudent.location && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-slate-600">
                                Konum
                              </p>
                              <p className="text-xs sm:text-sm text-slate-900">
                                {selectedStudent.location}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedStudent.occupation && (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-slate-600">
                                Meslek
                              </p>
                              <p className="text-xs sm:text-sm text-slate-900">
                                {selectedStudent.occupation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Therapy Application Information */}
                    {(selectedStudent.stutteringStartAge ||
                      selectedStudent.howStutteringStarted ||
                      selectedStudent.familyHistory ||
                      selectedStudent.emotionsDuringStuttering ||
                      selectedStudent.previousTherapy ||
                      selectedStudent.therapyDuration ||
                      selectedStudent.therapyBenefit ||
                      selectedStudent.learnedMethods ||
                      selectedStudent.therapyExpectations ||
                      selectedStudent.howHeardAbout) && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                          Terapi Başvuru Bilgileri
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {selectedStudent.stutteringStartAge && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Kekemelik Başlangıç Yaşı
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.stutteringStartAge} yaş
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.howStutteringStarted && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Kekemelik Nasıl Başladı
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.howStutteringStarted}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.familyHistory && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Aile Geçmişi
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.familyHistory}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.emotionsDuringStuttering && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Kekemelik Sırasında Duygular
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.emotionsDuringStuttering}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.previousTherapy && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Önceki Terapi
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.previousTherapy}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.therapyDuration && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Terapi Süresi
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.therapyDuration}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.therapyBenefit && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Terapiden Fayda
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.therapyBenefit}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.learnedMethods && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Öğrenilen Yöntemler
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.learnedMethods}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.therapyExpectations && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Terapi Hedefleri
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.therapyExpectations}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedStudent.howHeardAbout && (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                  Nasıl Duydunuz
                                </p>
                                <p className="text-xs sm:text-sm text-slate-900">
                                  {selectedStudent.howHeardAbout}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedStudent.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                          Hakkında
                        </h3>
                        <p className="text-slate-700 italic bg-slate-50 p-3 rounded-lg">
                          &ldquo;{selectedStudent.bio}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Social Media & System Info */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Social Media */}
                    {(selectedStudent.github ||
                      selectedStudent.instagram ||
                      selectedStudent.linkedin ||
                      selectedStudent.twitter ||
                      selectedStudent.website) && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
                          Sosyal Medya
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {selectedStudent.github && (
                            <div className="flex items-center gap-3">
                              <Github className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600">
                                  GitHub
                                </p>
                                <a
                                  href={
                                    selectedStudent.github.startsWith("http")
                                      ? selectedStudent.github
                                      : `https://github.com/${selectedStudent.github}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-700 text-sm"
                                >
                                  {selectedStudent.github}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedStudent.instagram && (
                            <div className="flex items-center gap-3">
                              <Instagram className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600">
                                  Instagram
                                </p>
                                <a
                                  href={
                                    selectedStudent.instagram.startsWith("http")
                                      ? selectedStudent.instagram
                                      : `https://instagram.com/${selectedStudent.instagram}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-700 text-sm"
                                >
                                  {selectedStudent.instagram}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedStudent.linkedin && (
                            <div className="flex items-center gap-3">
                              <Linkedin className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600">
                                  LinkedIn
                                </p>
                                <a
                                  href={
                                    selectedStudent.linkedin.startsWith("http")
                                      ? selectedStudent.linkedin
                                      : `https://linkedin.com/in/${selectedStudent.linkedin}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-700 text-sm"
                                >
                                  {selectedStudent.linkedin}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedStudent.twitter && (
                            <div className="flex items-center gap-3">
                              <Twitter className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600">
                                  Twitter
                                </p>
                                <a
                                  href={
                                    selectedStudent.twitter.startsWith("http")
                                      ? selectedStudent.twitter
                                      : `https://twitter.com/${selectedStudent.twitter}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-700 text-sm"
                                >
                                  {selectedStudent.twitter}
                                </a>
                              </div>
                            </div>
                          )}
                          {selectedStudent.website && (
                            <div className="flex items-center gap-3">
                              <ExternalLink className="h-4 w-4 text-slate-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600">
                                  Website
                                </p>
                                <a
                                  href={selectedStudent.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-700 text-sm break-all"
                                >
                                  {selectedStudent.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* System Information */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                        Sistem Bilgileri
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Kullanıcı ID
                          </p>
                          <p className="font-mono text-sm text-slate-800 bg-slate-100 p-2 rounded">
                            {selectedStudent.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Rol
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <User className="h-3 w-3 mr-1" />
                            {selectedStudent.role || "Kullanıcı"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Katılım Tarihi
                          </p>
                          <p className="text-slate-900">
                            {formatDate(selectedStudent.createdAt)}
                          </p>
                        </div>
                        {selectedStudent.updatedAt && (
                          <div>
                            <p className="text-sm font-medium text-slate-600">
                              Son Güncelleme
                            </p>
                            <p className="text-slate-900">
                              {formatDate(selectedStudent.updatedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Complete Database Data */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                        Tüm Veritabanı Verileri
                      </h3>
                      <div className="bg-slate-50 rounded-lg p-2 sm:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              ID
                            </p>
                            <p className="font-mono text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.id}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              E-posta
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.email || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Kullanıcı Adı
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.username || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Ad
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.firstName || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Soyad
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.lastName || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Rol
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.role || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Hakkında
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.bio || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Doğum Tarihi
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.birthday || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Konum
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.location || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Meslek
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.occupation || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Telefon
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.phoneNumber || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Fotoğraf URL
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border break-all text-xs">
                              {selectedStudent.photoURL || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Web Sitesi
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border break-all text-xs">
                              {selectedStudent.website || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              GitHub
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.github || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Instagram
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.instagram || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              LinkedIn
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.linkedin || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Twitter
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {selectedStudent.twitter || "Belirtilmemiş"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Oluşturulma Tarihi
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {formatDate(selectedStudent.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600 mb-1">
                              Güncellenme Tarihi
                            </p>
                            <p className="text-slate-800 bg-white p-2 rounded border">
                              {formatDate(selectedStudent.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
