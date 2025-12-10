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

  // Well Wishes - Congratulations
  {
    id: 21,
    image: "/well-wishes-cards/congrats-balloons.png",
    name: "Congrats Balloons",
    category: "well-wishes",
    subcategory: "congratulations",
  },
  // Well Wishes - Good Luck
  {
    id: 22,
    image: "/well-wishes-cards/good-luck.png",
    name: "Good Luck",
    category: "well-wishes",
    subcategory: "good-luck",
  },
  // Well Wishes - New Baby
  {
    id: 23,
    image: "/well-wishes-cards/welcome-baby.png",
    name: "Welcome Baby",
    category: "well-wishes",
    subcategory: "new-baby",
  },
  // Well Wishes - New Home
  {
    id: 24,
    image: "/well-wishes-cards/happy-new-home.png",
    name: "Happy New Home",
    category: "well-wishes",
    subcategory: "new-home",
  },
  // Well Wishes - Thank You
  {
    id: 25,
    image: "/well-wishes-cards/thank-you.png",
    name: "Thank You",
    category: "well-wishes",
    subcategory: "thank-you",
  },

  // Seasonal - Easter
  {
    id: 37,
    image: "/seasonal-cards/easter-bunny-tulips.png",
    name: "Happy Easter",
    category: "seasonal",
    subcategory: "easter",
  },
  // Seasonal - Mother's Day
  {
    id: 38,
    image: "/seasonal-cards/mothers-day-breakfast.png",
    name: "Mother's Day",
    category: "seasonal",
    subcategory: "mothers-day",
  },
  // Seasonal - Father's Day
  {
    id: 39,
    image: "/seasonal-cards/fathers-day-breakfast.png",
    name: "Father's Day",
    category: "seasonal",
    subcategory: "fathers-day",
  },
  // Seasonal - Christmas
  {
    id: 40,
    image: "/seasonal-cards/christmas-tree-gifts.png",
    name: "Christmas Tree",
    category: "seasonal",
    subcategory: "christmas",
  },
  {
    id: 41,
    image: "/seasonal-cards/christmas-santa-hat-lights.png",
    name: "Santa Hat",
    category: "seasonal",
    subcategory: "christmas",
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
    "new-baby": "New Baby",
    "new-home": "New Home",
    "thank-you": "Thank You",
    christmas: "Christmas",
    halloween: "Halloween",
    easter: "Easter",
    valentines: "Valentines",
    "mothers-day": "Mother's Day",
    "fathers-day": "Father's Day",
    anniversary: "Anniversary",
    "love-romance": "Love & Romance",
    wedding: "Wedding",
  }
  return titles[subcategory] || subcategory
}
