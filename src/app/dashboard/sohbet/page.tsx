"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { auth, db, storage } from "../../../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { ref, getDownloadURL } from "firebase/storage"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  where,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  type Timestamp,
} from "firebase/firestore"
import { MessageCircle, Users, Shield, Search, X, Plus, Send, Trash2 } from "lucide-react"

interface ChatUser {
  uid: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  role?: string
  profilePhoto?: string
}

interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  senderPhoto?: string
  createdAt: Timestamp
  chatId: string
}

interface ChatRoom {
  id: string
  name: string
  type: "general" | "private"
  participantId?: string
  participantName?: string
  participantPhoto?: string
}

interface ActiveChat {
  id: string
  participants: string[]
  otherParticipant: ChatUser
  lastMessage?: string
  lastMessageTime?: Timestamp
  unreadCount?: number
  lastReadTime?: Timestamp
}

const getProfilePictureUrl = async (uid: string): Promise<string | null> => {
  try {
    const profilePicRef = ref(storage, `profile_pictures/${uid}`)
    const url = await getDownloadURL(profilePicRef)
    return url
  } catch (error) {
    console.log(`No profile picture found for user ${uid}`)
    return null
  }
}

export default function SohbetPage() {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null)
  const [admins, setAdmins] = useState<ChatUser[]>([])
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<ChatRoom>({
    id: "general",
    name: "Genel Sohbet",
    type: "general",
  })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageProfilePics, setMessageProfilePics] = useState<Record<string, string>>({})
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searching, setSearching] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [generalUnreadCount, setGeneralUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null)
        setLoading(false)
        return
      }

      try {
        // Get current user data from Firestore
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const profilePictureUrl = await getProfilePictureUrl(user.uid)

          const currentUserData = {
            uid: user.uid,
            ...userData,
            profilePhoto: profilePictureUrl || userData.profilePhoto || "",
          } as ChatUser

          setCurrentUser(currentUserData)
          console.log("Current user loaded:", currentUserData)

          // Load admins for regular users
          if (userData.role !== "admin") {
            await loadAdmins()
          }

          // Load active chats
          await loadActiveChats(user.uid)

          // Set up unread message listeners
          setupUnreadListeners(user.uid)
        } else {
          console.error("User document not found in Firestore for UID:", user.uid)
          setCurrentUser(null)
          setLoading(false)
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Setup unread message listeners
  const setupUnreadListeners = (userId: string) => {
    // Listen for general chat unread messages
    const generalMessagesRef = collection(db, "messages", "general", "messages")
    const generalQuery = query(generalMessagesRef, orderBy("createdAt", "desc"))

    onSnapshot(generalQuery, async (snapshot) => {
      if (!snapshot.empty) {
        // Get user's last read time for general chat
        const userReadRef = doc(db, "user_read_status", userId, "chats", "general")
        const userReadDoc = await getDoc(userReadRef)
        const lastReadTime = userReadDoc.exists() ? userReadDoc.data().lastReadTime : null

        let unreadCount = 0
        snapshot.forEach((doc) => {
          const messageData = doc.data()
          if (messageData.senderId !== userId) {
            if (!lastReadTime || messageData.createdAt?.toDate() > lastReadTime.toDate()) {
              unreadCount++
            }
          }
        })

        setGeneralUnreadCount(unreadCount)
      }
    })

    // Listen for private chat unread messages
    const setupPrivateChatListeners = async () => {
      const userChatsRef = doc(db, "user_chats", userId)
      const userChatsDoc = await getDoc(userChatsRef)

      if (userChatsDoc.exists()) {
        const chatIds = userChatsDoc.data().chats || []

        chatIds.forEach((chatId: string) => {
          const messagesRef = collection(db, "private_messages", chatId, "messages")
          const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"))

          onSnapshot(messagesQuery, async (snapshot) => {
            if (!snapshot.empty) {
              const userReadRef = doc(db, "user_read_status", userId, "chats", chatId)
              const userReadDoc = await getDoc(userReadRef)
              const lastReadTime = userReadDoc.exists() ? userReadDoc.data().lastReadTime : null

              let unreadCount = 0
              snapshot.forEach((doc) => {
                const messageData = doc.data()
                if (messageData.senderId !== userId) {
                  if (!lastReadTime || messageData.createdAt?.toDate() > lastReadTime.toDate()) {
                    unreadCount++
                  }
                }
              })

              // Update active chats with new unread count
              setActiveChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount } : chat)))

              // Also update unread counts for admin chats (for regular users)
              setUnreadCounts((prev) => ({ ...prev, [chatId]: unreadCount }))
            }
          })
        })
      }

      // For regular users, also listen to admin chats even if they haven't been started yet
      if (currentUser?.role !== "admin") {
        // Get all admins and set up listeners for potential chats
        const usersRef = collection(db, "users")
        const adminQuery = query(usersRef, where("role", "==", "admin"))
        const adminSnapshot = await getDocs(adminQuery)

        adminSnapshot.docs.forEach((adminDoc) => {
          const adminId = adminDoc.id
          const chatId = [userId, adminId].sort().join("_")

          const messagesRef = collection(db, "private_messages", chatId, "messages")
          const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"))

          onSnapshot(messagesQuery, async (snapshot) => {
            if (!snapshot.empty) {
              const userReadRef = doc(db, "user_read_status", userId, "chats", chatId)
              const userReadDoc = await getDoc(userReadRef)
              const lastReadTime = userReadDoc.exists() ? userReadDoc.data().lastReadTime : null

              let unreadCount = 0
              snapshot.forEach((doc) => {
                const messageData = doc.data()
                // Only count messages FROM the admin TO the current user as unread
                if (messageData.senderId === adminId) {
                  if (!lastReadTime || messageData.createdAt?.toDate() > lastReadTime.toDate()) {
                    unreadCount++
                  }
                }
              })

              // Update unread counts for this admin chat
              setUnreadCounts((prev) => ({ ...prev, [`admin_${adminId}`]: unreadCount }))
            }
          })
        })
      } else {
        // For admins, listen to all potential user chats
        const usersRef = collection(db, "users")
        const allUsersSnapshot = await getDocs(usersRef)

        allUsersSnapshot.docs.forEach((userDoc) => {
          const otherUserId = userDoc.id
          if (otherUserId === userId) return // Skip self

          const chatId = [userId, otherUserId].sort().join("_")
          const messagesRef = collection(db, "private_messages", chatId, "messages")
          const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"))

          onSnapshot(messagesQuery, async (snapshot) => {
            if (!snapshot.empty) {
              const userReadRef = doc(db, "user_read_status", userId, "chats", chatId)
              const userReadDoc = await getDoc(userReadRef)
              const lastReadTime = userReadDoc.exists() ? userReadDoc.data().lastReadTime : null

              let unreadCount = 0
              snapshot.forEach((doc) => {
                const messageData = doc.data()
                // Only count messages FROM the other user TO the current admin as unread
                if (messageData.senderId === otherUserId) {
                  if (!lastReadTime || messageData.createdAt?.toDate() > lastReadTime.toDate()) {
                    unreadCount++
                  }
                }
              })

              // Update active chats with new unread count
              setActiveChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount } : chat)))

              // Also update unread counts for this specific chat
              setUnreadCounts((prev) => ({ ...prev, [chatId]: unreadCount }))
            }
          })
        })
      }
    }

    setupPrivateChatListeners()
  }

  // Load admins for regular users
  const loadAdmins = async () => {
    try {
      const usersRef = collection(db, "users")
      const adminQuery = query(usersRef, where("role", "==", "admin"))
      const adminSnapshot = await getDocs(adminQuery)
      const adminList: ChatUser[] = []

      for (const doc of adminSnapshot.docs) {
        const adminData = doc.data()
        const adminProfilePicUrl = await getProfilePictureUrl(doc.id)
        adminList.push({
          uid: doc.id,
          ...adminData,
          profilePhoto: adminProfilePicUrl || adminData.profilePhoto || "",
        } as ChatUser)
      }

      setAdmins(adminList)
      console.log("Admins loaded:", adminList)
    } catch (error) {
      console.error("Error loading admins:", error)
    }
  }

  // Load active chats (all chats that have been opened, not just with messages)
  const loadActiveChats = async (userId: string) => {
    try {
      // Get user's chat list from their document
      const userChatsRef = doc(db, "user_chats", userId)
      const userChatsDoc = await getDoc(userChatsRef)

      const chats: ActiveChat[] = []

      if (userChatsDoc.exists()) {
        const chatIds = userChatsDoc.data().chats || []

        for (const chatId of chatIds) {
          const participants = chatId.split("_")
          const otherParticipantId = participants.find((id: string) => id !== userId)

          if (otherParticipantId) {
            // Get other participant's data
            const otherUserDoc = await getDoc(doc(db, "users", otherParticipantId))
            if (otherUserDoc.exists()) {
              const otherUserData = otherUserDoc.data()
              const otherUserPhoto = await getProfilePictureUrl(otherParticipantId)

              const otherParticipant: ChatUser = {
                uid: otherParticipantId,
                ...otherUserData,
                profilePhoto: otherUserPhoto || otherUserData.profilePhoto || "",
              }

              // Get unread count for this chat
              const unreadCount = await getUnreadCount(userId, chatId)

              chats.push({
                id: chatId,
                participants,
                otherParticipant,
                unreadCount,
              })
            }
          }
        }
      }

      setActiveChats(chats)
      console.log("Active chats loaded:", chats)
    } catch (error) {
      console.error("Error loading active chats:", error)
    }
  }

  // Get unread count for a specific chat
  const getUnreadCount = async (userId: string, chatId: string): Promise<number> => {
    try {
      const userReadRef = doc(db, "user_read_status", userId, "chats", chatId)
      const userReadDoc = await getDoc(userReadRef)
      const lastReadTime = userReadDoc.exists() ? userReadDoc.data().lastReadTime : null

      const messagesRef = collection(db, "private_messages", chatId, "messages")
      const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"))
      const messagesSnapshot = await getDocs(messagesQuery)

      let unreadCount = 0
      messagesSnapshot.forEach((doc) => {
        const messageData = doc.data()
        if (messageData.senderId !== userId) {
          if (!lastReadTime || messageData.createdAt?.toDate() > lastReadTime.toDate()) {
            unreadCount++
          }
        }
      })

      return unreadCount
    } catch (error) {
      console.error("Error getting unread count:", error)
      return 0
    }
  }

  // Mark chat as read
  const markChatAsRead = async (chatId: string) => {
    if (!currentUser) return

    try {
      const userReadRef = doc(db, "user_read_status", currentUser.uid, "chats", chatId)
      await setDoc(
        userReadRef,
        {
          lastReadTime: serverTimestamp(),
          chatId: chatId,
        },
        { merge: true },
      )

      // Update local unread counts
      if (chatId === "general") {
        setGeneralUnreadCount(0)
      } else {
        setUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }))
        setActiveChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)))

        // Also clear admin-specific unread counts for regular users
        if (currentUser.role !== "admin") {
          const participants = chatId.split("_")
          const adminId = participants.find((id: string) => id !== currentUser.uid)
          if (adminId) {
            setUnreadCounts((prev) => ({ ...prev, [`admin_${adminId}`]: 0 }))
          }
        }
      }
    } catch (error) {
      console.error("Error marking chat as read:", error)
    }
  }

  // Add chat to user's chat list
  const addChatToUserList = async (userId: string, chatId: string) => {
    try {
      const userChatsRef = doc(db, "user_chats", userId)
      const userChatsDoc = await getDoc(userChatsRef)

      let existingChats = []
      if (userChatsDoc.exists()) {
        existingChats = userChatsDoc.data().chats || []
      }

      if (!existingChats.includes(chatId)) {
        existingChats.push(chatId)
        await setDoc(userChatsRef, { chats: existingChats }, { merge: true })
      }
    } catch (error) {
      console.error("Error adding chat to user list:", error)
    }
  }

  // Search users (for admins)
  const searchUsers = async (term: string) => {
    if (!term.trim() || currentUser?.role !== "admin") {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const usersRef = collection(db, "users")
      const snapshot = await getDocs(usersRef)
      const results: ChatUser[] = []

      for (const docSnapshot of snapshot.docs) {
        if (docSnapshot.id === currentUser.uid) continue // Skip current user

        const userData = docSnapshot.data()
        const searchableText =
          `${userData.firstName || ""} ${userData.lastName || ""} ${userData.username || ""} ${userData.email || ""}`.toLowerCase()

        if (searchableText.includes(term.toLowerCase())) {
          const userPhoto = await getProfilePictureUrl(docSnapshot.id)
          results.push({
            uid: docSnapshot.id,
            ...userData,
            profilePhoto: userPhoto || userData.profilePhoto || "",
          } as ChatUser)
        }
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load profile pictures for message senders
  useEffect(() => {
    const loadMessageProfilePics = async () => {
      const uniqueSenderIds = [...new Set(messages.map((msg) => msg.senderId))]
      const profilePics: Record<string, string> = {}

      for (const senderId of uniqueSenderIds) {
        if (!messageProfilePics[senderId]) {
          const profilePicUrl = await getProfilePictureUrl(senderId)
          if (profilePicUrl) {
            profilePics[senderId] = profilePicUrl
          }
        }
      }

      if (Object.keys(profilePics).length > 0) {
        setMessageProfilePics((prev) => ({ ...prev, ...profilePics }))
      }
    }

    if (messages.length > 0) {
      loadMessageProfilePics()
    }
  }, [messages])

  // Messages listener
  useEffect(() => {
    if (!selectedChat || !currentUser) return

    let messagesRef

    try {
      if (selectedChat.type === "general") {
        messagesRef = collection(db, "messages", "general", "messages")
      } else {
        const chatId = [currentUser.uid, selectedChat.participantId].sort().join("_")
        messagesRef = collection(db, "private_messages", chatId, "messages")
      }

      const q = query(messagesRef, orderBy("createdAt", "asc"))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messageList: Message[] = []
          snapshot.forEach((doc) => {
            messageList.push({
              id: doc.id,
              ...doc.data(),
            } as Message)
          })
          setMessages(messageList)

          // Mark chat as read when viewing messages
          const chatId =
            selectedChat.type === "general" ? "general" : [currentUser.uid, selectedChat.participantId].sort().join("_")
          markChatAsRead(chatId)
        },
        (error) => {
          console.error("Error listening to messages:", error)
          setMessages([])
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up message listener:", error)
      setMessages([])
    }
  }, [selectedChat, currentUser])

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || sending) return

    setSending(true)
    try {
      let messagesRef
      let chatId

      if (selectedChat.type === "general") {
        messagesRef = collection(db, "messages", "general", "messages")
        chatId = "general"
      } else {
        chatId = [currentUser.uid, selectedChat.participantId].sort().join("_")
        messagesRef = collection(db, "private_messages", chatId, "messages")

        // Add this chat to both users' chat lists
        await addChatToUserList(currentUser.uid, chatId)
        await addChatToUserList(selectedChat.participantId!, chatId)
      }

      const messageData = {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.firstName || currentUser.username || currentUser.email || "Unknown User",
        senderPhoto: currentUser.profilePhoto || "",
        createdAt: serverTimestamp(),
        chatId: selectedChat.id,
      }

      await addDoc(messagesRef, messageData)
      setNewMessage("")

      // Refresh active chats after sending a message
      if (selectedChat.type === "private") {
        await loadActiveChats(currentUser.uid)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.")
    } finally {
      setSending(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!currentUser || currentUser.role !== "admin") return

    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return

    try {
      let messageRef

      if (selectedChat.type === "general") {
        messageRef = doc(db, "messages", "general", "messages", messageId)
      } else {
        const chatId = [currentUser.uid, selectedChat.participantId].sort().join("_")
        messageRef = doc(db, "private_messages", chatId, "messages", messageId)
      }

      await deleteDoc(messageRef)
    } catch (error) {
      console.error("Error deleting message:", error)
      alert("Mesaj silinemedi. Lütfen tekrar deneyin.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectChat = (chat: ChatRoom) => {
    setSelectedChat(chat)
    setMessages([])
    setShowUserSearch(false)

    // Mark chat as read when selecting it
    const chatId = chat.type === "general" ? "general" : [currentUser!.uid, chat.participantId].sort().join("_")
    markChatAsRead(chatId)

    // Scroll to bottom when selecting a new chat
    setTimeout(() => scrollToBottom(), 200)
  }

  const startChatWithUser = async (user: ChatUser) => {
    if (!currentUser) return

    const chatId = [currentUser.uid, user.uid].sort().join("_")

    // Add this chat to both users' chat lists
    await addChatToUserList(currentUser.uid, chatId)
    await addChatToUserList(user.uid, chatId)

    // Refresh active chats
    await loadActiveChats(currentUser.uid)

    // Check if this user is already in the admins list (for regular users)
    const isUserInAdminsList = currentUser.role !== "admin" && admins.some((admin) => admin.uid === user.uid)

    // Only create a new chat entry if the user is not already in the admins list
    if (!isUserInAdminsList) {
      selectChat({
        id: `private_${user.uid}`,
        name: user.firstName || user.username || user.email || "User",
        type: "private",
        participantId: user.uid,
        participantName: user.firstName || user.username || user.email || "User",
        participantPhoto: user.profilePhoto,
      })
    } else {
      // If user is in admins list, select from there instead
      selectChat({
        id: `private_${user.uid}`,
        name: user.firstName || user.username || user.email || "Admin",
        type: "private",
        participantId: user.uid,
        participantName: user.firstName || user.username || user.email || "Admin",
        participantPhoto: user.profilePhoto,
      })
    }

    setShowUserSearch(false)
    setSearchTerm("")
    setSearchResults([])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-600 font-medium">Sohbet yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Kullanıcı Bulunamadı</h2>
          <p className="text-slate-600">Kullanıcı bilgileriniz yüklenemedi. Lütfen sayfayı yenileyin.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-teal-600" />
            Sohbet
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Hoş geldin, {currentUser.firstName || currentUser.username || "User"}!
          </p>
          {currentUser.role === "admin" && (
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* General Chat */}
          <div className="p-2">
            <button
              onClick={() =>
                selectChat({
                  id: "general",
                  name: "Genel Sohbet",
                  type: "general",
                })
              }
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                selectedChat.id === "general" ? "bg-teal-100 text-teal-900" : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center relative">
                  <Users className="h-5 w-5 text-white" />
                  {generalUnreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {generalUnreadCount > 9 ? "9+" : generalUnreadCount}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Genel Sohbet</p>
                  <p className="text-sm text-slate-500">Tüm kullanıcılar</p>
                </div>
              </div>
            </button>
          </div>

          {/* Admin Search (for admins only) */}
          {currentUser.role === "admin" && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center justify-between">
                Kullanıcı Ara
                <button
                  onClick={() => setShowUserSearch(!showUserSearch)}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {showUserSearch ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
              {showUserSearch && (
                <div className="px-2 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  {searching && (
                    <div className="text-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.uid}
                          onClick={() => startChatWithUser(user)}
                          className="w-full p-2 rounded-lg text-left hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={user.profilePhoto || "/placeholder.svg"}
                              alt={user.firstName || user.username || "User"}
                              className="w-6 h-6 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget
                                target.style.display = "none"
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) {
                                  fallback.style.display = "flex"
                                }
                              }}
                            />
                            <div
                              className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-xs text-white"
                              style={{ display: user.profilePhoto ? "none" : "flex" }}
                            >
                              {(user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()}
                            </div>
                            <span className="text-sm">{user.firstName || user.username || user.email}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admins (for regular users) */}
          {currentUser.role !== "admin" && admins.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Adminler ({admins.length})
              </div>
              {admins.map((admin) => {
                const adminUnreadCount = unreadCounts[`admin_${admin.uid}`] || 0

                return (
                  <button
                    key={admin.uid}
                    onClick={() =>
                      selectChat({
                        id: `private_${admin.uid}`,
                        name: admin.firstName || admin.username || admin.email || "Admin",
                        type: "private",
                        participantId: admin.uid,
                        participantName: admin.firstName || admin.username || admin.email || "Admin",
                        participantPhoto: admin.profilePhoto,
                      })
                    }
                    className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                      selectedChat.id === `private_${admin.uid}`
                        ? "bg-teal-100 text-teal-900"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={admin.profilePhoto || "/placeholder.svg"}
                          alt={admin.firstName || admin.username || "Admin"}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = "none"
                            const fallback = target.parentElement?.querySelector(".fallback-avatar") as HTMLElement
                            if (fallback) {
                              fallback.style.display = "flex"
                            }
                          }}
                        />
                        <div
                          className="fallback-avatar w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
                          style={{ display: admin.profilePhoto ? "none" : "flex" }}
                        >
                          <span className="text-white font-medium text-sm">
                            {(admin.firstName?.[0] || admin.username?.[0] || "A").toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <Shield className="h-2.5 w-2.5 text-white" />
                        </div>
                        {adminUnreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {adminUnreadCount > 9 ? "9+" : adminUnreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{admin.firstName || admin.username || admin.email || "Admin"}</p>
                        <p className="text-sm text-slate-500">Admin</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Active Chats */}
          {activeChats.filter((chat) => {
            // For regular users, filter out chats with admins since they're already shown in the admins section
            if (currentUser.role !== "admin") {
              return !admins.some((admin) => admin.uid === chat.otherParticipant.uid)
            }
            return true
          }).length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sohbetler (
                {
                  activeChats.filter((chat) => {
                    if (currentUser.role !== "admin") {
                      return !admins.some((admin) => admin.uid === chat.otherParticipant.uid)
                    }
                    return true
                  }).length
                }
                )
              </div>
              {activeChats
                .filter((chat) => {
                  if (currentUser.role !== "admin") {
                    return !admins.some((admin) => admin.uid === chat.otherParticipant.uid)
                  }
                  return true
                })
                .map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() =>
                      selectChat({
                        id: `private_${chat.otherParticipant.uid}`,
                        name:
                          chat.otherParticipant.firstName ||
                          chat.otherParticipant.username ||
                          chat.otherParticipant.email ||
                          "User",
                        type: "private",
                        participantId: chat.otherParticipant.uid,
                        participantName:
                          chat.otherParticipant.firstName ||
                          chat.otherParticipant.username ||
                          chat.otherParticipant.email ||
                          "User",
                        participantPhoto: chat.otherParticipant.profilePhoto,
                      })
                    }
                    className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                      selectedChat.id === `private_${chat.otherParticipant.uid}`
                        ? "bg-teal-100 text-teal-900"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={chat.otherParticipant.profilePhoto || "/placeholder.svg"}
                          alt={chat.otherParticipant.firstName || chat.otherParticipant.username || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = "none"
                            const fallback = target.parentElement?.querySelector(".fallback-avatar") as HTMLElement
                            if (fallback) {
                              fallback.style.display = "flex"
                            }
                          }}
                        />
                        <div
                          className="fallback-avatar w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center"
                          style={{ display: chat.otherParticipant.profilePhoto ? "none" : "flex" }}
                        >
                          <span className="text-white font-medium text-sm">
                            {(
                              chat.otherParticipant.firstName?.[0] ||
                              chat.otherParticipant.username?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </span>
                        </div>
                        {(chat.unreadCount || 0) > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {(chat.unreadCount || 0) > 9 ? "9+" : chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {chat.otherParticipant.firstName ||
                            chat.otherParticipant.username ||
                            chat.otherParticipant.email ||
                            "User"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            {selectedChat.type === "general" ? (
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            ) : selectedChat.participantPhoto ? (
              <img
                src={selectedChat.participantPhoto || "/placeholder.svg"}
                alt={selectedChat.participantName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {(selectedChat.participantName?.[0] || "A").toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-slate-900">{selectedChat.name}</h2>
              <p className="text-sm text-slate-500">
                {selectedChat.type === "general" ? "Genel sohbet odası" : "Özel mesaj"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: "smooth" }}>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Henüz mesaj yok. İlk mesajı sen gönder!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 group ${message.senderId === currentUser.uid ? "flex-row-reverse" : ""}`}
              >
                <div className="flex-shrink-0 relative">
                  <img
                    src={messageProfilePics[message.senderId] || message.senderPhoto || "/placeholder.svg"}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = "none"
                      const fallback = target.parentElement?.querySelector(".fallback-avatar") as HTMLElement
                      if (fallback) {
                        fallback.style.display = "flex"
                      }
                    }}
                  />
                  <div
                    className="fallback-avatar w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center"
                    style={{ display: messageProfilePics[message.senderId] || message.senderPhoto ? "none" : "flex" }}
                  >
                    <span className="text-white text-xs font-medium">
                      {(message.senderName?.[0] || "U").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={`max-w-xs lg:max-w-md ${message.senderId === currentUser.uid ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {message.senderId === currentUser.uid ? "Sen" : message.senderName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {message.createdAt?.toDate?.()?.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || ""}
                    </span>
                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Mesajı sil"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.senderId === currentUser.uid ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {sending ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
