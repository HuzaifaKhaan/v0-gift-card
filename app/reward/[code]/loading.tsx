import { Header } from "@/components/header"

export default function Loading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F6664C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gift...</p>
        </div>
      </div>
    </>
  )
}
