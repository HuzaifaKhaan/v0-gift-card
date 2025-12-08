import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1D6274] text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Connect With Us */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-white/20">
          <span className="text-base sm:text-lg font-medium">Connect With Us!</span>
          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="TikTok"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          <div className="col-span-2 lg:col-span-1 flex justify-center lg:justify-start">
            <Image
              src="/images/logo-color.png"
              alt="Last Minute Cards"
              width={160}
              height={50}
              className="h-12 sm:h-14 w-auto"
            />
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Top Categories</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/customize?category=birthdays"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Birthday
                </Link>
              </li>
              <li>
                <Link
                  href="/customize?category=well-wishes"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Well Wishes
                </Link>
              </li>
              <li>
                <Link
                  href="/customize?category=seasonal"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Seasonal
                </Link>
              </li>
              <li>
                <Link
                  href="/customize?category=milestone-moments"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Milestone Moments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Company */}
          <div className="hidden lg:block">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Our Company</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/#about"
                  className="text-white/90 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 sm:pt-8 text-center">
          <p className="text-white/80 text-xs sm:text-sm">© 2025 LastMinuteCards UK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
