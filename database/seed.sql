INSERT INTO movies (title, slug, description, duration_minutes, classification, trailer_url, poster_url, is_active)
VALUES
('Moonlight Gallery', 'moonlight-gallery', 'An intimate story of an artist reclaiming memory through cinema.', 112, '+13', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', 1),
('The Last Frame', 'the-last-frame', 'A suspenseful noir set in a forgotten projection room.', 98, '+16', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c', 1);

INSERT INTO showtimes (movie_id, show_date, show_time, total_seats, status)
VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', 10, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '21:00:00', 10, 'limited'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:30:00', 10, 'available');

INSERT INTO seats (showtime_id, seat_number, is_booked)
VALUES
(1,1,0),(1,2,0),(1,3,0),(1,4,1),(1,5,0),(1,6,0),(1,7,1),(1,8,0),(1,9,0),(1,10,0),
(2,1,1),(2,2,1),(2,3,1),(2,4,0),(2,5,0),(2,6,1),(2,7,1),(2,8,0),(2,9,0),(2,10,0),
(3,1,0),(3,2,0),(3,3,0),(3,4,0),(3,5,0),(3,6,0),(3,7,0),(3,8,0),(3,9,0),(3,10,0);

INSERT INTO events (title, description, event_type, event_date, event_time, capacity, available_seats, image_url, is_active)
VALUES
('Sketch & Chill', 'Relaxed drawing session with live ambient music.', 'drawing', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00:00', 24, 11, 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b', 1),
('Visual Storytelling Workshop', 'Hands-on workshop for cinematic storytelling in mixed media.', 'workshop', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '17:00:00', 18, 9, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', 1),
('Creative Lounge Night', 'Networking and open talks for artists and film lovers.', 'lounge', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '20:00:00', 30, 22, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7', 1);

INSERT INTO settings (
  phone_number,
  whatsapp_number,
  hero_badge,
  hero_title_line_1,
  hero_title_line_2,
  hero_title_line_3,
  hero_description
)
VALUES (
  '+201001112223',
  '+201001112223',
  'ROWAIDA ART EXPERIENCE',
  'مساحة فنية راقية',
  'تجمع السينما والفعاليات',
  'بطابع مختلف تمامًا',
  'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'
);
