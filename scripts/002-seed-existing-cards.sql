-- Seed existing cards from the static data into the database
INSERT INTO card_templates (name, image_url, category, subcategory) VALUES
  -- Birthdays - Funny cards
  ('18 Yay!', '/birthday-cards/birthday-18-yay.png', 'birthdays', 'funny-cards'),
  ('Birthday Cheers', '/birthday-cards/birthday-drinks-cheers.png', 'birthdays', 'funny-cards'),
  ('Watch & Beer', '/birthday-cards/birthday-watch-beer.png', 'birthdays', 'funny-cards'),
  ('Happy Balloons', '/birthday-cards/birthday-balloons.png', 'birthdays', 'funny-cards'),
  ('Makeup & Bag', '/birthday-cards/birthday-makeup-bag.png', 'birthdays', 'funny-cards'),

  -- Well Wishes
  ('Congrats Balloons', '/well-wishes-cards/congrats-balloons.png', 'well-wishes', 'congratulations'),
  ('Good Luck', '/well-wishes-cards/good-luck.png', 'well-wishes', 'good-luck'),
  ('Welcome Baby', '/well-wishes-cards/welcome-baby.png', 'well-wishes', 'new-baby'),
  ('Happy New Home', '/well-wishes-cards/happy-new-home.png', 'well-wishes', 'new-home'),
  ('Thank You', '/well-wishes-cards/thank-you.png', 'well-wishes', 'thank-you'),

  -- Seasonal
  ('Happy Easter', '/seasonal-cards/easter-bunny-tulips.png', 'seasonal', 'easter'),
  ('Mother''s Day', '/seasonal-cards/mothers-day-breakfast.png', 'seasonal', 'mothers-day'),
  ('Father''s Day', '/seasonal-cards/fathers-day-breakfast.png', 'seasonal', 'fathers-day'),
  ('Christmas Tree', '/seasonal-cards/christmas-tree-gifts.png', 'seasonal', 'christmas'),
  ('Santa Hat', '/seasonal-cards/christmas-santa-hat-lights.png', 'seasonal', 'christmas'),

  -- Love and Relationships
  ('Anniversary Collection', '/love-relationship-cards/anniversary-collection.png', 'love-relationships', 'anniversary'),
  ('Happy Valentines', '/love-relationship-cards/happy-valentines.png', 'love-relationships', 'valentines'),
  ('I Love You', '/love-relationship-cards/i-love-you-heart-hands.png', 'love-relationships', 'love-romance'),
  ('You''re My Lobster', '/love-relationship-cards/youre-my-lobster.png', 'love-relationships', 'love-romance'),
  ('Wedding Day', '/love-relationship-cards/wedding-day.png', 'love-relationships', 'wedding')
ON CONFLICT DO NOTHING;
