# FNLB Discord Bot

A small Discord bot for managing your FN LobbyBots. Run it yourself and connect it to your FNLB API key.

## What it can do

- List your bots and check their details
- See who's in a bot's party or friend list
- Start, stop and restart bots
- Change bot cosmetics
- Manage party members and friends
- Check pending friend requests

## You need

- Node.js 20 or newer
- A Discord bot application
- An FN LobbyBots API key: https://fortnitelobbybots.com/developers

## Set it up

```bash
git clone https://github.com/nikobutcooler/FNLB-But-In-Discord.git
cd FNLB-But-In-Discord
npm install
cp .env.example .env
```

Open `.env` and add:

- `DISCORD_TOKEN` — your bot token
- `DISCORD_CLIENT_ID` — your Discord application ID
- `FNLB_API_KEY` — your FN LobbyBots API key
- `DISCORD_GUILD_ID` — optional; set this to test commands in one server

Invite the bot with the `bot` and `applications.commands` scopes. It only needs permission to send messages and embeds.

Then run:

```bash
npm run register
npm start
```

## Commands

**General:** `/help` `/setup` `/status` `/bots` `/bot`

**Party:** `/party` `/kick` `/promote` `/invite` `/join` `/hide` `/show` `/leave`

**Friends:** `/friends` `/requests` `/addfriend` `/removefriend` `/block` `/unblock`

**Bot controls:** `/start` `/stop` `/restart`

**Cosmetics:** `/skin` `/emote` `/backpack` `/pickaxe` `/shoes` `/sidekick` `/banner`

Start typing a bot's name in the `bot` option to use autocomplete.

## A few notes

Your API key stays in your local `.env` file. Don't post it or commit it to GitHub. The API key also needs the right scopes for the commands you want to use, and FNLB plan limits still apply.

API docs: https://fortnitelobbybots.com/docs/api/overview
