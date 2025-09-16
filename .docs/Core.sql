CREATE TABLE `materias` (
  `uuid` uuid PRIMARY KEY,
  `nombre` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `curso` (
  `uuid` uuid PRIMARY KEY,
  `uuid_materia` varchar(255) NOT NULL,
  `examen` varchar(255),
  `cantidad_max` integer DEFAULT 35,
  `cantidad_min` integer DEFAULT 10,
  `desde` timestamp NOT NULL,
  `hasta` timestamp NOT NULL,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `correlativas` (
  `uuid` varchar(255) PRIMARY KEY,
  `uuid_materia` varchar(255) NOT NULL,
  `uuid_materia_correlativa` varchar(255) NOT NULL
);

CREATE TABLE `inscripciones` (
  `uuid` uuid PRIMARY KEY,
  `uuid_curso` uuid NOT NULL,
  `uuid_alumno` uuid NOT NULL,
  `estado` varchar(255) COMMENT 'ej.: pendiente, confirmada, confirmada',
  `rol` varchar(255) COMMENT 'ej.: titular, adjunto, ayudante, alumno',
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `users` (
  `uuid` uuid PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255) UNIQUE,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `docentes_materia` (
  `uuid` uuid PRIMARY KEY,
  `uuid_docente` uuid NOT NULL,
  `uuid_materia` uuid NOT NULL
);

CREATE TABLE `wallets` (
  `uuid` uuid PRIMARY KEY,
  `user_id` uuid NOT NULL,
  `currency` char(3) NOT NULL,
  `status` ENUM ('active', 'blocked', 'closed') NOT NULL DEFAULT 'active',
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `transactions` (
  `uuid` uuid PRIMARY KEY,
  `wallet_uuid` uuid NOT NULL,
  `type` ENUM ('topup', 'payment', 'transfer', 'refund', 'payout') NOT NULL,
  `status` ENUM ('pending', 'posted', 'failed', 'reversed') NOT NULL DEFAULT 'pending',
  `amount` bigint NOT NULL,
  `currency` char(3) NOT NULL COMMENT 'esto deberia ser igual al wallet.currency',
  `description` varchar(255),
  `created_at` timestamp DEFAULT (now()),
  `posted_at` timestamp
);

CREATE Table `notificaciones` {
  `uuid` uuid PRIMARY KEY,
  `uuid_user` uuid NOT NULL,
  `title` varchar(25) NOT NULL,
  `body` varchar(255) NOT NULL,
  `from` varchar(20) NOT NULL,
  `read` BOOLEAN DEFAULT FALSE
}

CREATE UNIQUE INDEX `wallets_index_0` ON `wallets` (`user_id`, `currency`);

ALTER TABLE `curso` ADD FOREIGN KEY (`uuid_materia`) REFERENCES `materias` (`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `inscripciones` ADD FOREIGN KEY (`uuid_curso`) REFERENCES `curso` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `inscripciones` ADD FOREIGN KEY (`uuid_alumno`) REFERENCES `users` (`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `correlativas` ADD FOREIGN KEY (`uuid_materia`) REFERENCES `materias` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `correlativas` ADD FOREIGN KEY (`uuid_materia_correlativa`) REFERENCES `materias` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `docentes_materia` ADD FOREIGN KEY (`uuid_docente`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `docentes_materia` ADD FOREIGN KEY (`uuid_materia`) REFERENCES `materias` (`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `wallets` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `transactions` ADD FOREIGN KEY (`wallet_uuid`) REFERENCES `wallets` (`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
