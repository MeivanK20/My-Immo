-- Sample properties seed data

INSERT INTO properties (agent_id, title, description, price, region, city, neighborhood, property_type, bedrooms, bathrooms, area, images, created_at)
VALUES
  (NULL, 'Appartement moderne à Bastos', 'Bel appartement de 3 chambres proche commerces', 45000000, 'Centre', 'Yaoundé', 'Bastos', 'apartment', 3, 2, 120, '["https://images.unsplash.com/photo-1560448075-c1f9e0f3c3a6?w=800&q=80"]', NOW()),
  (NULL, 'Villa familiale à Akwa', 'Grande villa avec jardin et piscine', 180000000, 'Littoral', 'Douala', 'Akwa', 'house', 5, 4, 450, '["https://images.unsplash.com/photo-1572120360610-d971b9b8d6a2?w=800&q=80"]', NOW())
ON CONFLICT DO NOTHING;
