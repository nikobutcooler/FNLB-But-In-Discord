# FNLB in Discord

Self-host a Discord slash-command bot to control your own FN LobbyBots account through the official API.

## Features

- Browse bots, autocomplete bot names and inspect bot details
- View party members and friends
- Start, stop and restart bots
- Change skin, emote, backpack, pickaxe, shoes, sidekick and banner
- Party actions: kick, promote, invite, join, hide, show and leave
- Friend actions: add, remove, block and unblock
- Friend request overview, setup check, status and help
- API errors show codes, scopes, retry timing and request IDs

## Requirements

- Node.js 20+
- A Discord application and bot
- An FN LobbyBots API key from https://fortnitelobbybots.com/developers

## Installation

```bash
git clone https://github.com/nikobutcooler/FNLB-But-In-Discord.git
cd FNLB-But-In-Discord
npm install
cp .env.example .env
```

Fill in `.env`:
- `DISCORD_TOKEN` — bot token from Discord Developer Portal
- `DISCORD_CLIENT_ID` — application ID
- `DISCORD_GUILD_ID` — optional test server ID (guild commands update instantly)
- `FNLB_API_KEY` — your private FN LobbyBots API key

Invite the Discord bot with the `bot` and `applications.commands` scopes. Give it only the permissions needed to send messages and embeds.

Register commands and launch:

```bash
npm run register
npm start
```

## Commands

**General:** `/help`, `/setup`, `/status`, `/bots`, `/bot`

**Party:** `/party`, `/kick`, `/promote`, `/invite`, `/join`, `/hide`, `/show`, `/leave`

**Friends:** `/friends`, `/requests`, `/addfriend`, `/removefriend`, `/block`, `/unblock`

**Power:** `/start`, `/stop`, `/restart`

**Cosmetics:** `/skin`, `/emote`, `/backpack`, `/pickaxe`, `/shoes`, `/sidekick`, `/banner`

Bot options support autocomplete: type part of a bot name or ID to select it.

## API scopes

Use least privilege. Reading bots, parties and friends requires their corresponding read scopes. Power, cosmetics, party and friend actions require matching write scopes. The API still enforces plan limits and cooldowns.

## Security

Never commit or share `.env`. Keep the FNLB key on the host; it is never accepted through Discord commands. If a key leaks, revoke it from the FNLB Developers page.

API documentation: https://fortnitelobbybots.com/docs/api/overview
