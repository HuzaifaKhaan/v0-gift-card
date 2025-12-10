// Card templates organized by category and subcategory
export interface CardTemplate {
  id: number
  image: string
  name: string
  category: string
  subcategory: string
}

export const cardTemplates: CardTemplate[] = [
  // Birthdays - Funny cards
  {
    id: 16,
    image: "/birthday-cards/birthday-18-yay.png",
    name: "18 Yay!",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 17,
    image: "/birthday-cards/birthday-drinks-cheers.png",
    name: "Birthday Cheers",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 18,
    image: "/birthday-cards/birthday-watch-beer.png",
    name: "Watch & Beer",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 19,
    image: "/birthday-cards/birthday-balloons.png",
    name: "Happy Balloons",
    category: "birthdays",
    subcategory: "funny-cards",
  },
  {
    id: 20,
    image: "/birthday-cards/birthday-makeup-bag.png",
    name: "Makeup & Bag",
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
    name: "Halloween Cat",
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

  // Love and Relationships - Anniversary
  {
    id: 67,
    image: "/love-relationship-cards/anniversary-collection.png",
    name: "Anniversary Collection",
    category: "love-relationships",
    subcategory: "anniversary",
  },
  // Love and Relationships - Valentine's Day
  {
    id: 68,
    image: "/love-relationship-cards/happy-valentines.png",
    name: "Happy Valentines",
    category: "love-relationships",
    subcategory: "valentines",
  },
  // Love and Relationships - Love & Romance
  {
    id: 69,
    image: "/love-relationship-cards/i-love-you-heart-hands.png",
    name: "I Love You",
    category: "love-relationships",
    subcategory: "love-romance",
  },
  {
    id: 70,
    image: "/love-relationship-cards/youre-my-lobster.png",
    name: "You're My Lobster",
    category: "love-relationships",
    subcategory: "love-romance",
  },
  // Love and Relationships - Wedding
  {
    id: 71,
    image: "/love-relationship-cards/wedding-day.png",
    name: "Wedding Day",
    category: "love-relationships",
    subcategory: "wedding",
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
    "love-relationships": "Love and Relationships",
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
    anniversary: "Anniversary",
    "love-romance": "Love & Romance",
    wedding: "Wedding",
  }
  return titles[subcategory] || subcategory
}
