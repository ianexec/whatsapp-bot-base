#!/bin/bash

# === KONFIGURASI ===
BOT_NAME="lunabot"
BOT_DIR="/usr/bin/lunatic"
REPO_URL="https://github.com/ianexec/whatsapp-bot-base.git"
SERVICE_FILE="/etc/systemd/system/${BOT_NAME}.service"
NODE_PATH="$(which node)"

function installer() {
    echo "===================================="
    echo "  🛠️  SETUP BOT WHATSAPP LUNATIC"
    echo "===================================="

    # === UPDATE DAN INSTALL DEPENDENSI ===
    apt update && apt upgrade -y
    apt install -y nodejs npm git curl

    # === PASTIKAN NODE TERINSTAL ===
    if [[ ! -x "$NODE_PATH" ]]; then
        echo "❌ Node.js tidak ditemukan. Pastikan berhasil di-install."
        exit 1
    fi

    # === CLONE SOURCE CODE BOT ===
    echo "📦 Menyiapkan direktori bot..."
    rm -rf "$BOT_DIR"
    mkdir -p "$BOT_DIR"
    git clone "$REPO_URL" "$BOT_DIR"

    # === INSTALL DEPENDENSI NPM ===
    echo "📦 Menginstall dependensi Node.js..."
    cd "$BOT_DIR"
    npm install

    # === BUAT FILE SYSTEMD SERVICE ===
    echo "⚙️ Membuat systemd service di $SERVICE_FILE..."
    cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Bot WhatsApp Lunatic
After=network.target

[Service]
Type=simple
WorkingDirectory=${BOT_DIR}
ExecStart=${NODE_PATH} index.js
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    # === AKTIFKAN SERVICE ===
    systemctl daemon-reload
    systemctl enable "$BOT_NAME"
    systemctl start "$BOT_NAME"

    echo "===================================="
    echo "✅ BOT WA SUKSES DIINSTALL!"
    echo "📍 Lokasi: $BOT_DIR"
    echo "🔁 Service aktif: $BOT_NAME"
    echo "📲 Lihat log: journalctl -fu $BOT_NAME"
    echo "===================================="
}

function uninstaller() {
    echo "===================================="
    echo "⚠️  UNINSTALL BOT WHATSAPP LUNATIC"
    echo "===================================="

    # === HENTIKAN DAN NONAKTIFKAN SERVICE ===
    echo "⛔ Menghentikan service..."
    systemctl stop "$BOT_NAME"
    systemctl disable "$BOT_NAME"
    rm -f "$SERVICE_FILE"
    systemctl daemon-reload

    # === HAPUS FOLDER BOT ===
    if [[ -d "$BOT_DIR" ]]; then
        echo "🗑️ Menghapus folder bot..."
        rm -rf "$BOT_DIR"
    else
        echo "📂 Folder bot tidak ditemukan."
    fi

    echo "✅ Uninstall selesai."
    echo "===================================="
}

# === MENU UTAMA ===
clear
echo -e "\e[91;1m====================================\e[0m"
echo -e "\e[97;1m  1. INSTALL BOT WA   \e[0m"
echo -e "\e[97;1m  2. UNINSTALL BOT WA \e[0m"
echo -e "\e[97;1m  x. QUIT \e[0m"
echo -e "\e[91;1m====================================\e[0m"
echo ""
read -p " Just input 1-2 or x to 'quit': " CHOICE
case "$CHOICE" in
    1) installer ;;
    2) uninstaller ;;
    *) exit ;;
esac
