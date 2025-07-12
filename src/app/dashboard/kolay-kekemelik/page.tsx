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
import { Plus, BookOpen, Edit, Trash2, Save, X, Search } from "lucide-react";

interface WordEntry {
  id?: string;
  word: string;
  kirmiziAlan: string;
  stammered: string;
}

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
];

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
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = userRole === "admin";
  const allWords =
    activeTab === "uzatarak" ? uzatarakWords : tekrarlayarakWords;

  // Sort words alphabetically and filter by search term
  const sortedWords = allWords
    .sort((a, b) => a.word.localeCompare(b.word, "tr"))
    .filter(
      (word) =>
        searchTerm === "" ||
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.stammered.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Show all words when searching, otherwise limit to 10
  const displayWords =
    searchTerm === "" ? sortedWords.slice(0, 10) : sortedWords;

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
              setSearchTerm(""); // Clear search when switching tabs
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

      {/* Search Box */}
      <div className="mx-4 sm:mx-8 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Kelime arayın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
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
            {isAdmin && (
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

          {/* Card List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {displayWords.map((entry) => (
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
            ))}
          </div>

          {/* Empty State */}
          {displayWords.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Henüz kelime eklenmemiş</p>
              {isAdmin && (
                <p className="text-slate-400 text-sm mt-2">
                  İlk kelimeyi eklemek için &quot;Kelime Ekle&quot; butonunu
                  kullanın
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
