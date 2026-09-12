-- Schéma initial pour Our Meal Project
-- À exécuter une fois sur la base alwaysdata (mymeal_data)

CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_date DATE,
  likes TEXT,
  dislikes TEXT,
  diet VARCHAR(100),
  allergies TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  week_start DATE,
  content JSON,
  status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  ingredients TEXT,
  instructions TEXT,
  source_menu_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS menu_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  UNIQUE KEY unique_menu_favorite (menu_id)
);

CREATE TABLE IF NOT EXISTS menu_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  rating TINYINT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);
