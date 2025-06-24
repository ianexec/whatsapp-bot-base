// index by lunatic Tunneling 
// base asli daei awal bikin sendiri
// support all nodejs version

const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const chalk = require("chalk")
const readline = require("readline")

const usePairingCode = true
const cooldown = new Map() // ✅ Taruh di luar biar tetap nyimpen data antar pesan

async function question(prompt) {
    process.stdout.write(prompt)
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    return new Promise((resolve) => r1.question("", (ans) => {
        r1.close()
        resolve(ans)
    }))
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./lunaticSesi')
    const { version, isLatest } = await fetchLatestBaileysVersion()

    console.log(`lunatic Using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const lunatic = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        version,
        syncFullHistory: true,
        generateHighQualityLinkPreview: true,
        getMessage: async () => ({})
    })

    if (usePairingCode && !lunatic.authState.creds.registered) {
        try {
            const phoneNumber = await question('☘️ Masukan Nomor Yang Diawali Dengan 62 :\n')
            const code = await lunatic.requestPairingCode(phoneNumber.trim())
            console.log(`🎁 Pairing Code : ${code}`)
        } catch (err) {
            console.error('Failed to get pairing code:', err)
        }
    }

    lunatic.ev.on("creds.update", saveCreds)

    lunatic.ev.on("connection.update", (update) => {
        const { connection } = update
        if (connection === "close") {
            console.log(chalk.red("❌ Koneksi Terputus, Mencoba Menyambung Ulang"))
            connectToWhatsApp()
        } else if (connection === "open") {
            console.log(chalk.green("✔ Bot Berhasil Terhubung Ke WhatsApp"))
        }
    })

    // === Pesan Masuk ===
    lunatic.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return

        const sender = msg.key.remoteJid
        const isGroup = sender.endsWith('@g.us')
        const isFromMe = msg.key.fromMe

        // ✅ Autoreply pribadi + cooldown 1 menit
        if (!isGroup && !isFromMe) {
            if (!cooldown.has(sender)) {
                const autoReply = `Waalaikumsalam ada yg bisa saya bantu?\n\nTunggu admin beberapa detik untuk membalas pesan 😁\nAdmin sedikit sibuk soal nya😑`
                await lunatic.sendMessage(sender, { text: autoReply }, { quoted: msg })
                cooldown.set(sender, true)
                setTimeout(() => cooldown.delete(sender), 60 * 1000)
            }
        }

        // ✅ Jalankan command (kayak !menu)
        require("./lunatic")(lunatic, m)
    })

    // === Grup Masuk/Keluar ===
    lunatic.ev.on("group-participants.update", async (update) => {
        try {
            const metadata = await lunatic.groupMetadata(update.id)
            for (const user of update.participants) {
                const name = `@${user.split("@")[0]}`
                const text = update.action === "add"
                    ? `📥 Selamat datang ${name} ke grup *${metadata.subject}*\nJangan lupa baca deskripsi & aturan ya 🫡`
                    : `📤 ${name} telah keluar dari grup *${metadata.subject}*.`

                await lunatic.sendMessage(update.id, {
                    text,
                    mentions: [user]
                })
            }
        } catch (err) {
            console.log("❌ Gagal kirim pesan grup:", err)
        }
    })
}

connectToWhatsApp()
