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
  {
    id: 13,
    image: "/funny-birthday-card-cat-party-hat.jpg",
    name: "Party Cat",
    category: "birthdays",
    subcategory: "funny-cards",
  },
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
