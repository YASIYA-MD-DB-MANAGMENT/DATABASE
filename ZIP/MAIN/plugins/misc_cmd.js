const util = require("util");
const { cmd } = require('../command');
const config = require("../config");
const { getGroupAdmins } = require("../lib/functions");
                       
cmd({
  pattern: "js",
  alias: ["eval", "code", "run"],
  desc: "Run custom JavaScript code",
  category: "owner",
  use: ".js <code>",
  react: "🚀",
  filename: __filename,
},
async (conn, mek, m, { q, reply, sender, isDev, body, type, botNumber2 }) => {
  try {
 
    if (!isDev) {
      return reply("❌ You are not allowed to use this command.");
    }

    if (!q) return reply("⚠️ Provide JS code to run!\n\nExample: `.js 2+2`");


            const content = JSON.stringify(mek.message);
            const from = mek.key.remoteJid;
            const prefix = config.PREFIX || '.';
            const ownerNumber = config.OWNER_NUMBER || '94743548986';
            const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
            const quotedid = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo ? mek.message.extendedTextMessage.contextInfo.stanzaId || null : null;
            const isCmd = body.startsWith(prefix)
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
            const args = body.trim().split(/ +/).slice(1)
            const quotedText = m?.quoted?.msg || null;
            const isGroup = from.endsWith('@g.us');
            const isPrivate = !isGroup
            const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
            const senderNumber = sender.split('@')[0];
            const botNumber = conn.user.id.split(':')[0];
            const botLid = conn.user?.lid ? conn.user?.lid.split(":")[0] + "@lid" : null;
            const botLid2 = botLid ? botLid.split("@")[0] : null;
            const pushname = mek.pushName || 'Sin Nombre'
            const developers = []
            const isbot = (botNumber.includes(senderNumber) || botLid2.includes(senderNumber));
            const isdev = developers.includes(senderNumber)
            const isMe = isbot ? isbot : isdev
            const isOwner = ownerNumber.includes(senderNumber) || isMe;
            const isReact = m?.message?.reactionMessage ? true : false;
            const sudoNumbers = config?.SUDO_NUMBERS || [];
            const isSudo = sudoNumbers.includes(sender);
            const sudoGroups = config?.SUDO_NUMBERS || [];
            const isSudoGroup = sudoGroups.includes(sender);


            let groupMetadata = { subject: '', participants: [] }
            if (isGroup) {
              try {
                groupMetadata = await conn.groupMetadata(from);
              } catch (e) {
                // console.error('Failed to get group metadata:', e);
                }
            }
            const groupName = groupMetadata.subject;
            const participants = groupMetadata.participants;
            const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
            const isBotAdmins = isGroup ? groupAdmins?.includes(botNumber2) || groupAdmins?.includes(botLid) : false
            const isAdmins = isGroup ? groupAdmins?.includes(sender) : false
            const isAnti = (teks) => {
                let getdata = teks
                for (let i = 0; i < getdata.length; i++) {
                    if (getdata[i] === from) return true
                }
                return false
            }

    let result;
    try {
      result = await eval(`(async () => { ${q} })()`);
    } catch (err) {
      return reply("❌ Error:\n\n```" + err?.message ? err.message : e + "```");
    }

    if (typeof result !== "string") {
      result = util.inspect(result, { depth: 2 });
    }

    await reply("✅ *Result:*\n\n```" + result + "```");

  } catch (e) {
    console.error(e);
    await reply("❌ Error while executing code.");
  }
});
