"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Download,
  Eye,
  Gift,
  DollarSign,
  TrendingUp,
  Users,
  X,
  Bell,
  User,
  Key,
  LogOut,
  ChevronDown,
  RefreshCw,
  ImageIcon,
  Settings,
  BarChart3,
  FileText,
  Upload,
  Menu,
  Mail,
  Calendar,
  Clock,
  Shield,
  Check,
} from "lucide-react"
import CardUploadForm from "@/components/card-upload-form"
import CardManagement, { type CardManagementRef } from "@/components/card-management"

interface GiftCard {
  id: string
  invoice_number: string
  sender_name: string | null
  sender_email: string | null
  recipient_name: string | null
  recipient_email: string | null
  amount: number
  card_cost: number
  message: string | null
  status: string
  created_at: string
  opened_at: string | null
  claimed_at: string | null
  card_image_url: string | null
  card_template: string | null
  unique_code: string
  stripe_payment_intent_id: string | null
  payout_status: string | null
  // Added bank details fields
  account_holder_name: string | null
  sort_code: string | null
  account_number: string | null // Added full account number field
  account_number_last4: string | null
}

interface DashboardStats {
  totalCards: number
  totalRevenue: number
  sentCards: number
  openedCards: number
  claimedCards: number
}

interface Notification {
  id: string
  type: "new_card" | "card_opened" | "card_claimed"
  message: string
  time: Date
  read: boolean
  cardId: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; created_at?: string; last_sign_in_at?: string } | null>(null)
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [filteredCards, setFilteredCards] = useState<GiftCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "upload-cards" | "manage-cards" | "settings">(
    "activity",
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  // Added mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [settingsSection, setSettingsSection] = useState<"profile" | "security" | "notifications">("profile")

  // Dropdowns
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCardDetailModal, setShowCardDetailModal] = useState(false)
  const [showCardPreviewModal, setShowCardPreviewModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [previewCard, setPreviewCard] = useState<GiftCard | null>(null)

  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalCards: 0,
    totalRevenue: 0,
    sentCards: 0,
    openedCards: 0,
    claimedCards: 0,
  })

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const supabase = createClient()

  // Click outside handler for dropdowns
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

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (error || !user) {
          router.replace("/admin/login")
          return
        }

        const userRole = user.user_metadata?.role

        if (userRole !== "admin") {
          await supabase.auth.signOut()
          router.replace("/admin/login")
          return
        }

        setUser(user)
        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          router.replace("/admin/login")
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  // Fetch gift cards
  const fetchGiftCards = async () => {
    setIsRefreshing(true)
    const { data, error } = await supabase.from("gift_cards").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      console.log(
        "[v0] Fetched gift cards with bank details:",
        data
          .filter((card) => card.account_number)
          .map((card) => ({
            id: card.id,
            account_holder_name: card.account_holder_name,
            account_number: card.account_number,
            sort_code: card.sort_code,
          })),
      )
      setGiftCards(data)
      setFilteredCards(data)
      calculateStats(data)
      generateNotifications(data)
    }
    setIsRefreshing(false)
  }

  useEffect(() => {
    if (!isLoading && user) {
      fetchGiftCards()

      // Real-time subscription
      const channel = supabase
        .channel("gift_cards_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "gift_cards" }, () => {
          fetchGiftCards()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [isLoading, user])

  // Search filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = giftCards.filter(
        (card) =>
          card.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.recipient_email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCards(filtered)
    } else {
      setFilteredCards(giftCards)
    }
  }, [searchQuery, giftCards])

  const calculateStats = (cards: GiftCard[]) => {
    const totalCards = cards.length
    const totalRevenue = cards.reduce((sum, card) => sum + (card.card_cost || 2.5), 0)
    const sentCards = cards.filter((c) => c.status === "sent").length
    const openedCards = cards.filter((c) => c.status === "opened").length
    const claimedCards = cards.filter((c) => c.status === "claimed").length
    setStats({ totalCards, totalRevenue, sentCards, openedCards, claimedCards })
  }

  const generateNotifications = (cards: GiftCard[]) => {
    const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]")
    const now = new Date()
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const notifs: Notification[] = []
    cards.forEach((card) => {
      const createdAt = new Date(card.created_at)
      if (createdAt > dayAgo) {
        notifs.push({
          id: `new-${card.id}`,
          type: "new_card",
          message: `New card sent from ${card.sender_name || "Anonymous"} to ${card.recipient_name}`,
          time: createdAt,
          read: readIds.includes(`new-${card.id}`),
          cardId: card.id,
        })
      }
      if (card.opened_at) {
        const openedAt = new Date(card.opened_at)
        if (openedAt > dayAgo) {
          notifs.push({
            id: `opened-${card.id}`,
            type: "card_opened",
            message: `${card.recipient_name} opened their card`,
            time: openedAt,
            read: readIds.includes(`opened-${card.id}`),
            cardId: card.id,
          })
        }
      }
      if (card.claimed_at) {
        const claimedAt = new Date(card.claimed_at)
        if (claimedAt > dayAgo) {
          notifs.push({
            id: `claimed-${card.id}`,
            type: "card_claimed",
            message: `${card.recipient_name} claimed £${card.amount}`,
            time: claimedAt,
            read: readIds.includes(`claimed-${card.id}`),
            cardId: card.id,
          })
        }
      }
    })

    notifs.sort((a, b) => b.time.getTime() - a.time.getTime())
    setNotifications(notifs)
    setUnreadCount(notifs.filter((n) => !n.read).length)
  }

  const markAsRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]")
    if (!readIds.includes(id)) {
      readIds.push(id)
      localStorage.setItem("readNotifications", JSON.stringify(readIds))
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id)
    localStorage.setItem("readNotifications", JSON.stringify(allIds))
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      sent: "bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20",
      opened: "bg-[#FF6B6B] text-white",
      claimed: "bg-[#4ECDC4] text-white",
    }
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}
      >
        {status}
      </span>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setIsUpdatingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setPasswordSuccess(false)
        setShowPasswordModal(false)
      }, 2000)
    }
    setIsUpdatingPassword(false)
  }

  const handleDownloadCard = async (card: GiftCard) => {
    const imageUrl = card.card_image_url || card.card_template
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `card-${card.invoice_number}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download card:", error)
    }
  }

  const handleViewCard = (cardId: string) => {
    const card = giftCards.find((c) => c.id === cardId)
    if (card) {
      setSelectedCard(card)
      setShowCardDetailModal(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const cardManagementRef = useRef<CardManagementRef>(null)

  const handleCardUploadSuccess = async () => {
    console.log("[v0] Card upload successful, switching to manage-cards tab and refreshing...")
    setActiveTab("manage-cards")
    setIsMobileMenuOpen(false)
    setTimeout(async () => {
      if (cardManagementRef.current) {
        await cardManagementRef.current.refreshCards()
      }
    }, 100)
  }

  // Added settings tab to sidebar
  const handleTabChange = (tab: "overview" | "activity" | "upload-cards" | "manage-cards" | "settings") => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#4ECDC4] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
        w-64 bg-white border-r border-gray-200 flex flex-col
        fixed h-full z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/logo-color.png"
              alt="LastMinuteCards"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => handleTabChange("activity")}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "activity" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Check Activity</span>
          </button>

          <button
            onClick={() => handleTabChange("upload-cards")}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "upload-cards" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Upload Cards</span>
          </button>

          <button
            onClick={() => handleTabChange("manage-cards")}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "manage-cards" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Manage Cards</span>
          </button>

          <button
            onClick={() => handleTabChange("overview")}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "overview" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Overview</span>
          </button>

          <button
            onClick={() => handleTabChange("settings")}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "settings" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Settings</span>
          </button>
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full lg:ml-0">
        <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">Dashboard</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Refresh */}
            <button
              onClick={fetchGiftCards}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown)
                  setShowProfileDropdown(false)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#FF6B6B] text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAllAsRead()
                        }}
                        className="text-xs text-[#4ECDC4] hover:text-[#3dbdb5] font-medium cursor-pointer hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center text-gray-500">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs sm:text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            markAsRead(notification.id)
                            handleViewCard(notification.cardId)
                            setShowNotificationDropdown(false)
                          }}
                          className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? "bg-[#4ECDC4]/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                                notification.type === "new_card"
                                  ? "bg-[#4ECDC4]/10 text-[#4ECDC4]"
                                  : notification.type === "card_opened"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-green-100 text-green-600"
                              }`}
                            >
                              {notification.type === "new_card" ? (
                                <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : notification.type === "card_opened" ? (
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-900 leading-snug">{notification.message}</p>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                                {getTimeAgo(notification.time)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#4ECDC4] rounded-full flex-shrink-0 mt-1.5 sm:mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown)
                  setShowNotificationDropdown(false)
                }}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#185F72] flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                  {user?.email?.[0].toUpperCase() || "A"}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px]">
                    {user?.email?.split("@")[0] || "Admin"}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform flex-shrink-0 ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 overflow-hidden z-50">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {user?.email?.split("@")[0] || "Admin"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordModal(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                    >
                      <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6">
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-[#4ECDC4]/10 rounded-xl flex-shrink-0">
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECDC4]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Total Cards</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stats.totalCards}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-xl flex-shrink-0">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                        £{stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-[#FF6B6B]/10 rounded-xl flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B6B]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Opened</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stats.openedCards}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-xl flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Claimed</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stats.claimedCards}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">Activity</h2>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          SNO
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Invoice
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Sender
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Recipient
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Amount
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Bank Details
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Date
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Status
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 sm:px-6 py-3 sm:py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCards.map((card, index) => (
                        <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-6 sm:h-8 bg-[#FF6B6B] rounded-full" />
                              <span className="text-xs sm:text-sm text-gray-600">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            {card.invoice_number}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 truncate max-w-[100px]">
                            {card.sender_name || "Anonymous"}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 truncate max-w-[100px]">
                            {card.recipient_name}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-[#4ECDC4]">
                            {card.amount > 0 ? `£${card.amount}` : "-"}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            {card.account_holder_name ? (
                              <div>
                                <div className="font-medium text-gray-900">{card.account_holder_name}</div>
                                <div className="text-gray-500">
                                  {card.sort_code &&
                                    `${card.sort_code.slice(0, 2)}-${card.sort_code.slice(2, 4)}-${card.sort_code.slice(4, 6)}`}
                                </div>
                                <div className="text-gray-500">{card.account_number || "Not available"}</div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Not provided</span>
                            )}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                            {formatDate(card.created_at)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">{getStatusBadge(card.status)}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => {
                                  setPreviewCard(card)
                                  setShowCardPreviewModal(true)
                                }}
                                className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors cursor-pointer"
                                title="View Card"
                              >
                                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCard(card)
                                  setShowCardDetailModal(true)
                                }}
                                className="p-1.5 sm:p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadCard(card)}
                                className="p-1.5 sm:p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors cursor-pointer"
                                title="Download Card"
                              >
                                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCards.length === 0 && (
                  <div className="p-8 sm:p-12 text-center text-gray-500">
                    <Gift className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <p className="text-sm sm:text-base">No gift cards found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "upload-cards" && <CardUploadForm onUploadSuccess={handleCardUploadSuccess} />}

          {activeTab === "manage-cards" && <CardManagement ref={cardManagementRef} />}

          {activeTab === "settings" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#FF6B6B]">Settings</h2>

              {/* Settings Navigation */}
              <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setSettingsSection("profile")}
                  className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                    settingsSection === "profile" ? "text-[#4ECDC4]" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Profile</span>
                  </div>
                  {settingsSection === "profile" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]" />
                  )}
                </button>

                <button
                  onClick={() => setSettingsSection("security")}
                  className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                    settingsSection === "security" ? "text-[#4ECDC4]" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Security</span>
                  </div>
                  {settingsSection === "security" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]" />
                  )}
                </button>

                <button
                  onClick={() => setSettingsSection("notifications")}
                  className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                    settingsSection === "notifications" ? "text-[#4ECDC4]" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Notifications</span>
                  </div>
                  {settingsSection === "notifications" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECDC4]" />
                  )}
                </button>
              </div>

              {/* Profile Section */}
              {settingsSection === "profile" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                      Profile Information
                    </h3>

                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#185F72] flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
                        {user?.email?.[0].toUpperCase() || "A"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                          {user?.email?.split("@")[0] || "Admin"}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-500">Administrator</p>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs text-gray-500">Email Address</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs text-gray-500">Account Created</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
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

                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs text-gray-500">Last Sign In</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
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
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Change Email</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      Update your email address. A confirmation will be sent to the new email.
                    </p>

                    <div className="space-y-3 sm:space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          New Email Address
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email address"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent outline-none text-xs sm:text-sm"
                        />
                      </div>

                      {emailError && <p className="text-xs sm:text-sm text-red-500">{emailError}</p>}

                      {emailSuccess && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">Confirmation email sent!</span>
                        </div>
                      )}

                      <button
                        onClick={handleEmailChange}
                        disabled={isUpdatingEmail || !newEmail}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        {isUpdatingEmail ? "Updating..." : "Update Email"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {settingsSection === "security" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Change Password</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                      Ensure your account is using a long, random password to stay secure.
                    </p>

                    <div className="space-y-3 sm:space-y-4 max-w-md">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent outline-none text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent outline-none text-xs sm:text-sm"
                        />
                      </div>

                      {passwordError && <p className="text-xs sm:text-sm text-red-500">{passwordError}</p>}

                      {passwordSuccess && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">Password updated successfully!</span>
                        </div>
                      )}

                      <button
                        onClick={handlePasswordUpdate}
                        disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs sm:text-sm"
                      >
                        {isUpdatingPassword ? (
                          <>
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      Add additional security to your account using two-factor authentication.
                    </p>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">Status</p>
                        <p className="text-xs sm:text-sm text-gray-500">Not enabled</p>
                      </div>
                      <button
                        disabled
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-xs sm:text-sm"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {settingsSection === "notifications" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                      Email Notifications
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                      Choose what notifications you would like to receive.
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm">New Gift Card Orders</p>
                          <p className="text-xs text-gray-500">Receive an email when a new gift card is purchased</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4ECDC4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#4ECDC4]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm">Gift Card Opened</p>
                          <p className="text-xs text-gray-500">Get notified when a recipient opens their card</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4ECDC4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#4ECDC4]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm">Gift Card Claimed</p>
                          <p className="text-xs text-gray-500">Be alerted when a gift card is successfully claimed</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4ECDC4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#4ECDC4]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-[#185F72] flex items-center justify-center text-white font-bold text-2xl">
                  {user?.email?.[0].toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.email?.split("@")[0] || "Admin"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <p className="text-gray-900 font-medium">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                Password updated successfully!
              </div>
            )}
            {passwordError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{passwordError}</div>}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex-1 py-2.5 bg-[#4ECDC4] text-white rounded-lg font-medium hover:bg-[#3dbdb5] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {showCardDetailModal && selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCardDetailModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Card Details</h2>
              <button
                onClick={() => setShowCardDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Invoice</label>
                    <p className="font-medium">{selectedCard.invoice_number}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCard.status)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Sender</label>
                    <p className="font-medium">{selectedCard.sender_name || "Anonymous"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Recipient</label>
                    <p className="font-medium">{selectedCard.recipient_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Email</label>
                    <p className="font-medium text-sm break-all">{selectedCard.recipient_email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Gift Amount</label>
                    <p className="font-medium text-[#4ECDC4]">
                      {selectedCard.amount > 0 ? `£${selectedCard.amount}` : "No gift"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Card Cost</label>
                    <p className="font-medium">£{selectedCard.card_cost || "2.50"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Created</label>
                    <p className="font-medium text-sm">{formatDate(selectedCard.created_at)}</p>
                  </div>
                </div>
              </div>

              {selectedCard.account_holder_name && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Bank Account Details
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-blue-700 font-medium uppercase">Account Holder Name</label>
                        <p className="font-semibold text-gray-900 mt-1">{selectedCard.account_holder_name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-blue-700 font-medium uppercase">Sort Code</label>
                        <p className="font-mono font-semibold text-gray-900 mt-1">
                          {selectedCard.sort_code
                            ? `${selectedCard.sort_code.slice(0, 2)}-${selectedCard.sort_code.slice(2, 4)}-${selectedCard.sort_code.slice(4, 6)}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-blue-700 font-medium uppercase">Account Number</label>
                        <p className="font-mono font-semibold text-gray-900 mt-1">
                          {selectedCard.account_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-blue-700 font-medium uppercase">Amount to Transfer</label>
                        <p className="font-bold text-green-600 text-lg mt-1">£{selectedCard.amount}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-800 flex items-start gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Copy these details to manually process the bank transfer. Keep this information secure.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCard.message && (
                <div className="border-t border-gray-200 pt-6">
                  <label className="text-xs text-gray-500 uppercase">Message</label>
                  <p className="mt-2 p-4 bg-gray-50 rounded-lg text-sm leading-relaxed">{selectedCard.message}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCardDetailModal(false)}
              className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      {showCardPreviewModal && previewCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCardPreviewModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Card Preview</h2>
              <button
                onClick={() => setShowCardPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
              {previewCard.card_image_url || previewCard.card_template ? (
                <img
                  src={previewCard.card_image_url || previewCard.card_template || ""}
                  alt="Gift Card"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCardPreviewModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadCard(previewCard)}
                className="flex-1 py-2.5 bg-[#4ECDC4] text-white rounded-lg font-medium hover:bg-[#3dbdb5] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
