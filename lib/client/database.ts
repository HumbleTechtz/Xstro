/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Database connection and configuration for the WhatsApp bot.
 * @copyright Copyright (c) 2025 AstroX11
 */

import { Database } from "bun:sqlite";

const database = new Database("database.db", { create: true, readwrite: true });

database.exec("PRAGMA journal_mode = WAL");
database.exec("PRAGMA wal_autocheckpoint = 4096");
database.exec("PRAGMA foreign_keys = ON");
database.exec("PRAGMA synchronous = OFF");

export default database;
