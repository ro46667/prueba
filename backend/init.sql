CREATE DATABASE IF NOT EXISTS worldcup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE worldcup;

CREATE TABLE IF NOT EXISTS matches (
  id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  team_home    VARCHAR(100)     NOT NULL,
  team_away    VARCHAR(100)     NOT NULL,
  goals_home   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  goals_away   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  match_status ENUM('Pendiente','En Curso','Finalizado') NOT NULL DEFAULT 'Pendiente',
  match_date   DATETIME         NOT NULL,
  created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_goals_home    CHECK (goals_home >= 0),
  CONSTRAINT chk_goals_away    CHECK (goals_away >= 0),
  CONSTRAINT chk_diff_teams    CHECK (team_home <> team_away)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO matches (team_home, team_away, goals_home, goals_away, match_status, match_date) VALUES
  ('Argentina',    'Arabia Saudita', 1, 2, 'Finalizado', '2022-11-22 10:00:00'),
  ('Francia',      'Australia',      4, 1, 'Finalizado', '2022-11-22 19:00:00'),
  ('Brasil',       'Serbia',         2, 0, 'Finalizado', '2022-11-24 19:00:00'),
  ('Países Bajos', 'Argentina',      2, 2, 'Finalizado', '2022-12-09 16:00:00'),
  ('Argentina',    'Croacia',        3, 0, 'Finalizado', '2022-12-13 20:00:00'),
  ('Argentina',    'Francia',        3, 3, 'Finalizado', '2022-12-18 16:00:00');
