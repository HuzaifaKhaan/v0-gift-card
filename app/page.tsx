"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import type { CardTemplate } from "@/lib/card-service"

export default function Home() {
  const [featuredCards, setFeaturedCards] = useState<CardTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch("/api/cards")
        const data = await response.json()
        if (data.cards) {
          setFeaturedCards(data.cards.slice(0, 4))
        }
      } catch (error) {
        console.error("[v0] Error fetching cards:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCards()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-20">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance">
              Send something <span className="text-[#F6664C]">meaningful</span>
            </h1>
            <p className="mb-6 sm:mb-8 max-w-xl text-sm sm:text-base md:text-lg text-gray-700 text-pretty mx-auto lg:mx-0 leading-relaxed">
              LastMinuteCards allows you to design a digital card, attach an optional cash gift and send it instantly.
              Meaningful, even at the last minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-[#F6664C] hover:bg-[#E55540] text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Create Your Own
                </Button>
              </Link>
              <Link href="/customize">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#185F72] text-[#185F72] hover:bg-[#185F72] hover:text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95 w-full sm:w-auto bg-transparent"
                >
                  Discover Our Cards
                </Button>
              </Link>
            </div>
          </div>

          {/* Right illustration */}
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <Image
              src="/images/banner-card.png"
              alt="Birthday card illustration showing a bistro happy birthday card with green envelope"
              width={512}
              height={512}
              priority
              style={{ width: "auto", height: "auto" }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F5] py-12 sm:py-16 md:py-24" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10 max-w-6xl mx-auto">
            {/* Step 1: Choose a card */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 mb-3 sm:mb-4 md:mb-6 flex items-center justify-center bg-[#FFE5E0] rounded-full transition-all group-hover:scale-110 group-hover:shadow-lg">
                <svg
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48 12H16C13.7909 12 12 13.7909 12 16V40C12 42.2091 13.7909 44 16 44H48C50.2091 44 52 42.2091 52 40V16C52 13.7909 50.2091 12 48 12Z"
                    fill="#F6664C"
                  />
                  <path d="M20 20H44M20 28H36M20 36H40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="48" cy="48" r="10" fill="#185F72" />
                  <path
                    d="M44 48L47 51L52 46"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Choose a card</h3>
              <p className="text-xs sm:text-sm text-gray-700 text-balance">
                Browse our digital designs and pick the perfect card for any moment.
              </p>
            </div>

            {/* Step 2: Add your personal touch */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 mb-3 sm:mb-4 md:mb-6 flex items-center justify-center bg-[#FFE5E0] rounded-full transition-all group-hover:scale-110 group-hover:shadow-lg">
                <svg
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="12" y="16" width="40" height="36" rx="2" fill="#F6664C" />
                  <circle cx="20" cy="26" r="3" fill="white" />
                  <path
                    d="M14 44L22 36L28 42L38 32L50 44"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M28 20H44M28 26H40" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="48" cy="48" r="8" fill="#185F72" />
                  <path d="M44 48H52M48 44V52" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                Add your personal touch
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 text-balance">
                Write your message and (if you like) add a photo or video to make it feel extra special.
              </p>
            </div>

            {/* Step 3: Add a cash gift (optional) */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 mb-3 sm:mb-4 md:mb-6 flex items-center justify-center bg-[#FFE5E0] rounded-full transition-all group-hover:scale-110 group-hover:shadow-lg">
                <svg
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48 16H16C13.7909 16 12 17.7909 12 20V34L32 42L52 34V20C52 17.7909 50.2091 16 48 16Z"
                    fill="#F6664C"
                  />
                  <path
                    d="M12 34V44C12 46.2091 13.7909 48 16 48H48C50.2091 48 52 46.2091 52 44V34L32 42L12 34Z"
                    fill="#185F72"
                  />
                  <circle cx="32" cy="28" r="6" fill="white" />
                  <path
                    d="M32 25V31M29.5 26.5C29.5 25.6716 30.1716 25 31 25H32.5C33.3284 25 34 25.6716 34 26.5C34 27.3284 33.3284 28 32.5 28H31.5C30.6716 28 30 28.6716 30 29.5C30 30.3284 30.6716 31 31.5 31H33C33.8284 31 34.5 30.3284 34.5 29.5"
                    stroke="#185F72"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Add a cash gift</h3>
              <p className="text-xs sm:text-sm text-gray-700 text-balance">
                Attach a cash gift to the card safely and securely using Stripe. The amount is kept hidden until the big
                reveal!
              </p>
            </div>

            {/* Step 4: Send! */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 mb-3 sm:mb-4 md:mb-6 flex items-center justify-center bg-[#FFE5E0] rounded-full transition-all group-hover:scale-110 group-hover:shadow-lg">
                <svg
                  className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48 20H16C13.7909 20 12 21.7909 12 24V38L32 46L52 38V24C52 21.7909 50.2091 20 48 20Z"
                    fill="#185F72"
                  />
                  <path
                    d="M12 38V48C12 50.2091 13.7909 52 16 52H48C50.2091 52 52 50.2091 52 48V38L32 42L12 38Z"
                    fill="#F6664C"
                  />
                  <path d="M32 20L28 12H22L26 20H32ZM32 20L36 12H42L38 20H32Z" fill="#F6664C" />
                  <path
                    d="M20 32L32 24L44 32"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M32 24V40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Send!</h3>
              <p className="text-xs sm:text-sm text-gray-700 text-balance">
                Send the digital card to your loved one via email or simply send the shareable link and unique code via
                text/messaging apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
            Featured Card Designs
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#185F72]" />
            </div>
          ) : featuredCards.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
              {featuredCards.map((card) => (
                <div
                  key={card.id}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 bg-white transform hover:scale-105"
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={card.image_url || "/placeholder.svg"}
                      alt={card.name}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-2 sm:p-4">
                      <p className="text-white font-semibold text-xs sm:text-sm">{card.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No cards available yet</p>
          )}

          {/* View More Button */}
          <div className="flex justify-center">
            <Link href="/customize">
              <Button
                size="lg"
                className="bg-[#F6664C] hover:bg-[#E55540] text-white font-semibold px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                View More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F5] py-12 sm:py-16 md:py-24" id="about">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-16 max-w-6xl mx-auto">
            {/* Left Illustration */}
            <div className="flex-1 flex justify-center lg:justify-start w-full">
              <Image
                src="/images/logo-color.png"
                alt="LastMinuteCards Logo"
                width={512}
                height={512}
                className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-auto"
              />
            </div>

            {/* Right Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                About <span className="text-[#F6664C]">LastMinuteCards</span>
              </h2>

              <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                <p>
                  LastMinuteCards was an idea born from real life. I come from a big family (I'm one of six!) and I was
                  always forgetting birthdays and scrambling for a last-minute card and some cash.
                </p>
                <p>
                  It felt rushed, impersonal and honestly boring. So, I created LastMinuteCards, a faster, more
                  thoughtful way to send something that feels personal, meaningful while staying convenient.
                </p>
                <p>
                  No queues, no stamps, no generic cards. Just beautiful digital designs, your own heartfelt message and
                  optional cash gift delivered instantly.
                </p>
                <p className="font-semibold text-gray-900">
                  Whether it's a birthday, anniversary, congratulations, thank you or anything in between, we've got you
                  covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-[#FFF7F5]" id="faq">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-balance">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
                Got questions? We've got answers. Find everything you need to know about LastMinuteCards.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <AccordionItem value="item-1" className="border-b border-gray-200 last:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        How do I attach a cash gift?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        To attach a cash gift (you can send a card without cash too!), simply choose the amount you'd
                        like to add in the card design page. It's free to send cash and your money is kept safe using
                        Stripe to handle payments.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-b border-gray-200 last:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        How does the recipient receive the money?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        Your loved one will be able to claim the money you've attached to the card once they've opened
                        the card. They'll need to enter a unique code (you'll have this in your email), bank details and
                        the money will be released into their bank!
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-b border-gray-200 md:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        What if the recipient doesn't receive the card?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        The card will be sent to the recipient's email. If the email was incorrect, don't worry! Nobody
                        can open the card without the unique code, and you can always just share the link you get after
                        checkout with them via text/messaging apps!
                      </AccordionContent>
                    </AccordionItem>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <AccordionItem value="item-4" className="border-b border-gray-200 last:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        What if the recipient enters the wrong bank details?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        Unfortunately, if the recipient enters the wrong bank details, LastMinuteCards is not
                        responsible for losses due to this. This is stated in the Terms of Service, however we try our
                        best to prevent this from happening.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border-b border-gray-200 last:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        Can I personalise my card?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        Yes! All cards are customisable. You can either use one of our designs and add your own
                        name/message, or you can create your own card using an image of your choice.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border-b border-gray-200 last:border-0">
                      <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-[#F6664C] hover:no-underline py-4 sm:py-5 transition-colors">
                        Is my payment secure?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                        All payments are processed securely through Stripe, one of the world's most trusted payment
                        platforms. Your financial information is encrypted and never stored on our servers.
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </div>
              </Accordion>
            </div>

            {/* CTA Section */}
            <div className="mt-8 sm:mt-12 text-center bg-gradient-to-r from-[#185F72] to-[#2A7A8F] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 text-balance">
                Still have questions?
              </h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto text-pretty">
                We're here to help! Reach out to our support team and we'll get back to you as soon as possible.
              </p>
              <Link href="mailto:support@lastminutecards.com">
                <Button
                  size="lg"
                  className="bg-[#F6664C] hover:bg-[#E55540] text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-lg transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
