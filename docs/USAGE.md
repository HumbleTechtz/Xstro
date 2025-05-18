# Usage Guide

This will help you understand, use, and extend the code in the `src` directory.

## Contents

1. Project Structure
2. Setup & Running
3. Core Logic Overview
4. Extending and Editing
5. File/Folder Reference
6. Contribution Guidelines

## 1. Project Structure

The bot is modular, organized by feature and responsibility:

- **media/** — Static assets (e.g., images like `logo.png`).
- **messaging/** — Core WhatsApp client, message/event handling, plugin integration.
- **models/** — Data models and business logic for bot features (anti-link, filters, groups, etc.).
- **plugins/** — Individual commands and features (anti-link, downloads, eval, group management, user tools, etc.).
- **types/** — TypeScript definitions and interfaces.
- **utils/** — Utility functions for parsing, media, scraping, chatbot, and more.

## 2. Setup & Running

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment:**

   - Add required environment variables as described in the main README.
   - Make sure all API keys and credentials are set up if needed.

3. **Start the bot:**
   ```bash
   pnpm start
   ```
   Or, for TypeScript development:
   ```bash
   pnpm dev
   ```

## 3. Core Logic Overview

### Messaging System (`src/messaging/`)

- **client.ts**: Connects to WhatsApp via Baileys.
- **bind.ts**: Binds events to handlers.
- **emit.ts**: Emits and manages custom events.
- **handlers.ts**: Handles WhatsApp events (messages, group updates, etc.).
- **paircode.ts**: Device pairing logic.
- **plugin.ts**: Loads and manages plugins.
- **serialize.ts**: Standardizes incoming message data.

### Plugins (`src/plugins/`)

- Each plugin is a TypeScript file exporting a function that receives the bot context/client and implements a command or feature (e.g., `antilink.ts`, `group.ts`, `download.ts`).
- Plugins are auto-loaded and do not require manual registration.

### Models (`src/models/`)

- Implementations of business logic for each feature (e.g., anti-link, anti-delete, filters, group management, rate limiting).
- Used by plugins to persist or process stateful data.

### Utilities (`src/utils/`)

- Reusable helpers: media conversion (`ffmpeg.mts`), scraping (`scraper.mts`), chatbots, constants, content parsing, authentication (`useSqliteAuthState.ts`), and more.

### Types (`src/types/`)

- Centralized TypeScript types and interfaces for strong typing in the codebase.

## 4. Extending and Editing

### Adding a Plugin

1. Create a new file in `src/plugins/` (e.g., `myfeature.ts`).
2. Export a function using the expected signature (see other plugins for examples).
3. Use the bot context/client to register commands or event listeners.
4. Restart the bot to load your plugin.

### Modifying Business Logic

- Update or add files in `src/models/` to change how a feature works.
- Share code by adding helpers to `src/utils/`.

### Updating Types

- Add or modify interfaces and types in `src/types/index.ts` to ensure type safety.

## 5. File/Folder Reference

Below are key files and folders. For full content, see each directory on [GitHub](https://github.com/AstroXTeam/whatsapp-bot/tree/stable/src).

### media/

- `logo.png`: Project logo.

### messaging/

- [`bind.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/bind.ts): Event bindings.
- [`client.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/client.ts): WhatsApp client connection.
- [`emit.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/emit.ts): Event emitters.
- [`handlers.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/handlers.ts): Event handlers.
- [`paircode.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/paircode.ts): Pairing logic.
- [`plugin.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/plugin.ts): Plugin system.
- [`serialize.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/messaging/serialize.ts): Message serialization.

### models/

- Files like `antidelete.ts`, `antilink.ts`, `filter.ts`, `group.ts`, `ratelimter.ts`, `settings.ts`, etc., each implement a feature’s business/data logic.
- [Browse models](https://github.com/AstroXTeam/whatsapp-bot/tree/stable/src/models)

### plugins/

- Files such as `antilink.ts`, `group.ts`, `download.ts`, `system.ts`, `fun.ts`, `filters.ts`, etc., each implement a command or bot feature.
- [Browse plugins](https://github.com/AstroXTeam/whatsapp-bot/tree/stable/src/plugins)

### types/

- [`index.ts`](https://github.com/AstroXTeam/whatsapp-bot/blob/stable/src/types/index.ts): Project-wide TypeScript types.

### utils/

- `ffmpeg.mts`: Media conversion.
- `scraper.mts`: Web scraping helpers.
- `chatbot.mts`: Chatbot integrations.
- `constants.ts`: Project-wide constants.
- `content.ts`, `extractor.ts`, `fetch.mts`, `lang.ts`, `prepareMessage.ts`, `useSqliteAuthState.ts`, etc.: Various helpers.
- [Browse utils](https://github.com/AstroXTeam/whatsapp-bot/tree/stable/src/utils)

## 6. Contribution Guidelines

1. Fork the repo and create a new branch.
2. Add or modify files under the appropriate directory.
3. Write or update tests if needed.
4. Open a pull request, describing your changes clearly.

## References

- [Xstro](https://github.com/AstroXTeam/whatsapp-bot)
- [Source Code Dir](https://github.com/AstroXTeam/whatsapp-bot/tree/stable/src)
