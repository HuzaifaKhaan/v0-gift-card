"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, User, Key, LogOut, ChevronDown, RefreshCw, Gift, Eye, DollarSign } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface Notification {
  id: string
  type: "new_card" | "card_opened" | "card_claimed"
  message: string
  time: Date
  read: boolean
  cardId: string
}

interface GiftCard {
  id: string
  invoice_number: string
  sender_name: string
  recipient_name: string
  amount: number
  status: string
  created_at: string
}

interface AdminHeaderProps {
  user: { email?: string } | null
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onRefresh: () => void
  isRefreshing: boolean
  onViewCard: (cardId: string) => void
  getTimeAgo: (date: Date) => string
}

export default function AdminHeader({
  user,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh,
  isRefreshing,
  onViewCard,
  getTimeAgo,
}: AdminHeaderProps) {
  const router = useRouter()
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotificationDropdown(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown)
                setShowProfileDropdown(false)
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B6B] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAllAsRead()
                      }}
                      className="text-xs text-[#4ECDC4] hover:text-[#3dbdb5] font-medium cursor-pointer hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto overscroll-contain">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          onMarkAsRead(notification.id)
                          onViewCard(notification.cardId)
                          setShowNotificationDropdown(false)
                        }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-[#4ECDC4]/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full flex-shrink-0 ${
                              notification.type === "new_card"
                                ? "bg-[#4ECDC4]/10 text-[#4ECDC4]"
                                : notification.type === "card_opened"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                            {notification.type === "new_card" ? (
                              <Gift className="w-4 h-4" />
                            ) : notification.type === "card_opened" ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <DollarSign className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-snug">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span>{getTimeAgo(notification.time)}</span>
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#4ECDC4] rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowNotificationDropdown(false)
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#185F72] flex items-center justify-center text-white font-semibold text-sm">
                {user?.email?.[0].toUpperCase() || "A"}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">{user?.email?.split("@")[0] || "Admin"}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.email?.split("@")[0] || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileModal(true)
                      setShowProfileDropdown(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true)
                      setShowProfileDropdown(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Key className="w-4 h-4 text-gray-400" />
                    Change Password
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowProfileModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900 font-medium">{user?.email || "admin@example.com"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <p className="text-gray-900 font-medium">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </form>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-[#4ECDC4] text-white rounded-lg font-medium hover:bg-[#3dbdb5] transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
