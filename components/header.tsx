"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, Facebook, Instagram, Gift, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navCategories = [
  { name: "Birthdays", href: "/customize?category=Birthdays" },
  { name: "Well Wishes", href: "/customize?category=Well Wishes" },
  { name: "Seasonal", href: "/customize?category=Seasonal" },
  { name: "Love and Relationships", href: "/customize?category=Love and Relationships" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar with social icons - hide on very small screens */}
      <div className="bg-[#185F72] hidden sm:block">
        <div className="container mx-auto flex items-center justify-end gap-4 px-4 py-2">
          <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
            <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-opacity hover:opacity-80" />
          </Link>
          <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
            <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-opacity hover:opacity-80" />
          </Link>
          <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-opacity hover:opacity-80"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main navigation - improved responsiveness */}
      <div className="container mx-auto px-3 sm:px-4 bg-white">
        <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between gap-2 sm:gap-4 xl:gap-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Last Minute Cards"
              width={180}
              height={50}
              className="h-7 sm:h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
            {navCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-gray-700 transition-colors hover:text-[#185F72] whitespace-nowrap rounded-md hover:bg-gray-50 cursor-pointer"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <Link href="/test-receiver">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-3 py-2 text-xs font-medium transition-colors cursor-pointer bg-transparent"
              >
                <TestTube className="h-3 w-3" />
                <span>Test</span>
              </Button>
            </Link>

            <Link href="/claim-reward">
              <Button className="hidden sm:flex items-center gap-2 bg-[#185F72] hover:bg-[#144857] text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer">
                <Gift className="h-4 w-4" />
                <span className="hidden md:inline">Claim Your Gift Card</span>
                <span className="md:hidden">Claim Gift</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-[#185F72] cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
              aria-label="Search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Mobile menu button - show until lg breakpoint */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-[#185F72] lg:hidden cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] md:w-[400px] bg-white p-0 overflow-y-auto">
                <div className="flex flex-col h-full">
                  {/* Mobile header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Menu</span>
                  </div>

                  <div className="p-4 border-b border-gray-200 space-y-2">
                    <Link href="/test-receiver" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-3 font-medium transition-colors cursor-pointer bg-transparent"
                      >
                        <TestTube className="h-5 w-5" />
                        Test Gift Card Receiver
                      </Button>
                    </Link>

                    <Link href="/claim-reward" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full flex items-center justify-center gap-2 bg-[#185F72] hover:bg-[#144857] text-white py-3 font-medium transition-colors cursor-pointer">
                        <Gift className="h-5 w-5" />
                        Claim Your Gift Card
                      </Button>
                    </Link>
                  </div>

                  {/* Categories */}
                  <nav className="flex-1 py-2">
                    {navCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center w-full px-4 py-3.5 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#185F72] transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Social links in mobile menu */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-3">Follow us</p>
                    <div className="flex gap-4">
                      <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                        <Facebook className="h-5 w-5 text-[#185F72] hover:opacity-70 transition-opacity" />
                      </Link>
                      <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                        <Instagram className="h-5 w-5 text-[#185F72] hover:opacity-70 transition-opacity" />
                      </Link>
                      <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
                        <svg
                          className="h-5 w-5 text-[#185F72] hover:opacity-70 transition-opacity"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
