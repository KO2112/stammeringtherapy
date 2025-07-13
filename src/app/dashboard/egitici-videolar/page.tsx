"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { auth, db, storage } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Link as LinkIcon,
  ChevronRight,
  Check,
  Video as VideoIcon,
  Clock,
  User,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: "youtube" | "upload";
  createdAt: Date;
  authorId: string;
  authorName: string;
  duration?: string;
  thumbnail?: string;
}

interface User {
  uid: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface AdminCheckState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export default function EgiticiVideolarPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [adminCheck, setAdminCheck] = useState<AdminCheckState>({
    isAdmin: false,
    loading: true,
    error: null,
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoType: "youtube" as "youtube" | "upload",
    videoFile: null as File | null,
  });

  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const VIDEOS_PER_PAGE = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "You must be logged in to access this page",
        });
        setCurrentUser(null);
        await fetchVideos();
        return;
      }

      try {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        if (!currentUserDoc.exists()) {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: null,
          });
          setCurrentUser(null);
          await fetchVideos();
          return;
        }

        const currentUserData = currentUserDoc.data();
        setCurrentUser({ uid: user.uid, ...currentUserData } as User);

        if (currentUserData.role === "admin") {
          setAdminCheck({
            isAdmin: true,
            loading: false,
            error: null,
          });
        } else {
          setAdminCheck({
            isAdmin: false,
            loading: false,
            error: null,
          });
        }

        await fetchVideos();
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminCheck({
          isAdmin: false,
          loading: false,
          error: "Failed to verify permissions",
        });
        setCurrentUser(null);
        await fetchVideos();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosRef = collection(db, "videos");
      const q = query(
        videosRef,
        orderBy("createdAt", "desc"),
        limit(VIDEOS_PER_PAGE)
      );

      const querySnapshot = await getDocs(q);
      const videosData: Video[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        videosData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Video);
      });

      setVideos(videosData);
      setHasMore(querySnapshot.docs.length === VIDEOS_PER_PAGE);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const generateVideoThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        video.onloadedmetadata = () => {
          // Seek to 1 second to avoid black frame at 0:00
          video.currentTime = 1;
        };

        video.onseeked = () => {
          try {
            if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
              resolve(thumbnailUrl);
            } else {
              resolve("/video-placeholder.jpg");
            }
          } catch (error) {
            console.error("Error generating thumbnail:", error);
            resolve("/video-placeholder.jpg");
          }
        };

        video.onerror = () => {
          resolve("/video-placeholder.jpg");
        };

        video.src = URL.createObjectURL(videoFile);
      } catch (error) {
        console.error("Error setting up thumbnail generation:", error);
        resolve("/video-placeholder.jpg");
      }
    });
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setActionLoading("add-video");
    try {
      let finalVideoUrl = newVideo.videoUrl;
      let thumbnail = "";

      if (newVideo.videoType === "upload" && newVideo.videoFile) {
        // Upload video file to Firebase Storage
        const videoRef = ref(
          storage,
          `videos/${Date.now()}_${newVideo.videoFile.name}`
        );
        const uploadResult = await uploadBytes(videoRef, newVideo.videoFile);
        finalVideoUrl = await getDownloadURL(uploadResult.ref);

        // Generate thumbnail from video
        try {
          thumbnail = await generateVideoThumbnail(newVideo.videoFile);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          thumbnail = "/video-placeholder.jpg";
        }
      } else if (newVideo.videoType === "youtube") {
        // Get YouTube thumbnail
        thumbnail =
          getYouTubeThumbnail(newVideo.videoUrl) || "/video-placeholder.jpg";
      }

      const videoData = {
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: finalVideoUrl,
        videoType: newVideo.videoType,
        thumbnail,
        createdAt: serverTimestamp(),
        authorId: currentUser.uid,
        authorName:
          `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
          currentUser.email?.split("@")[0] ||
          "Admin",
      };

      await addDoc(collection(db, "videos"), videoData);

      // Reset form and refresh videos
      setNewVideo({
        title: "",
        description: "",
        videoUrl: "",
        videoType: "youtube",
        videoFile: null,
      });
      setShowAddForm(false);
      await fetchVideos();
    } catch (error) {
      console.error("Error adding video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    setActionLoading("edit-video");
    try {
      let finalVideoUrl = newVideo.videoUrl;
      let thumbnail = editingVideo.thumbnail;

      if (newVideo.videoType === "upload" && newVideo.videoFile) {
        // Upload new video file
        const videoRef = ref(
          storage,
          `videos/${Date.now()}_${newVideo.videoFile.name}`
        );
        const uploadResult = await uploadBytes(videoRef, newVideo.videoFile);
        finalVideoUrl = await getDownloadURL(uploadResult.ref);

        // Generate thumbnail from video
        try {
          thumbnail = await generateVideoThumbnail(newVideo.videoFile);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          thumbnail = "/video-placeholder.jpg";
        }
      } else if (newVideo.videoType === "youtube") {
        thumbnail =
          getYouTubeThumbnail(newVideo.videoUrl) || "/video-placeholder.jpg";
      }

      const videoRef = doc(db, "videos", editingVideo.id);
      await updateDoc(videoRef, {
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: finalVideoUrl,
        videoType: newVideo.videoType,
        thumbnail,
      });

      setEditingVideo(null);
      setNewVideo({
        title: "",
        description: "",
        videoUrl: "",
        videoType: "youtube",
        videoFile: null,
      });
      await fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteVideo = async (
    videoId: string,
    videoUrl: string,
    videoType: string
  ) => {
    if (!confirm("Bu videoyu silmek istediğinizden emin misiniz?")) return;

    setActionLoading(`delete-${videoId}`);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "videos", videoId));

      // Delete from Storage if it's an uploaded video
      if (videoType === "upload" && videoUrl.includes("firebase")) {
        const videoRef = ref(storage, videoUrl);
        await deleteObject(videoRef);
      }

      await fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const openEditForm = (video: Video) => {
    setEditingVideo(video);
    setNewVideo({
      title: video.title || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      videoType: video.videoType || "youtube",
      videoFile: null,
    });
  };

  const handleVideoTypeChange = (newType: "youtube" | "upload") => {
    setNewVideo((prev) => ({
      ...prev,
      videoType: newType,
      videoUrl: "", // Always reset videoUrl when switching types
      videoFile: null, // Always reset videoFile when switching types
    }));
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingVideo(null);
    setNewVideo({
      title: "",
      description: "",
      videoUrl: "",
      videoType: "youtube",
      videoFile: null,
    });
  };

  const loadMoreVideos = async () => {
    if (loading || !hasMore || !lastDoc) return;

    try {
      setLoading(true);
      const videosRef = collection(db, "videos");
      const q = query(
        videosRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(VIDEOS_PER_PAGE)
      );

      const querySnapshot = await getDocs(q);
      const videosData: Video[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        videosData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Video);
      });

      setVideos((prev) => [...prev, ...videosData]);
      setHasMore(querySnapshot.docs.length === VIDEOS_PER_PAGE);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error loading more videos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Videolar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Eğitici Videolar
              </h1>
              <p className="text-slate-600">
                Kekemelik terapisi için eğitici video içerikleri
              </p>
            </div>
            {adminCheck.isAdmin && (
              <button
                onClick={() => {
                  if (showAddForm) {
                    closeForm();
                  } else {
                    setShowAddForm(true);
                    setEditingVideo(null);
                    setNewVideo({
                      title: "",
                      description: "",
                      videoUrl: "",
                      videoType: "youtube",
                      videoFile: null,
                    });
                  }
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors"
              >
                <Plus className="h-5 w-5" />
                Video Ekle
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Video Form - Inline like haberler page */}
        {(showAddForm || editingVideo) && adminCheck.isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingVideo ? "Video Düzenle" : "Yeni Video Ekle"}
              </h2>
            </div>

            <div className="p-6">
              <form
                key={`${newVideo.videoType}-${editingVideo?.id || "new"}`}
                onSubmit={editingVideo ? handleEditVideo : handleAddVideo}
                className="space-y-6"
              >
                {/* Video Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Video Türü
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="youtube"
                        checked={newVideo.videoType === "youtube"}
                        onChange={() => handleVideoTypeChange("youtube")}
                        className="mr-2"
                      />
                      <LinkIcon className="h-4 w-4 mr-1" />
                      YouTube Linki
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="upload"
                        checked={newVideo.videoType === "upload"}
                        onChange={() => handleVideoTypeChange("upload")}
                        className="mr-2"
                      />
                      <Upload className="h-4 w-4 mr-1" />
                      Video Yükle
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Video Başlığı *
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Video başlığını girin"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Video açıklamasını girin"
                    required
                  />
                </div>

                {/* Video URL or File Upload */}
                {newVideo.videoType === "youtube" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      YouTube Video Linki *
                    </label>
                    <input
                      type="url"
                      value={newVideo.videoUrl}
                      onChange={(e) =>
                        setNewVideo((prev) => ({
                          ...prev,
                          videoUrl: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      YouTube video linkini yapıştırın
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Video Dosyası *
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setNewVideo((prev) => ({
                          ...prev,
                          videoFile: e.target.files?.[0] || null,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      MP4, AVI, MOV formatlarında video dosyası yükleyin (max
                      100MB)
                      {editingVideo &&
                        " - Yeni video dosyası seçmezseniz mevcut video korunacaktır"}
                    </p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={
                      actionLoading ===
                      (editingVideo ? "edit-video" : "add-video")
                    }
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ===
                    (editingVideo ? "edit-video" : "add-video") ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {editingVideo ? "Güncelle" : "Ekle"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <VideoIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Henüz video yok
            </h3>
            <p className="text-slate-600">
              İlk eğitici video henüz eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Video Display */}
                <div className="relative aspect-video bg-slate-100">
                  {video.videoType === "youtube" ? (
                    <iframe
                      src={getYouTubeEmbedUrl(video.videoUrl) || ""}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full object-contain bg-black cursor-pointer"
                      poster={video.thumbnail || "/video-placeholder.jpg"}
                      preload="metadata"
                      onClick={() =>
                        setExpandedVideo(
                          expandedVideo === video.id ? null : video.id
                        )
                      }
                    />
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{video.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.createdAt.toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {adminCheck.isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(video)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading === `delete-${video.id}`}
                      >
                        <Edit className="h-4 w-4" />
                        Düzenle
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteVideo(
                            video.id,
                            video.videoUrl,
                            video.videoType
                          )
                        }
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading === `delete-${video.id}`}
                      >
                        {actionLoading === `delete-${video.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && videos.length > 0 && (
          <div className="text-center">
            <button
              onClick={loadMoreVideos}
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl border border-slate-200 font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-slate-600"></div>
                  Yükleniyor...
                </>
              ) : (
                <>
                  Daha Fazla Video
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Expanded Video Modal */}
        {expandedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setExpandedVideo(null)}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
              >
                ✕
              </button>
              {(() => {
                const video = videos.find((v) => v.id === expandedVideo);
                if (!video) return null;

                return (
                  <div className="bg-black rounded-lg overflow-hidden">
                    {video.videoType === "youtube" ? (
                      <iframe
                        src={getYouTubeEmbedUrl(video.videoUrl) || ""}
                        title={video.title}
                        className="w-full aspect-video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={video.videoUrl}
                        controls
                        className="w-full h-auto max-h-[80vh] object-contain"
                        poster={video.thumbnail || "/video-placeholder.jpg"}
                        autoPlay
                      />
                    )}
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold mb-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {video.description}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
