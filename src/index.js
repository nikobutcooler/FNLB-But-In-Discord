import "dotenv/config";
import { Client, GatewayIntentBits, Events, ActivityType } from "discord.js";
import { FnlbApi, FnlbApiError } from "./api.js";
import { embed } from "./commands.js";
for (const k of ["DISCORD_TOKEN","DISCORD_CLIENT_ID","FNLB_API_KEY"]) if(!process.env[k]) throw Error("Missing "+k+" in .env");
const client=new Client({intents:[GatewayIntentBits.Guilds]});
const api=new FnlbApi();
const val=(v,d="—")=>v===undefined||v===null||v===""?d:typeof v==="object"?JSON.stringify(v):String(v);
const apiError=e=>[e.code? "**"+e.code+"** — ":"",e.message,e.requiredScope?"\nRequired scope: `"+e.requiredScope+"`":"",e.retryAfter?"\nRetry after "+e.retryAfter+"s.":"",e.requestId?"\nRequest ID: `"+e.requestId+"`":""].join("");
async function findBot(input){const bots=await api.listBots();return bots.find(b=>b.id===input||b.name?.toLowerCase()===input.toLowerCase());}
client.once(Events.ClientReady,c=>{console.log("Ready: "+c.user.tag);c.user.setActivity("FN LobbyBots",{type:ActivityType.Watching});});
client.on(Events.InteractionCreate,async i=>{
 try {
  if(i.isAutocomplete()){if(i.options.getFocused(true).name!=="bot")return i.respond([]);const q=i.options.getFocused().toLowerCase();const bs=await api.listBots();return i.respond(bs.filter(b=>(b.name+" "+b.id).toLowerCase().includes(q)).slice(0,25).map(b=>({name:(b.name||b.id)+" · "+(b.state||"unknown"),value:b.id})).map(x=>({...x,name:x.name.slice(0,100)})));}
  if(!i.isChatInputCommand())return;
  const n=i.commandName;await i.deferReply({ephemeral:["setup","status"].includes(n)});
  if(n==="help")return i.editReply({embeds:[embed("FNLB commands","**General**: `/setup` `/status` `/bots` `/bot` `/help`\n**Party**: `/party` `/kick` `/promote` `/invite` `/join` `/hide` `/show` `/leave`\n**Friends**: `/friends` `/requests` `/addfriend` `/removefriend` `/block` `/unblock`\n**Power**: `/start` `/stop` `/restart`\n**Cosmetics**: `/skin` `/emote` `/backpack` `/pickaxe` `/shoes` `/sidekick` `/banner`")]});
  if(n==="setup"||n==="status"){const bs=await api.listBots();return i.editReply({embeds:[embed("Connected",`Found ${bs.length} bot(s).`,0x57F287)]});}
  if(n==="bots"){const bs=await api.listBots();return i.editReply({embeds:[embed("Your bots ("+bs.length+")",bs.length?bs.slice(0,25).map((b,j)=>`${j+1}. **${b.name||b.id}** · ${b.state||"unknown"} · \`${b.id}\``).join("\n"):"No bots found.") ]});}
  const input=i.options.getString("bot"), b=await findBot(input);
  if(!b)return i.editReply({embeds:[embed("Bot not found","Try selecting it from the bot autocomplete list.",0xED4245)]});
  const id=b.id;
  if(n==="bot"){const d=await api.getBot(id),c=d.cosmetics||{},p=d.party||{};return i.editReply({embeds:[embed(d.name||id,[`**ID:** ${val(d.id)}`,`**State:** ${val(d.state)}`,`**Locked:** ${val(d.locked)}`,`**Friends:** ${val(d.friend_count)}`,`**Party:** ${val(p.size,0)}/${val(p.max_size,16)}`,`**Skin:** ${val(c.skin)}`,`**Emote:** ${val(c.emote)}`,`**Can matchmaking:** ${val(d.account?.can_matchmake)}`].join("\n"))]});}
  if(n==="party"){const p=await api.getParty(id),ms=p.members||p.players||[];return i.editReply({embeds:[embed((b.name||id)+" • Party",ms.length?ms.slice(0,25).map((m,j)=>`${j+1}. **${m.display_name||m.username||m.name||m.account_id||"Unknown"}**${m.is_leader?" 👑":""}`).join("\n"):"No party members returned.")]});}
  if(n==="friends"){const fs=await api.getFriends(id);return i.editReply({embeds:[embed((b.name||id)+" • Friends ("+fs.length+")",fs.slice(0,25).map((f,j)=>`${j+1}. **${f.display_name||f.username||f.name||f.account_id||"Unknown"}**`).join("\n")||"No friends returned.")]});}
  if(["start","stop","restart"].includes(n)){await api.power(id,n);return i.editReply({embeds:[embed(b.name||id,`Sent: **${n}**`,0x57F287)]});}
  if(["skin","emote","backpack","pickaxe","shoes","sidekick","banner"].includes(n)){const v=i.options.getString("value");await api.cosmetic(id,n,v);return i.editReply({embeds:[embed("Cosmetic request sent",`Requested ${n}: \`${v}\` for **${b.name||id}**.`,0x57F287)]});}
  if(["kick","promote","invite","join","hide","show"].includes(n)){const p=i.options.getString("player");await api.partyAction(id,n,{username:p,account_id:p});return i.editReply({embeds:[embed("Party action sent",`Requested **${n}** for \`${p}\`.`,0x57F287)]});}
  if(n==="leave"){await api.partyAction(id,"leave");return i.editReply({embeds:[embed(b.name||id,"Left the party.",0x57F287)]});}
  if(["addfriend","removefriend","block","unblock"].includes(n)){const p=i.options.getString("player"),a=n==="addfriend"?"add":n==="removefriend"?"remove":n;await api.friendAction(id,a,{username:p,account_id:p});return i.editReply({embeds:[embed(b.name||id,`Friends: **${n}** · \\`${p}\\``,0x57F287)]});}
  if(n==="requests"){const {data}=await api.request(`/bots/${encodeURIComponent(id)}/friend-requests`);const rs=data.data||data.requests||[];return i.editReply({embeds:[embed("Friend requests",rs.map((r,j)=>`${j+1}. ${r.display_name||r.username||r.account_id}`).join("\n")||"No requests returned.")]});}
 } catch(e){console.error(e);const msg=e instanceof FnlbApiError?apiError(e):e.message;return i.editReply({embeds:[embed("Something went wrong",msg,0xED4245)]}).catch(()=>{});}
});
client.login(process.env.DISCORD_TOKEN);
