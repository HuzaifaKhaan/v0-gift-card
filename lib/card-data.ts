// Card templates organized by category and subcategory
export interface CardTemplate {
  id: number
  image: string
  name: string
  category: string
  subcategory: string
}

export const cardTemplates: CardTemplate[] = [
  // Birthdays - Number cards
  {
    id: 1,
    image: "/birthday-number-1-colorful-celebration.jpg",
    name: "Number 1 Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },
  {
    id: 2,
    image: "/birthday-number-18-gold-balloons.jpg",
    name: "18th Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },
  {
    id: 3,
    image: "/birthday-number-21-sparkles-celebration.jpg",
    name: "21st Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },
  {
    id: 4,
    image: "/birthday-number-30-elegant-gold.jpg",
    name: "30th Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },
  {
    id: 5,
    image: "/birthday-number-40-purple-confetti.jpg",
    name: "40th Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },
  {
    id: 6,
    image: "/birthday-number-50-golden-celebration.jpg",
    name: "50th Birthday",
    category: "birthdays",
    subcategory: "number-cards",
  },

  // Birthdays - Photo cards
  {
    id: 7,
    image: "/birthday-photo-frame-flowers-elegant.jpg",
    name: "Floral Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },
  {
    id: 8,
    image: "/birthday-photo-frame-balloons-party.jpg",
    name: "Balloon Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },
  {
    id: 9,
    image: "/birthday-photo-frame-confetti-colorful.jpg",
    name: "Confetti Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },
  {
    id: 10,
    image: "/birthday-photo-frame-stars-gold.jpg",
    name: "Stars Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },
  {
    id: 11,
    image: "/birthday-photo-frame-elegant-minimalist.jpg",
    name: "Minimalist Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },
  {
    id: 12,
    image: "/birthday-photo-frame-cute-hearts.jpg",
    name: "Hearts Photo Frame",
    category: "birthdays",
    subcategory: "photo-cards",
  },

  // Birthdays - Funny cards
  { id: 13, image: "/funny-birthday-card-cat-party-hat.jpg", name: "Party Cat", category: "birthdays", subcategory: "funny-cards" },
  {
    id: 14,
    image: "/funny-birthday-card-old-age-joke.jpg",
    name: "Getting Older",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 15,
    image: "/funny-birthday-card-dog-cake.jpg",
    name: "Dog & Cake",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 16,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wine Time",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 17,
    image: "/placeholder.svg?height=400&width=300",
    name: "Sarcastic Wishes",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 18,
    image: "/placeholder.svg?height=400&width=300",
    name: "Party Llama",
    category: "birthdays",
    subcategory: "funny-cards",
  },

  // Well Wishes - Congratulations
  {
    id: 19,
    image: "/placeholder.svg?height=400&width=300",
    name: "Gold Confetti",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  {
    id: 20,
    image: "/placeholder.svg?height=400&width=300",
    name: "Star Achievement",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  {
    id: 21,
    image: "/placeholder.svg?height=400&width=300",
    name: "Trophy Winner",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  {
    id: 22,
    image: "/placeholder.svg?height=400&width=300",
    name: "Fireworks",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  {
    id: 23,
    image: "/placeholder.svg?height=400&width=300",
    name: "Champagne Toast",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  {
    id: 24,
    image: "/placeholder.svg?height=400&width=300",
    name: "Celebration Balloons",
    category: "well-wishes",
    subcategory: "congratulations",
  },

  // Well Wishes - Good luck
  {
    id: 25,
    image: "/placeholder.svg?height=400&width=300",
    name: "Four Leaf Clover",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  {
    id: 26,
    image: "/placeholder.svg?height=400&width=300",
    name: "Lucky Horseshoe",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  {
    id: 27,
    image: "/placeholder.svg?height=400&width=300",
    name: "Rainbow Wishes",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  {
    id: 28,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wishing Well",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  {
    id: 29,
    image: "/placeholder.svg?height=400&width=300",
    name: "Fingers Crossed",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  {
    id: 30,
    image: "/placeholder.svg?height=400&width=300",
    name: "Lucky Ladybug",
    category: "well-wishes",
    subcategory: "good-luck",
  },

  // Well Wishes - Treat yourself
  {
    id: 31,
    image: "/placeholder.svg?height=400&width=300",
    name: "Spa Day",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },
  {
    id: 32,
    image: "/placeholder.svg?height=400&width=300",
    name: "Shopping Spree",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },
  {
    id: 33,
    image: "/placeholder.svg?height=400&width=300",
    name: "Self Care",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },
  {
    id: 34,
    image: "/placeholder.svg?height=400&width=300",
    name: "Coffee Break",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },
  {
    id: 35,
    image: "/placeholder.svg?height=400&width=300",
    name: "Sweet Treat",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },
  {
    id: 36,
    image: "/placeholder.svg?height=400&width=300",
    name: "You Deserve It",
    category: "well-wishes",
    subcategory: "treat-yourself",
  },

  // Seasonal - Christmas
  {
    id: 37,
    image: "/merry-bright-christmas-wreath-red-green-holly.jpg",
    name: "Christmas Wreath",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 38,
    image: "/holiday-wreath-festive-christmas-card.jpg",
    name: "Holiday Wreath",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 39,
    image: "/christmas-red-wreath-holly-berries-card.jpg",
    name: "Holly Berries",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 40,
    image: "/green-christmas-wreath-winter-holiday-card.jpg",
    name: "Green Wreath",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 41,
    image: "/placeholder.svg?height=400&width=300",
    name: "Christmas Tree",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 42,
    image: "/placeholder.svg?height=400&width=300",
    name: "Santa Claus",
    category: "seasonal",
    subcategory: "christmas",
  },

  // Seasonal - Halloween
  {
    id: 43,
    image: "/halloween-greeting-card-orange-plaid-black-cat.jpg",
    name: "Black Cat",
    category: "seasonal",
    subcategory: "halloween",
  },
  {
    id: 44,
    image: "/halloween-spooky-sweet-pumpkin-card.jpg",
    name: "Spooky Pumpkin",
    category: "seasonal",
    subcategory: "halloween",
  },
  {
    id: 45,
    image: "/placeholder.svg?height=400&width=300",
    name: "Witch Night",
    category: "seasonal",
    subcategory: "halloween",
  },
  {
    id: 46,
    image: "/placeholder.svg?height=400&width=300",
    name: "Cute Ghost",
    category: "seasonal",
    subcategory: "halloween",
  },
  {
    id: 47,
    image: "/placeholder.svg?height=400&width=300",
    name: "Haunted House",
    category: "seasonal",
    subcategory: "halloween",
  },
  {
    id: 48,
    image: "/placeholder.svg?height=400&width=300",
    name: "Skeleton Party",
    category: "seasonal",
    subcategory: "halloween",
  },

  // Seasonal - Easter
  {
    id: 49,
    image: "/placeholder.svg?height=400&width=300",
    name: "Easter Bunny",
    category: "seasonal",
    subcategory: "easter",
  },
  {
    id: 50,
    image: "/placeholder.svg?height=400&width=300",
    name: "Easter Eggs",
    category: "seasonal",
    subcategory: "easter",
  },
  {
    id: 51,
    image: "/placeholder.svg?height=400&width=300",
    name: "Spring Flowers",
    category: "seasonal",
    subcategory: "easter",
  },
  {
    id: 52,
    image: "/placeholder.svg?height=400&width=300",
    name: "Cute Chick",
    category: "seasonal",
    subcategory: "easter",
  },
  {
    id: 53,
    image: "/placeholder.svg?height=400&width=300",
    name: "Easter Basket",
    category: "seasonal",
    subcategory: "easter",
  },
  {
    id: 54,
    image: "/placeholder.svg?height=400&width=300",
    name: "Spring Lamb",
    category: "seasonal",
    subcategory: "easter",
  },

  // Seasonal - Valentines
  {
    id: 55,
    image: "/placeholder.svg?height=400&width=300",
    name: "Red Hearts",
    category: "seasonal",
    subcategory: "valentines",
  },
  {
    id: 56,
    image: "/placeholder.svg?height=400&width=300",
    name: "Roses",
    category: "seasonal",
    subcategory: "valentines",
  },
  {
    id: 57,
    image: "/placeholder.svg?height=400&width=300",
    name: "Love Letter",
    category: "seasonal",
    subcategory: "valentines",
  },
  {
    id: 58,
    image: "/placeholder.svg?height=400&width=300",
    name: "Cupid",
    category: "seasonal",
    subcategory: "valentines",
  },
  {
    id: 59,
    image: "/placeholder.svg?height=400&width=300",
    name: "Chocolate Box",
    category: "seasonal",
    subcategory: "valentines",
  },
  {
    id: 60,
    image: "/placeholder.svg?height=400&width=300",
    name: "Heart Balloon",
    category: "seasonal",
    subcategory: "valentines",
  },

  // Milestone Moments - New job
  {
    id: 61,
    image: "/placeholder.svg?height=400&width=300",
    name: "New Job Success",
    category: "milestone-moments",
    subcategory: "new-job",
  },
  {
    id: 62,
    image: "/placeholder.svg?height=400&width=300",
    name: "Career Promotion",
    category: "milestone-moments",
    subcategory: "new-job",
  },
  {
    id: 63,
    image: "/placeholder.svg?height=400&width=300",
    name: "Briefcase",
    category: "milestone-moments",
    subcategory: "new-job",
  },
  {
    id: 64,
    image: "/placeholder.svg?height=400&width=300",
    name: "First Day",
    category: "milestone-moments",
    subcategory: "new-job",
  },
  {
    id: 65,
    image: "/placeholder.svg?height=400&width=300",
    name: "Dream Job",
    category: "milestone-moments",
    subcategory: "new-job",
  },
  {
    id: 66,
    image: "/placeholder.svg?height=400&width=300",
    name: "You Got This",
    category: "milestone-moments",
    subcategory: "new-job",
  },

  // Milestone Moments - New baby
  {
    id: 67,
    image: "/new-baby-congratulations-blue-stork.jpg",
    name: "Blue Stork",
    category: "milestone-moments",
    subcategory: "new-baby",
  },
  {
    id: 68,
    image: "/baby-shower-pink-teddy-bear-cute.jpg",
    name: "Pink Teddy Bear",
    category: "milestone-moments",
    subcategory: "new-baby",
  },
  {
    id: 69,
    image: "/placeholder.svg?height=400&width=300",
    name: "Welcome Baby",
    category: "milestone-moments",
    subcategory: "new-baby",
  },
  {
    id: 70,
    image: "/placeholder.svg?height=400&width=300",
    name: "Baby Girl",
    category: "milestone-moments",
    subcategory: "new-baby",
  },
  {
    id: 71,
    image: "/placeholder.svg?height=400&width=300",
    name: "Baby Boy",
    category: "milestone-moments",
    subcategory: "new-baby",
  },
  {
    id: 72,
    image: "/placeholder.svg?height=400&width=300",
    name: "Twins",
    category: "milestone-moments",
    subcategory: "new-baby",
  },

  // Milestone Moments - New home
  {
    id: 73,
    image: "/placeholder.svg?height=400&width=300",
    name: "New Home Keys",
    category: "milestone-moments",
    subcategory: "new-home",
  },
  {
    id: 74,
    image: "/placeholder.svg?height=400&width=300",
    name: "Welcome Home",
    category: "milestone-moments",
    subcategory: "new-home",
  },
  {
    id: 75,
    image: "/placeholder.svg?height=400&width=300",
    name: "House Warming",
    category: "milestone-moments",
    subcategory: "new-home",
  },
  {
    id: 76,
    image: "/placeholder.svg?height=400&width=300",
    name: "First Home",
    category: "milestone-moments",
    subcategory: "new-home",
  },
  {
    id: 77,
    image: "/placeholder.svg?height=400&width=300",
    name: "Moving Day",
    category: "milestone-moments",
    subcategory: "new-home",
  },
  {
    id: 78,
    image: "/placeholder.svg?height=400&width=300",
    name: "Dream Home",
    category: "milestone-moments",
    subcategory: "new-home",
  },

  // Milestone Moments - Wedding
  {
    id: 79,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wedding Rings",
    category: "milestone-moments",
    subcategory: "wedding",
  },
  {
    id: 80,
    image: "/placeholder.svg?height=400&width=300",
    name: "Just Married",
    category: "milestone-moments",
    subcategory: "wedding",
  },
  {
    id: 81,
    image: "/placeholder.svg?height=400&width=300",
    name: "Bride & Groom",
    category: "milestone-moments",
    subcategory: "wedding",
  },
  {
    id: 82,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wedding Bouquet",
    category: "milestone-moments",
    subcategory: "wedding",
  },
  {
    id: 83,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wedding Cake",
    category: "milestone-moments",
    subcategory: "wedding",
  },
  {
    id: 84,
    image: "/placeholder.svg?height=400&width=300",
    name: "Wedding Toast",
    category: "milestone-moments",
    subcategory: "wedding",
  },

  // Milestone Moments - Retirement
  {
    id: 85,
    image: "/placeholder.svg?height=400&width=300",
    name: "Beach Retirement",
    category: "milestone-moments",
    subcategory: "retirement",
  },
  {
    id: 86,
    image: "/placeholder.svg?height=400&width=300",
    name: "Happy Retirement",
    category: "milestone-moments",
    subcategory: "retirement",
  },
  {
    id: 87,
    image: "/placeholder.svg?height=400&width=300",
    name: "Golf Time",
    category: "milestone-moments",
    subcategory: "retirement",
  },
  {
    id: 88,
    image: "/placeholder.svg?height=400&width=300",
    name: "New Adventures",
    category: "milestone-moments",
    subcategory: "retirement",
  },
  {
    id: 89,
    image: "/placeholder.svg?height=400&width=300",
    name: "Cheers",
    category: "milestone-moments",
    subcategory: "retirement",
  },
  {
    id: 90,
    image: "/placeholder.svg?height=400&width=300",
    name: "Relax Time",
    category: "milestone-moments",
    subcategory: "retirement",
  },

  // Milestone Moments - New car
  {
    id: 91,
    image: "/placeholder.svg?height=400&width=300",
    name: "Car Keys",
    category: "milestone-moments",
    subcategory: "new-car",
  },
  {
    id: 92,
    image: "/placeholder.svg?height=400&width=300",
    name: "Sports Car",
    category: "milestone-moments",
    subcategory: "new-car",
  },
  {
    id: 93,
    image: "/placeholder.svg?height=400&width=300",
    name: "Road Trip",
    category: "milestone-moments",
    subcategory: "new-car",
  },
  {
    id: 94,
    image: "/placeholder.svg?height=400&width=300",
    name: "First Car",
    category: "milestone-moments",
    subcategory: "new-car",
  },
  {
    id: 95,
    image: "/placeholder.svg?height=400&width=300",
    name: "Dream Car",
    category: "milestone-moments",
    subcategory: "new-car",
  },
  {
    id: 96,
    image: "/placeholder.svg?height=400&width=300",
    name: "New Wheels",
    category: "milestone-moments",
    subcategory: "new-car",
  },

  // Milestone Moments - Just passed
  {
    id: 97,
    image: "/placeholder.svg?height=400&width=300",
    name: "Exam Passed",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
  {
    id: 98,
    image: "/placeholder.svg?height=400&width=300",
    name: "Driving Test",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
  {
    id: 99,
    image: "/placeholder.svg?height=400&width=300",
    name: "Graduation",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
  {
    id: 100,
    image: "/placeholder.svg?height=400&width=300",
    name: "Certificate",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
  {
    id: 101,
    image: "/placeholder.svg?height=400&width=300",
    name: "A+ Grade",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
  {
    id: 102,
    image: "/placeholder.svg?height=400&width=300",
    name: "You Did It",
    category: "milestone-moments",
    subcategory: "just-passed",
  },
]

export function getCardsBySubcategory(category: string, subcategory: string): CardTemplate[] {
  return cardTemplates.filter((card) => card.category === category && card.subcategory === subcategory)
}

export function getCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    birthdays: "Birthdays",
    "well-wishes": "Well Wishes",
    seasonal: "Seasonal",
    "milestone-moments": "Milestone Moments",
  }
  return titles[category] || category
}

export function getSubcategoryTitle(subcategory: string): string {
  const titles: Record<string, string> = {
    "number-cards": "Number Cards",
    "photo-cards": "Photo Cards",
    "funny-cards": "Funny Cards",
    congratulations: "Congratulations",
    "good-luck": "Good Luck",
    "treat-yourself": "Treat Yourself",
    christmas: "Christmas",
    halloween: "Halloween",
    easter: "Easter",
    valentines: "Valentines",
    "new-job": "New Job",
    "new-baby": "New Baby",
    "new-home": "New Home",
    wedding: "Wedding",
    retirement: "Retirement",
    "new-car": "New Car",
    "just-passed": "Just Passed",
  }
  return titles[subcategory] || subcategory
}
