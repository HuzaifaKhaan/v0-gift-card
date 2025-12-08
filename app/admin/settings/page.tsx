"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  Key,
  User,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export default function AdminSettingsPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("profile")

  // Password change state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Email change state
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase.auth])

  const handlePasswordChange = async () => {
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess(true)
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordSuccess(false), 3000)
      }
    } catch (err) {
      setPasswordError("An error occurred. Please try again.")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleEmailChange = async () => {
    setEmailError("")
    setEmailSuccess(false)

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsUpdatingEmail(true)

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) {
        setEmailError(error.message)
      } else {
        setEmailSuccess(true)
        setNewEmail("")
        setTimeout(() => setEmailSuccess(false), 3000)
      }
    } catch (err) {
      setEmailError("An error occurred. Please try again.")
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#185F72]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin">
            <Image
              src="/images/logo-color.png"
              alt="LastMinuteCards"
              width={140}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LayoutGrid className="w-5 h-5" />
            Check Activity
          </Link>

          <Link
            href="/admin?tab=download"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <FileText className="w-5 h-5" />
            Download Cards
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium bg-[#FFF5F3] text-[#F2855D]"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-7 py-4 text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-200 cursor-pointer text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </header>

        {/* Settings Content */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Settings Navigation */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveSection("profile")}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeSection === "profile" ? "text-[#F2855D]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </div>
                {activeSection === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2855D]" />}
              </button>

              <button
                onClick={() => setActiveSection("security")}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeSection === "security" ? "text-[#F2855D]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </div>
                {activeSection === "security" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2855D]" />
                )}
              </button>

              <button
                onClick={() => setActiveSection("notifications")}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeSection === "notifications" ? "text-[#F2855D]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </div>
                {activeSection === "notifications" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2855D]" />
                )}
              </button>
            </div>

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#185F72] flex items-center justify-center text-white font-bold text-2xl">
                      {user?.email?.[0].toUpperCase() || "A"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{user?.email?.split("@")[0] || "Admin"}</h3>
                      <p className="text-gray-500">Administrator</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Account Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Last Sign In</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.last_sign_in_at
                            ? new Date(user.last_sign_in_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Email */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Email</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Update your email address. A confirmation will be sent to the new email.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Email Address</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email address"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#185F72] focus:border-transparent outline-none"
                      />
                    </div>

                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}

                    {emailSuccess && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Confirmation email sent!</span>
                      </div>
                    )}

                    <button
                      onClick={handleEmailChange}
                      disabled={isUpdatingEmail || !newEmail}
                      className="px-6 py-2.5 bg-[#185F72] text-white rounded-lg hover:bg-[#185F72]/90 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingEmail ? "Updating..." : "Update Email"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                  </p>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#185F72] focus:border-transparent outline-none pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#185F72] focus:border-transparent outline-none pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

                    {passwordSuccess && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Password updated successfully!</span>
                      </div>
                    )}

                    <button
                      onClick={handlePasswordChange}
                      disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                      className="px-6 py-2.5 bg-[#185F72] text-white rounded-lg hover:bg-[#185F72]/90 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Add additional security to your account using two-factor authentication.
                  </p>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-500">Not enabled</p>
                    </div>
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h2>
                  <p className="text-sm text-gray-500 mb-6">Choose what notifications you would like to receive.</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">New Gift Card Orders</p>
                        <p className="text-sm text-gray-500">Receive an email when a new gift card is purchased</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#185F72]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#185F72]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Gift Card Claimed</p>
                        <p className="text-sm text-gray-500">Receive an email when a recipient claims their gift</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#185F72]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#185F72]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Summary</p>
                        <p className="text-sm text-gray-500">Receive a weekly summary of all activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#185F72]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#185F72]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
