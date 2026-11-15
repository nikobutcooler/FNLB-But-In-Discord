import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
const bot = c => c.addStringOption(o => o.setName("bot").setDescription("Select a bot").setRequired(true).setAutocomplete(true));
const player = c => c.addStringOption(o => o.setName("player").setDescription("Epic display name or account ID").setRequired(true));
const commands = [
  new SlashCommandBuilder().setName("help").setDescription("Show the command guide"),
  new SlashCommandBuilder().setName("setup").setDescription("Test your FNLB API connection"),
  new SlashCommandBuilder().setName("status").setDescription("Check API connectivity"),
  new SlashCommandBuilder().setName("bots").setDescription("List your bots"),
  bot(new SlashCommandBuilder().setName("bot").setDescription("Show bot details")),
  bot(new SlashCommandBuilder().setName("party").setDescription("Show party members")),
  bot(new SlashCommandBuilder().setName("friends").setDescription("List a bot's friends")),
  ...["start","stop","restart"].map(n=>bot(new SlashCommandBuilder().setName(n).setDescription(n+" a bot"))),
  ...["skin","emote","backpack","pickaxe","shoes","sidekick","banner"].map(n=>bot(new SlashCommandBuilder().setName(n).setDescription("Change bot "+n)).addStringOption(o=>o.setName("value").setDescription("Cosmetic ID").setRequired(true))),
  ...["kick","promote","invite","join","hide","show"].map(n=>player(bot(new SlashCommandBuilder().setName(n).setDescription(n+" a party member")))),
  bot(new SlashCommandBuilder().setName("leave").setDescription("Make bot leave its party")),
  ...["addfriend","removefriend","block","unblock"].map(n=>player(bot(new SlashCommandBuilder().setName(n).setDescription(n+" for a player")))),
  bot(new SlashCommandBuilder().setName("requests").setDescription("View pending friend requests"))
].map(c=>c.toJSON());
export { commands };
export const embed = (title, description, color=0x5865F2) => new EmbedBuilder().setColor(color).setTitle(title).setDescription(description || "No details returned.").setFooter({text:"FNLB • Self-hosted control panel"}).setTimestamp();
