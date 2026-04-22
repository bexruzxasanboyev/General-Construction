/**
 * thankyou.js — Thank You sahifasi JS
 *
 * VAZIFA:
 *   app.js form'larni yuborganida localStorage ga ma'lumotni saqlaydi va
 *   /thankYou.html ga redirect qiladi. Shu sahifa ochilganda bu fayl ishlaydi:
 *
 *   1) localStorage'dan ma'lumotni o'qiydi
 *   2) PARALLEL (bir vaqtda) 2 ta joyga yuboradi:
 *        - Google Sheets (Apps Script webhook)
 *        - Uysot CRM (external-source endpoint, Afsona voronkasiga)
 *   3) Sheets muvaffaqiyatli bo'lsa localStorage'ni tozalaydi
 *
 * Uysot API:
 *   POST https://service.app.uysot.uz/v1/external-source
 *   Header:  X-Auth: <token>
 *   Body:    {
 *     phoneNumber,           // required
 *     name?,
 *     message?,
 *     email?,
 *     tagList?,              // tag ro'yxati
 *     customChannel?,        // routing kaliti — Afsona voronkasiga yo'naltiradi
 *     utmData?               // UTM parametrlari (reklama manbaini aniqlash)
 *   }
 *
 *   Routing: customChannel="AfsonaWebformBALANCE" → Afsona voronkasi → Incoming Leads
 *   Tag:     "AfsonaWebformBALANCE" har bir lidga qo'shiladi
 *
 * localStorage kalitlari:
 *   - "formData"      → Lead 1 (ism + telefon)
 *   - "applyFormData" → Lead 2 (ism + telefon + xonadon tafsilotlari)
 */


// =================================================================
// KONFIGURATSIYA
// =================================================================
const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbyK9CB_Hxsfn53C1QffBlg5HwalDJhwtYPs-wHd2Uj3Il5azQo1hWbvZVj7sHCgJpeDYg/exec";

// UYSOT CRM
const UYSOT_API_URL = "https://service.app.uysot.uz/v1/external-source";
const UYSOT_TOKEN   = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDgiLCJleHAiOjcxMDIyNjkzNTZ9.dN7erklAbPFhCCpGkoyM17J6xHsjQzzeRwo2ajI19RA";
const UYSOT_CHANNEL = "AfsonaWebformBALANCE"; // customChannel qiymati (routing kaliti)
const UYSOT_TAG     = "AfsonaWebformBALANCE"; // Tag (# belgisisiz)


// =================================================================
// YORDAMCHI FUNKSIYALAR
// =================================================================

/**
 * Telefon raqamni xalqaro formatga keltirish: +998XXXXXXXXX
 */
function normalizePhone(phone) {
    const s = String(phone || "").trim();
    if (!s) return "";

    if (s.startsWith("+")) {
        const digits = s.slice(1).replace(/\D/g, "");
        return digits ? "+" + digits : "";
    }

    const digits = s.replace(/\D/g, "");
    if (!digits) return "";

    if (digits.length === 9) return "+998" + digits;
    if (digits.length >= 12 && digits.startsWith("998")) return "+" + digits.slice(0, 12);

    return "+" + digits;
}

function showError() {
    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "block";
}

/**
 * URL'dan UTM parametrlarini olish
 * Agar URL'da ?utm_source=facebook&utm_campaign=spring bo'lsa — shu ma'lumotni oladi
 * Bo'lmasa — bo'sh qiymatlar qaytaradi (Uysot spec'iga mos)
 */
function getUtmData() {
    try {
        const url = new URL(window.location.href);
        return {
            utmSource:   url.searchParams.get("utm_source")   || "",
            utmMedium:   url.searchParams.get("utm_medium")   || "",
            utmCampaign: url.searchParams.get("utm_campaign") || "",
            utmTerm:     url.searchParams.get("utm_term")     || "",
            utmContent:  url.searchParams.get("utm_content")  || ""
        };
    } catch {
        return {
            utmSource: "", utmMedium: "", utmCampaign: "",
            utmTerm: "",   utmContent: ""
        };
    }
}


// =================================================================
// SHEETS'GA YUBORISH
// =================================================================
async function sendToSheets(sheetName, fields) {
    const formData = new FormData();
    formData.append("sheetName", sheetName);

    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value ?? "");
    });

    const response = await fetch(SHEETS_API_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) throw new Error(`Sheets ${response.status}`);
    return response;
}


// =================================================================
// UYSOT CRM — external-source endpoint
// =================================================================
async function sendToUysot(payload) {
    if (!payload.phoneNumber) {
        throw new Error("Uysot: phoneNumber bo'sh");
    }

    // Har bir so'rovga qo'shiladigan maydonlar:
    payload.tagList = [UYSOT_TAG];          // tag
    payload.customChannel = UYSOT_CHANNEL;  // routing kaliti (Afsona voronkasiga)

    // utmData agar payload'da berilmagan bo'lsa — URL'dan olamiz
    if (!payload.utmData) {
        payload.utmData = getUtmData();
    }

    const response = await fetch(UYSOT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": UYSOT_TOKEN
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`Uysot ${response.status}: ${errorText}`);
    }

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : { ok: true };
    } catch {
        return { ok: true, raw: text };
    }
}


// =================================================================
// LEAD 1 — oddiy forma (ism + telefon)
// =================================================================
async function sendLeadData() {
    const raw = localStorage.getItem("formData");
    if (!raw) return;

    const d = JSON.parse(raw);
    const phone = normalizePhone(d.TelefonRaqam);

    const [sheetsResult, uysotResult] = await Promise.allSettled([
        sendToSheets("Lead", {
            "Ism": d.Ism,
            "Telefon raqam": d.TelefonRaqam,
            "Royhatdan o'tgan vaqti": d.SanaSoat
        }),
        sendToUysot({
            phoneNumber: phone,
            name: d.Ism || "",
            message:
                `Manba: Landing Page - Lead\n` +
                `Sana: ${d.SanaSoat}\n` +
                `URL: ${window.location.href}`
        })
    ]);

    if (sheetsResult.status === "fulfilled") {
        localStorage.removeItem("formData");
    } else {
        console.error("❌ Sheets xato:", sheetsResult.reason);
        showError();
    }

    if (uysotResult.status === "rejected") {
        console.error("❌ Uysot xato (Lead):", uysotResult.reason);
    } else {
        console.log("✅ Uysot OK (Lead):", uysotResult.value);
    }
}


// =================================================================
// LEAD 2 — kengaytirilgan forma (xonadon tafsilotlari bilan)
// =================================================================
async function sendLead2Data() {
    const raw = localStorage.getItem("applyFormData");
    if (!raw) return;

    const d = JSON.parse(raw);
    const phone = normalizePhone(d.TelefonRaqam);

    const uysotMessage = [
        `Xonadon turi: ${d.XonadonTuri || "-"}`,
        `Xonalar soni: ${d.XonalarSoni || "-"}`,
        `Xozirgi manzil: ${d.Manzil || "-"}`,
        ``,
        `Manba: Landing Page - Lead 2`,
        `Sana: ${d.SanaSoat}`,
        `URL: ${window.location.href}`
    ].join("\n");

    const [sheetsResult, uysotResult] = await Promise.allSettled([
        sendToSheets("Lead 2", {
            "Ism": d.Ism,
            "Telefon raqam": d.TelefonRaqam,
            "Royhatdan o'tgan vaqti": d.SanaSoat,
            "Qanday xonadon qidiryapsiz": d.XonadonTuri,
            "Necha xonalik bo'lsin": d.XonalarSoni,
            "Xozirgi yashash manzilingiz": d.Manzil
        }),
        sendToUysot({
            phoneNumber: phone,
            name: d.Ism || "",
            message: uysotMessage
        })
    ]);

    if (sheetsResult.status === "fulfilled") {
        localStorage.removeItem("applyFormData");
    } else {
        console.error("❌ Sheets xato:", sheetsResult.reason);
        showError();
    }

    if (uysotResult.status === "rejected") {
        console.error("❌ Uysot xato (Lead 2):", uysotResult.reason);
    } else {
        console.log("✅ Uysot OK (Lead 2):", uysotResult.value);
    }
}


// =================================================================
// ISHGA TUSHIRISH
// =================================================================
window.addEventListener("load", () => {
    sendLeadData();
    sendLead2Data();
});