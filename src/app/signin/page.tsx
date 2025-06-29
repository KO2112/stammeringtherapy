"use client"

import type React from "react"

import { useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { auth, db } from "../../../firebase"
import { useRouter } from "next/navigation"
import { User, Lock, AlertCircle, CheckCircle, Loader2, ArrowRight, AtSign } from "lucide-react"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formType, setFormType] = useState("signin") // 'signin', 'signup', or 'forgot'
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  // Function to get email from username
  const getEmailFromUsername = async (username: string): Promise<string | null> => {
    try {
      const usersRef = collection(db, "users") // Adjust collection name as needed
      const q = query(usersRef, where("username", "==", username))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const userDoc = querySnapshot.docs[0]
      return userDoc.data().email || null
    } catch (error) {
      console.error("Error fetching user email:", error)
      return null
    }
  }

  const handleUsernameSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // First, get the email associated with the username
      const userEmail = await getEmailFromUsername(username)

      if (!userEmail) {
        setError("Username not found. Please check your username and try again.")
        setLoading(false)
        return
      }

      // Use the retrieved email to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, userEmail, password)
      router.push("/dashboard") // Redirect after sign-in
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard") // Redirect after sign-up
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccessMessage("Password reset email sent! Check your inbox.")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  

  const renderForm = () => {
    if (formType === "signin") {
      return (
        <form onSubmit={handleUsernameSignIn} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="Kullanıcı Adı"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Şifre
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("forgot")}
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Şifremi unuttum
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="••••••••••"
              />
            </div>  
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
              Remember me
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )
    } else if (formType === "signup") {
      return (
        <form onSubmit={handleSignUp} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AtSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="••••••••••"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="••••••••••"
              />
            </div>
          </div>

          
        </form>
      )
    } else if (formType === "forgot") {
      return (
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-posta adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AtSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Sending email...
                </>
              ) : (
                <>
                  Şifreyi sıfırla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-xl">
        {/* Left side - Illustration */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">E-Kekemelik</h1>
              </div>
              <p className="mt-6 text-3xl font-bold leading-tight">Online Kekemelik Platformu</p>
              <p className="mt-2 text-teal-100 text-lg">Her zaman ve her yerde</p>
            </div>

            <div className="space-y-8 mt-12">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-white/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sesli Hikaye Okumalar</h3>
                  <p className="text-teal-100">Dilediğiniz Seviyedeki Hikayeleri Okuyun</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-white/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Track your progress</h3>
                  <p className="text-teal-100">İlerlemenizi takip edin. Gelişmeleri gözlemleyin</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-white/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Kekemelere Ozel sohbet platformu</h3>
                  <p className="text-teal-100">Kekemeler ve terapistler ile konuşun</p>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900">
                {formType === "signin" && "Hoş geldiniz"}
                
                {formType === "forgot" && "Şifrenizi sıfırlayın"}
              </h2>
              <p className="mt-3 text-slate-600">
                {formType === "signin" && "Devam etmek için oturum açın"}
                {formType === "signup" && "Join us to start your speech therapy journey"}
                {formType === "forgot" && "Şifrenizi sıfırlamanız için size bir bağlantı göndereceğiz"}
              </p>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 animate-in fade-in-0 duration-300">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-100 animate-in fade-in-0 duration-300">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {renderForm()}

            {(formType === "signin" || formType === "signup") && (
              <>
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    
                  </div>

                  
                </div>
              </>
            )}

            <div className="mt-8 text-center text-slate-600">
              
              {formType === "forgot" && (
                <button
                  type="button"
                  onClick={() => {
                    setFormType("signin")
                    setError("")
                    setSuccessMessage("")
                  }}
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Oturum açma sayfasına geri dön
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
