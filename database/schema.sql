CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  classification ENUM('G', '+13', '+16', '+18') NOT NULL DEFAULT 'G',
  trailer_url VARCHAR(500) NOT NULL,
  poster_url VARCHAR(500) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  total_seats INT NOT NULL DEFAULT 10,
  status ENUM('available', 'limited', 'full', 'closed') NOT NULL DEFAULT 'available',
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  seat_number INT NOT NULL,
  is_booked TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_showtime_seat (showtime_id, seat_number),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_type ENUM('drawing', 'workshop', 'seminar', 'lounge') NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  capacity INT NOT NULL,
  available_seats INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone_number VARCHAR(50) NOT NULL,
  whatsapp_number VARCHAR(50) NOT NULL,
  hero_badge VARCHAR(255) NOT NULL DEFAULT 'ROWAIDA ART EXPERIENCE',
  hero_title_line_1 VARCHAR(255) NOT NULL DEFAULT 'مساحة فنية راقية',
  hero_title_line_2 VARCHAR(255) NOT NULL DEFAULT 'تجمع السينما والفعاليات',
  hero_title_line_3 VARCHAR(255) NOT NULL DEFAULT 'بطابع مختلف تمامًا',
  hero_description TEXT NOT NULL DEFAULT 'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'
);
