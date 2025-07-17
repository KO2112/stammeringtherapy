"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Timestamp } from "firebase/firestore";
import { FileText, FileVideo, File } from "lucide-react";

interface Dokuman {
  id: string;
  title: string;
  files: DokumanFile[];
  createdAt?: Timestamp | Date;
  addedBy?: string;
}

interface WordEntry {
  id?: string;
  word: string;
  kirmiziAlan: string;
  stammered: string;
}

// 1. Add Turkish alphabet and new tab
const TURKISH_ALPHABET = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const TABS = [
  {
    key: "uzatarak",
    label: "Uzatarak Kolay Kekemelik",
    description: "Kelime başındaki harfi uzatarak kekemelik",
  },
  {
    key: "tekrarlayarak",
    label: "Tekrarlayarak Kolay Kekemelik",
    description: "Kelime başındaki harfleri tekrarlayarak kekemelik",
  },
  {
    key: "dokumanlar",
    label: "Videolar ve Dokumanlar",
    description: "Video, PDF, Word ve diğer dokümanlar",
  },
];

interface DokumanFile {
  name: string;
  url: string;
  type: string;
}

// Helper to get icon by file type
function getFileIcon(type: string) {
  if (type.startsWith("video/"))
    return <FileVideo className="w-5 h-5 text-blue-500" />;
  if (type === "application/pdf")
    return <File className="w-5 h-5 text-red-500" />;
  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <File className="w-5 h-5 text-blue-700" />;
  if (type.startsWith("text/"))
    return <FileText className="w-5 h-5 text-slate-500" />;
  return <File className="w-5 h-5 text-slate-400" />;
}

export default function KolayKekemelikPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState("uzatarak");
  const [uzatarakWords, setUzatarakWords] = useState<WordEntry[]>([]);
  const [tekrarlayarakWords, setTekrarlayarakWords] = useState<WordEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: "",
    kirmiziAlan: "",
    stammered: "",
  });
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    word: "",
    kirmiziAlan: "",
    stammered: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [dokumanlar, setDokumanlar] = useState<Dokuman[]>([]);
  const [dokumanUploadFiles, setDokumanUploadFiles] = useState<File[]>([]);
  const [dokumanUploadLoading, setDokumanUploadLoading] = useState(false);
  const [dokumanUploadTitle, setDokumanUploadTitle] = useState("");
  const [showDokumanUploadForm, setShowDokumanUploadForm] = useState(false);

  const isAdmin = userRole === "admin";
  const allWords =
    activeTab === "uzatarak" ? uzatarakWords : tekrarlayarakWords;

  // 3. Filter words by selected letter
  const filteredWords = selectedLetter
    ? allWords.filter(
        (w) =>
          w.word && w.word[0]?.toLocaleUpperCase("tr-TR") === selectedLetter
      )
    : [];

  // Load words from Firestore
  const loadWords = async () => {
    try {
      const uzatarakQuery = query(collection(db, "uzatarak_words"));
      const tekrarlayarakQuery = query(collection(db, "tekrarlayarak_words"));

      const [uzatarakSnapshot, tekrarlayarakSnapshot] = await Promise.all([
        getDocs(uzatarakQuery),
        getDocs(tekrarlayarakQuery),
      ]);

      const uzatarakData = uzatarakSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WordEntry[];

      const tekrarlayarakData = tekrarlayarakSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WordEntry[];

      setUzatarakWords(uzatarakData);
      setTekrarlayarakWords(tekrarlayarakData);
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Load dokumanlar from Firestore for the third tab
  const loadDokumanlar = async () => {
    try {
      const dokumanlarQuery = query(collection(db, "dokumanlar"));
      const snapshot = await getDocs(dokumanlarQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dokuman[];
      setDokumanlar(data);
    } catch (error) {
      console.error("Error loading dokumanlar:", error);
    }
  };

  // Delete a single file from a dokuman
  const handleDeleteFileFromDokuman = async (
    doc: Dokuman,
    fileToDelete: DokumanFile
  ) => {
    if (!isAdmin) return;
    if (
      !confirm(
        `Bu dosyayı silmek istediğinizden emin misiniz? (${fileToDelete.name})`
      )
    )
      return;
    try {
      // Delete file from storage
      try {
        const { storage } = await import("../../../../firebase");
        const { ref, deleteObject } = await import("firebase/storage");
        const fileRef = ref(
          storage,
          fileToDelete.url
            .replace(/^https?:\/\/[^/]+\/o\//, "")
            .replace(/\?.*$/, "")
            .replace(/%2F/g, "/")
        );
        await deleteObject(fileRef);
      } catch {}
      // Remove file from Firestore document
      const remainingFiles = doc.files.filter(
        (f) => f.url !== fileToDelete.url
      );
      const {
        doc: docRef,
        updateDoc,
        deleteDoc,
      } = await import("firebase/firestore");
      if (remainingFiles.length === 0) {
        await deleteDoc(docRef(db, "dokumanlar", doc.id));
      } else {
        await updateDoc(docRef(db, "dokumanlar", doc.id), {
          files: remainingFiles,
        });
      }
      loadDokumanlar();
    } catch (error) {
      alert("Dosya silinemedi");
      console.error("Error deleting file from dokuman:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || "user";
            setUserRole(role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole("");
      }
    });

    loadWords();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === "dokumanlar") {
      loadDokumanlar();
    }
  }, [activeTab]);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word.trim() || !newWord.stammered.trim()) return;
    try {
      const collectionName =
        activeTab === "uzatarak" ? "uzatarak_words" : "tekrarlayarak_words";
      const docRef = await addDoc(collection(db, collectionName), {
        ...newWord,
        createdAt: serverTimestamp(),
        addedBy: user?.uid || "",
      });

      const newWordWithId = { ...newWord, id: docRef.id };

      if (activeTab === "uzatarak") {
        setUzatarakWords([...uzatarakWords, newWordWithId]);
      } else {
        setTekrarlayarakWords([...tekrarlayarakWords, newWordWithId]);
      }

      setNewWord({ word: "", kirmiziAlan: "", stammered: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleEditWord = (word: WordEntry) => {
    if (word.id) {
      setEditingWord(word.id);
      setEditForm({
        word: word.word,
        kirmiziAlan: word.kirmiziAlan,
        stammered: word.stammered,
      });
    }
  };

  const handleSaveEdit = async (wordId: string) => {
    try {
      const collectionName =
        activeTab === "uzatarak" ? "uzatarak_words" : "tekrarlayarak_words";
      await updateDoc(doc(db, collectionName, wordId), {
        word: editForm.word,
        kirmiziAlan: editForm.kirmiziAlan,
        stammered: editForm.stammered,
        updatedAt: serverTimestamp(),
      });

      const updatedWord = { id: wordId, ...editForm };

      if (activeTab === "uzatarak") {
        setUzatarakWords(
          uzatarakWords.map((w) => (w.id === wordId ? updatedWord : w))
        );
      } else {
        setTekrarlayarakWords(
          tekrarlayarakWords.map((w) => (w.id === wordId ? updatedWord : w))
        );
      }

      setEditingWord(null);
      setEditForm({ word: "", kirmiziAlan: "", stammered: "" });
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    if (!confirm("Bu kelimeyi silmek istediğinizden emin misiniz?")) return;

    try {
      const collectionName =
        activeTab === "uzatarak" ? "uzatarak_words" : "tekrarlayarak_words";
      await deleteDoc(doc(db, collectionName, wordId));

      if (activeTab === "uzatarak") {
        setUzatarakWords(uzatarakWords.filter((w) => w.id !== wordId));
      } else {
        setTekrarlayarakWords(
          tekrarlayarakWords.filter((w) => w.id !== wordId)
        );
      }
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  // 4. Handle dokuman upload
  const handleDokumanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDokumanUploadFiles(Array.from(e.target.files));
    }
  };

  const handleDokumanUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || dokumanUploadFiles.length === 0 || !dokumanUploadTitle)
      return;
    setDokumanUploadLoading(true);
    try {
      const uploadedUrls: DokumanFile[] = [];
      for (const file of dokumanUploadFiles) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(
          (await import("../../../../firebase")).storage,
          `dokumanlar/${fileName}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push({ name: file.name, url, type: file.type });
      }
      await addDoc(collection(db, "dokumanlar"), {
        title: dokumanUploadTitle,
        files: uploadedUrls,
        createdAt: serverTimestamp(),
        addedBy: user?.uid || "",
      });
      setDokumanUploadFiles([]);
      setDokumanUploadTitle("");
      loadDokumanlar();
    } catch (error) {
      console.error("Error uploading dokuman:", error);
    } finally {
      setDokumanUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-10 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kolay Kekemelik</h1>
            <p className="mt-2 text-teal-50 max-w-2xl">
              Kekemelikle başa çıkmak için iki temel kolaylaştırıcı teknik:
              Uzatarak ve Tekrarlayarak Kolay Kekemelik.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 sm:mx-8 flex flex-wrap gap-2 mb-6 sm:mb-8 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setShowAddForm(false);
              setEditingWord(null);
              setSelectedLetter(null);
            }}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="mx-4 sm:mx-8">
        {/* Section Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {TABS.find((tab) => tab.key === activeTab)?.label}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                {TABS.find((tab) => tab.key === activeTab)?.description}
              </p>
            </div>
            {isAdmin && activeTab !== "dokumanlar" && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="mt-4 sm:mt-0 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Kelime Ekle
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && isAdmin && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200">
              <form onSubmit={handleAddWord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kelime
                  </label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) =>
                      setNewWord({ ...newWord, word: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Örnek: Merhaba"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kırmızı Alan
                    </label>
                    <input
                      type="text"
                      value={newWord.kirmiziAlan}
                      onChange={(e) =>
                        setNewWord({ ...newWord, kirmiziAlan: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Örnek: Me"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kekemelik Versiyonu
                    </label>
                    <input
                      type="text"
                      value={newWord.stammered}
                      onChange={(e) =>
                        setNewWord({ ...newWord, stammered: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Örnek: MMMerhaba"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewWord({ word: "", kirmiziAlan: "", stammered: "" });
                    }}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Alphabet and Word List for First Two Tabs */}
          {activeTab !== "dokumanlar" && (
            <>
              <div className="mb-6 grid grid-cols-8 sm:grid-cols-14 gap-2">
                {TURKISH_ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`px-3 py-2 rounded-lg font-bold text-lg transition-all duration-150 ${
                      selectedLetter === letter
                        ? "bg-teal-600 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-teal-100"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              {selectedLetter && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-medium text-teal-700">
                    Seçili Harf:
                  </span>
                  <span className="font-bold text-lg">{selectedLetter}</span>
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="ml-2 px-2 py-1 text-xs bg-slate-200 rounded hover:bg-slate-300"
                  >
                    Temizle
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredWords.length > 0 ? (
                  filteredWords.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                    >
                      {editingWord === entry.id ? (
                        // Edit Form
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.word}
                            onChange={(e) =>
                              setEditForm({ ...editForm, word: e.target.value })
                            }
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                            placeholder="Kelime"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editForm.kirmiziAlan}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  kirmiziAlan: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                              placeholder="Kırmızı Alan"
                            />
                            <input
                              type="text"
                              value={editForm.stammered}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  stammered: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                              placeholder="Kekemelik Versiyonu"
                            />
                          </div>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(entry.id!)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingWord(null);
                                setEditForm({
                                  word: "",
                                  kirmiziAlan: "",
                                  stammered: "",
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:bg-slate-50 rounded transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Mode
                        <div className="text-center">
                          <div className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                            {entry.word}
                          </div>
                          <div className="flex justify-center text-base sm:text-lg font-medium mb-3">
                            <span className="text-red-600 font-mono">
                              {entry.kirmiziAlan || ""}
                            </span>
                            <span className="font-mono text-black">
                              {entry.stammered}
                            </span>
                          </div>
                          {isAdmin && (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditWord(entry)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteWord(entry.id!)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    {selectedLetter
                      ? "Bu harfle başlayan kelime bulunamadı."
                      : "Bir harf seçin."}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Videolar ve Dokumanlar Tab */}
          {activeTab === "dokumanlar" && (
            <>
              {isAdmin && (
                <div className="mb-8">
                  {!showDokumanUploadForm && (
                    <button
                      type="button"
                      onClick={() => setShowDokumanUploadForm(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors mb-4"
                    >
                      <Plus className="h-4 w-4" /> Dosya Ekle
                    </button>
                  )}
                  {showDokumanUploadForm && (
                    <form
                      onSubmit={handleDokumanUpload}
                      className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Başlık *
                        </label>
                        <input
                          type="text"
                          required
                          value={dokumanUploadTitle}
                          onChange={(e) =>
                            setDokumanUploadTitle(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Doküman başlığı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Dosya Yükle *
                        </label>
                        <input
                          type="file"
                          multiple
                          onChange={handleDokumanFileChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Her türlü dosya yükleyebilirsiniz (video, PDF, Word,
                          vb.)
                        </p>
                        {dokumanUploadFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-slate-600">
                              Seçilen dosyalar ({dokumanUploadFiles.length}):
                            </p>
                            {dokumanUploadFiles.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-slate-100 p-2 rounded"
                              >
                                <span className="text-sm text-slate-700">
                                  {file.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={dokumanUploadLoading}
                          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {dokumanUploadLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDokumanUploadForm(false);
                            setDokumanUploadFiles([]);
                            setDokumanUploadTitle("");
                          }}
                          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dokumanlar.flatMap((doc) =>
                  (doc.files || []).map((file, idx) => (
                    <div
                      key={doc.id + "-" + idx}
                      className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center w-full max-w-[800px] mx-auto"
                    >
                      {/* Dokuman title above preview */}
                      <div className="font-semibold text-slate-900 text-lg mb-2 text-center w-full">
                        {doc.title}
                      </div>
                      {/* Fixed-size, centered preview box */}
                      <div className="w-full h-[350px] flex items-center justify-center bg-slate-100 rounded-lg border mb-4 overflow-hidden">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <video
                            src={file.url}
                            controls
                            className="max-w-full max-h-full object-contain bg-black"
                          />
                        ) : file.type === "application/pdf" ? (
                          <iframe
                            src={file.url}
                            title={file.name}
                            className="w-full h-full bg-white"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full">
                            <div className="mb-2" style={{ fontSize: 64 }}>
                              {getFileIcon(file.type)}
                            </div>
                            <div className="text-slate-500 text-base">
                              Önizleme yok
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col items-center">
                        <div className="truncate font-medium text-slate-800 text-base mb-2 text-center w-full">
                          {file.name}
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 hover:underline text-base px-4 py-2 rounded border border-teal-100 bg-teal-50 font-semibold"
                            title="İncele"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            İncele
                          </a>
                          {isAdmin && (
                            <button
                              onClick={() =>
                                handleDeleteFileFromDokuman(doc, file)
                              }
                              className="text-red-600 hover:text-red-800 text-base px-4 py-2 rounded border border-red-100 bg-red-50 font-semibold"
                              title="Dosyayı Sil"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
