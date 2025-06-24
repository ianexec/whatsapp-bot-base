#!/bin/bash

# === SETUP VARIABEL ===
BOT_DIR="/usr/bin/lunatic"
REPO_URL="https://github.com/ianexec/whatsapp-bot-base.git"

function installer(){
echo "===================================="
echo "  🛠️  SETUP BOT WHATSAPP LUNATIC"
echo "===================================="

# === UPDATE DAN INSTALL DEPENDENCY ===
apt update && apt upgrade -y
apt install -y nodejs npm git curl

# === INSTALL PM2 ===
npm install -g pm2

# === BUAT FOLDER DAN CLONE BOT ===
mkdir -p $BOT_DIR
cd $BOT_DIR

echo "📦 Mendownload source bot..."
# Contoh: git clone repo (hapus kalau file udah ada lokal)
# git clone $REPO_URL .

# Kalau kamu copy manual, pastikan file seperti index.js, package.json udah ada di sini

# === INSTALL DEPENDENSI NPM ===
echo "📦 Install dependensi bot..."
npm install

# === JALANKAN BOT PAKAI PM2 ===
echo "🚀 Menjalankan bot pakai PM2..."
pm2 start index.js --name lunabot
pm2 save
pm2 startup | tee /tmp/pm2-startup.sh
bash /tmp/pm2-startup.sh

echo "===================================="
echo "✅  BOT WA SUKSES DIINSTALL!"
echo "📍 Lokasi: $BOT_DIR"
echo "📲 Jalankan ulang bot: pm2 restart lunabot"
echo "🧩 Pairing akan muncul di terminal log: pm2 logs lunabot"
echo "===================================="
}

function uninstaller() {

BOT_DIR="/usr/bin/lunatic"
BOT_NAME="lunabot"

echo "===================================="
echo "  ⚠️  UNINSTALL BOT WHATSAPP LUNATIC"
echo "===================================="

# Stop & delete dari PM2
echo "❌ Menghapus proses bot dari PM2..."
pm2 stop $BOT_NAME
pm2 delete $BOT_NAME
pm2 save

# Hapus folder bot
if [ -d "$BOT_DIR" ]; then
    echo "🗑️ Menghapus folder $BOT_DIR..."
    rm -rf "$BOT_DIR"
else
    echo "📂 Folder $BOT_DIR tidak ditemukan."
fi

# Hapus PM2 startup script
echo "⚙️ Menghapus konfigurasi PM2 startup..."
pm2 unstartup

# (Opsional) Tawarkan hapus node/npm/pm2
read -p "❓ Hapus juga nodejs, npm dan pm2? [y/N]: " hapus
if [[ "$hapus" =~ ^[Yy]$ ]]; then
    echo "🧼 Menghapus nodejs, npm dan pm2..."
    apt remove --purge -y nodejs npm
    npm uninstall -g pm2
    apt autoremove -y
fi

echo "✅ Uninstall selesai."
echo "===================================="
}

clear
echo -e "\e[91;1m====================================\e[0m"
echo -e "\e[97;1m  1. INSTALL BOT WA   \e[0m"
echo -e "\e[97;1m  2. UNINSTALL BOT WA \e[0m"
echo -e "\e[97;1m  x. QUIT \e[0m"
echo -e "\e[91;1m====================================\e[0m"
echo -e ""
read -p " Just input 1-2 or x to 'quit': " CHOICE
case $CHOICE in
1) installer ;;
2) uninstaller ;;
*) exit ;;
esac