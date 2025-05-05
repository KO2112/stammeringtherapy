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
import { auth } from "../../../firebase"
import { useRouter } from "next/navigation"
import { AtSign, Lock, AlertCircle, CheckCircle, Loader2, ArrowRight } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formType, setFormType] = useState("signin") // 'signin', 'signup', or 'forgot'
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
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

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/dashboard") // Redirect after sign-in
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
        <form onSubmit={handleEmailSignIn} className="mt-6 space-y-5">
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setFormType("forgot")}
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Forgot password?
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )
    } else if (formType === "forgot") {
      return (
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-5">
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
                  Reset password
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
                <h1 className="text-2xl font-bold">Stammering Therapy</h1>
              </div>
              <p className="mt-6 text-3xl font-bold leading-tight">Find your voice with confidence</p>
              <p className="mt-2 text-teal-100 text-lg">Personalized therapy that works for you</p>
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
                  <h3 className="font-semibold text-lg">Personalized sessions</h3>
                  <p className="text-teal-100">Designed specifically for your needs and progress level</p>
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
                  <p className="text-teal-100">Visualize improvements and celebrate milestones</p>
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
                  <h3 className="font-semibold text-lg">Community support</h3>
                  <p className="text-teal-100">Connect with others on the same journey</p>
                </div>
              </div>
            </div>

            <div className="pt-12">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="italic text-teal-50">
                  This app has transformed my confidence in speaking. I have made more progress in 3 months than in years
                  of traditional therapy.
                </p>
                <div className="mt-3 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">Jamie D.</p>
                    <p className="text-xs text-teal-200">Member since 2023</p>
                  </div>
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
                {formType === "signin" && "Welcome"}
                {formType === "signup" && "Create an account"}
                {formType === "forgot" && "Reset your password"}
              </h2>
              <p className="mt-3 text-slate-600">
                {formType === "signin" && "Sign in to continue your practice journey"}
                {formType === "signup" && "Join us to start your speech therapy journey"}
                {formType === "forgot" && "We'll send you a link to reset your password"}
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
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-lg shadow-sm text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                    >
                      <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 text-center text-slate-600">
              {formType === "signin" && (
                <>
                  Do not have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("signup")
                      setError("")
                      setSuccessMessage("")
                    }}
                    className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
              {formType === "signup" && (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormType("signin")
                      setError("")
                      setSuccessMessage("")
                    }}
                    className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
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
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
