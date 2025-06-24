/*  
  Made By lunatic
  Base : lunatic
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilunatic
  Youtube : @lunatic

  https://whatsapp.com/channel/0029VbB0b0UCMY0FC3TX6Q2r

  Recode ? Taruh Credit Ya tod jangan bandel
  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini
  contoh memanggil bot di whatsapp awali ! ( !menu dst..)
*/

// Tambahkan Ini sesudah case 'command' dan sebelum const , [ Jika command / fitur hanya untuk admin ]
// if (!isAdmin) return lunaticreply("❌ Khusus Admin!")

// prefix
require('./lunaglobal')
const fs = require('fs')
const axios = require('axios')
const Ai4Chat = require('./scrape/Ai4Chat')

// const tiktok2 = require('./scrape/Tiktok')
// const sell = require('./database/Menu/sell')

const adminFile = './database/admin.json'
let admin = []

if (fs.existsSync(adminFile)) {
    admin = JSON.parse(fs.readFileSync(adminFile))
} else {
    fs.writeFileSync(adminFile, JSON.stringify(["6283197765857@s.whatsapp.net"]))
    admin = JSON.parse(fs.readFileSync(adminFile))
}

let autoPromoON = false
setInterval(async () => {
    if (!autoPromoON) return
    try {
        const groupData = await lunatic.groupFetchAllParticipating()
        const groupIds = Object.keys(groupData)
        for (const id of groupIds) {
            await lunatic.sendMessage(id, { text: sell })
            console.log(`[✅] Promosi terkirim ke: ${id}`)
        }
    } catch (err) {
        console.error("[❌] Gagal kirim promosi otomatis:", err)
    }
}, 2 * 60 * 60 * 1000) // 2 jam sekali

module.exports = async (lunatic, m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const sender = msg.key.remoteJid
    const pushname = msg.pushName || "lunatic"
    const args = body.slice(1).trim().split(" ")
    const command = args.shift().toLowerCase()
    const q = args.join(" ")

    if (!body.startsWith(global.prefix)) return

    const lunaticreply = (teks) => lunatic.sendMessage(sender, { text: teks }, { quoted: msg })
    const isGroup = sender.endsWith('@g.us')
    const isAdmin = admin.includes(sender)
    const menuImage = fs.readFileSync(global.image)

    switch (command) {
        case "menu":
            lunaticreply(`
==================
*MENU KHUSUS ADMIN*
==================
> !ai
> !pay
> !sell
> !qris
> !autosell on
> !autosell off
> !addadmin 628xxxxx
> !listadmin
> !deladmin 628xxxxx

==================
*@LunaticTunneling*
_Created2017-2025_
`)
            break

// jualan
        case "sell":
            lunaticreply(`
=======================
  ☠️Lunatic Tunneling☠️
=======================
*CONFIG/VPN PREMIUM*
*SERVER SINGAPURA* 🇸🇬 
━━━━━━━━━━━━━━━━━
5k / 1 bulan / 1 HP
6k / 1 bulan / 2 HP
10k / 2 bulan / 2 HP
11k / 2 bulan / 3 HP
15k / 3 bulan / 3 HP
16k / 3 bulan / 4 HP
25k / 4 bulan / Unli HP
26k / 4 bulan / Unli HP
*TAMBAH 1K PER 1 IP / HP*
*TAMBAH 10K UNLIMITED IP*
━━━━━━━━━━━━━━━━━
– Triall Dulu  Sebelum Order 
– Cocok Gas , ga cocok skip
– Garansi 100% sampe masa-aktif Habis
📂 TERIMA JASA : 
- FIX SC TUNNELING : 50K
- UPGRADE SC KE ALL OS : 120K
━━━━━━━━━━━━━━━━━
*Join Config Prem Murah :*
https://chat.whatsapp.com/Gg5eN9rnjFoK30Jk7COWM5
━━━━━━━━━━━━━━━━━
*Join Grup Berbagi config:*
https://chat.whatsapp.com/FR4xHcfW6IMB6aS0gSP7Gt
━━━━━━━━━━━━━━━━━
*Ssh Premium Free:*
https://whatsapp.com/channel/0029VbB0b0UCMY0FC3TX6Q2r
━━━━━━━━━━━━━━━━━
*Testimoni:*
https://whatsapp.com/channel/0029Vb5ZrXsBlHpWwWjw6v1i
━━━━━━━━━━━━━━━━━
*WhatsApp:*
wa.me/+6283197765857
`)
            break

// auto jualan
        case "autosell":
            if (!isAdmin) return lunaticreply("❌ Khusus Admin!")
            if (q === "on") {
                autoPromoON = true
                lunaticreply("✅ AutoPromosi diaktifkan!")
            } else if (q === "off") {
                autoPromoON = false
                lunaticreply("✅ AutoPromosi dimatikan!")
            } else {
                lunaticreply("⚠️ Ketik: !autosell on / off")
            }
            break

// payment
        case "pay":
        case "payment":
            lunaticreply(`*PAYMENT*

📱 *DANA*     : 083197765857  
📱 *LinkAja*  : 083197765857  
🏦 *BCA*       : 2782129857  
🏦 *SeaBank* : 901711609062  

🧾 *Atas Nama:* _DIAN_
📌 Bukti TF Kirim.`)
            break

// qris pembayaran 
        case "qris":
            try {
                const qrisBuffer = fs.readFileSync('./database/image/QR.jpeg')
                await lunatic.sendMessage(sender, {
                    image: qrisBuffer,
                    caption: `*QRIS*\nAtas Nama: _Lunatic Cell_\n📌 Bukti TF Kirim.`
                }, { quoted: msg })
            } catch {
                lunaticreply("⚠️ Gagal menampilkan QRIS.")
            }
            break

// delete text pesan 
        case "delete":
        case "del": {
            if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo) {
                return lunaticreply("❌ Balas pesan yang ingin dihapus dengan command ini.");
            }

            const targetMsg = msg.message.extendedTextMessage.contextInfo.stanzaId;
            const remoteJid = msg.message.extendedTextMessage.contextInfo.participant || msg.key.remoteJid;

            try {
                await lunatic.sendMessage(remoteJid, {
                    delete: {
                        remoteJid: remoteJid,
                        fromMe: false,
                        id: targetMsg,
                        participant: remoteJid
                    }
                });
            } catch (err) {
                console.error("❌ Gagal hapus pesan:", err);
                lunaticreply("⚠️ Gagal menghapus pesan. Mungkin bukan admin?");
            }
        }
        break;
        
// tambahkan admin bot
        case "addadmin":
            if (!isAdmin) return lunaticreply("❌ Khusus Admin!")
            const jid = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            if (!q || !q.startsWith("62")) return lunaticreply("⚠️ Contoh: !addadmin 628xxxxx")
            if (admin.includes(jid)) return lunaticreply("⚠️ Nomor itu sudah admin.")
            admin.push(jid)
            fs.writeFileSync(adminFile, JSON.stringify(admin, null, 2))
            lunaticreply(`✅ Berhasil menambahkan admin: ${q}`)
            break

// daftar admin bot
        case "listadmin":
            if (!isAdmin) return lunaticreply("❌ Khusus Admin!")
            let list = admin.map((a, i) => `${i + 1}. wa.me/${a.replace(/@s\.whatsapp\.net/, "")}`).join("\n")
            lunaticreply(`*LIST ADMIN BOT:*\n\n${list}`)
            break

// hapus admin bot
        case "deladmin":
            if (!isAdmin) return lunaticreply("❌ Khusus Admin!")
            const deljid = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            if (!admin.includes(deljid)) return lunaticreply("⚠️ Nomor itu bukan admin.")
            admin = admin.filter(a => a !== deljid)
            fs.writeFileSync(adminFile, JSON.stringify(admin, null, 2))
            lunaticreply(`✅ Admin ${q} berhasil dihapus.`)
            break

// Lunatic AI
        case "ai": {
            if (!q) return lunaticreply("☘️ *Contoh:* !ai Apa itu Lonte?");
            lunaticreply(global.mess.wait);
            try {
                const lenai = await Ai4Chat(q);
                await lunaticreply(`*LUNATIC AI*\n\n${lenai}`);
            } catch (error) {
                console.error("Error:", error);
                lunaticreply(global.mess.error);
            }
        }
        break;
        

// tambahin fitur mah di sini 
// jangan melewati : 
//        default:
//            lunaticreply(global.mess.default)
// batas sampe sini 
        default:
            lunaticreply(global.mess.default)
    }
}
