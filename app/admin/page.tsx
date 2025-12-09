"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import {
  Search,
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
} from "lucide-react"
import CardUploadForm from "@/components/card-upload-form" // Import the CardUploadForm component

interface GiftCard {
  id: string
  invoice_number: string
  sender_name: string
  recipient_name: string
  recipient_email: string
  amount: number
  card_cost: number
  message: string
  status: string
  created_at: string
  opened_at: string | null
  claimed_at: string | null
  card_image_url: string | null
  card_template: string | null
  unique_code: string
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
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [filteredCards, setFilteredCards] = useState<GiftCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "upload-cards">("activity") // Updated state type
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

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

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
        return
      }
      setUser(user)
      setIsLoading(false)
    }
    checkAuth()
  }, [router, supabase.auth])

  // Fetch gift cards
  const fetchGiftCards = async () => {
    setIsRefreshing(true)
    const { data, error } = await supabase.from("gift_cards").select("*").order("created_at", { ascending: false })

    if (!error && data) {
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
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setShowPasswordModal(false), 2000)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#4ECDC4] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <Image src="/images/logo-color.png" alt="LastMinuteCards" width={150} height={50} className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("activity")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "activity" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-5 h-5" />
            Check Activity
          </button>

          <button
            onClick={() => setActiveTab("upload-cards")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "upload-cards" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload Cards
          </button>
          {/* </CHANGE> */}

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "overview" ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>
          <Link
            href="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={fetchGiftCards}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Refresh"
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAllAsRead()
                        }}
                        className="text-xs text-[#4ECDC4] hover:text-[#3dbdb5] font-medium cursor-pointer hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
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
                            markAsRead(notification.id)
                            handleViewCard(notification.cardId)
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
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.time)}</p>
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
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{user?.email?.split("@")[0] || "Admin"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordModal(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                    >
                      <Key className="w-4 h-4 text-gray-400" />
                      Change Password
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors text-left"
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

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#FF6B6B]">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#4ECDC4]/10 rounded-xl">
                      <Gift className="w-6 h-6 text-[#4ECDC4]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Cards</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">£{stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#FF6B6B]/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-[#FF6B6B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opened</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.openedCards}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Claimed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.claimedCards}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#FF6B6B]">Activity</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">SNO</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Invoice</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Sender</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Recipient</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Amount</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Date</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCards.map((card, index) => (
                        <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-8 bg-[#FF6B6B] rounded-full" />
                              <span className="text-sm text-gray-600">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{card.invoice_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{card.sender_name || "Anonymous"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{card.recipient_name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-[#4ECDC4]">
                            {card.amount > 0 ? `£${card.amount}` : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(card.created_at)}</td>
                          <td className="px-6 py-4">{getStatusBadge(card.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setPreviewCard(card)
                                  setShowCardPreviewModal(true)
                                }}
                                className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors cursor-pointer"
                                title="View Card"
                              >
                                <ImageIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCard(card)
                                  setShowCardDetailModal(true)
                                }}
                                className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadCard(card)}
                                className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors cursor-pointer"
                                title="Download Card"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCards.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No gift cards found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "upload-cards" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#FF6B6B]">Upload Cards by Category</h2>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <CardUploadForm />
              </div>
            </div>
          )}
          {/* </CHANGE> */}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCardDetailModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <p className="font-medium text-sm">{selectedCard.recipient_email}</p>
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

              {selectedCard.message && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Message</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selectedCard.message}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCardDetailModal(false)}
              className="mt-6 w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      {showCardPreviewModal && previewCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
