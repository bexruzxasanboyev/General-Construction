/**
 * Phone Formatter — universal telefon raqam formatlash + davlat tanlash
 *
 * Foydalanish:
 *   const formatter = setupPhoneFormatter({
 *     inputEl:     document.getElementById("phone"),
 *     codeLabelEl: document.getElementById("selectedCountryCode"),
 *     dropdownEl:  document.getElementById("countryDropdown"),
 *     triggerEl:   document.getElementById("selectedCountry"),
 *     iconEl:      document.getElementById("dropdownIcon"),
 *     errorEl:     document.getElementById("phoneError"),
 *     defaultCode: "+998"
 *   });
 *
 *   formatter.getCurrentCode(); // "+998"
 *   formatter.validate("88 888 88 88"); // true/false
 */

function setupPhoneFormatter({
    inputEl,
    codeLabelEl,
    dropdownEl,
    triggerEl,
    iconEl,
    errorEl,
    defaultCode = "+998"
}) {
    // =============================================================
    // DAVLATLAR RO'YXATI (dropdown uchun)
    // =============================================================
    const COUNTRIES = [
        { name: "Uzbekistan", code: "+998" },
        { name: "Tajikistan", code: "+992" },
        { name: "Qirg'iziston", code: "+996" },
        { name: "Qozog'iston", code: "+7" },
        { name: "Turkmaniston", code: "+993" },
        { name: "AQSH", code: "+1" },
        { name: "Janubiy Koreya", code: "+82" },
        { name: "Turkiya", code: "+90" },
        { name: "Rossiya", code: "+7" },
        { name: "BAA (Dubay)", code: "+971" },
        { name: "United Kingdom", code: "+44" },
        { name: "Ireland", code: "+353" },
        { name: "France", code: "+33" },
        { name: "Germany", code: "+49" },
        { name: "Italy", code: "+39" },
        { name: "Spain", code: "+34" },
        { name: "Portugal", code: "+351" },
        { name: "Netherlands", code: "+31" },
        { name: "Belgium", code: "+32" },
        { name: "Luxembourg", code: "+352" },
        { name: "Switzerland", code: "+41" },
        { name: "Austria", code: "+43" },
        { name: "Polsha", code: "+48" },
        { name: "Czechia", code: "+420" },
        { name: "Slovakia", code: "+421" },
        { name: "Hungary", code: "+36" },
        { name: "Slovenia", code: "+386" },
        { name: "Croatia", code: "+385" },
        { name: "Bosnia & Herzegovina", code: "+387" },
        { name: "Serbia", code: "+381" },
        { name: "Montenegro", code: "+382" },
        { name: "North Macedonia", code: "+389" },
        { name: "Albania", code: "+355" },
        { name: "Greece", code: "+30" },
        { name: "Bulgaria", code: "+359" },
        { name: "Romania", code: "+40" },
        { name: "Moldova", code: "+373" },
        { name: "Ukraine", code: "+380" },
        { name: "Belarus", code: "+375" },
        { name: "Lithuania", code: "+370" },
        { name: "Latvia", code: "+371" },
        { name: "Estonia", code: "+372" },
        { name: "Norway", code: "+47" },
        { name: "Sweden", code: "+46" },
        { name: "Denmark", code: "+45" },
        { name: "Finland", code: "+358" },
        { name: "Iceland", code: "+354" },
        { name: "Malta", code: "+356" },
        { name: "Cyprus", code: "+357" },
        { name: "Monaco", code: "+377" },
        { name: "Andorra", code: "+376" },
        { name: "Liechtenstein", code: "+423" },
        { name: "Kosovo", code: "+383" },
        { name: "Georgia", code: "+995" },
        { name: "Azerbaijan", code: "+994" },
        { name: "Armenia", code: "+374" },
        { name: "China", code: "+86" },
        { name: "Japan", code: "+81" },
        { name: "India", code: "+91" },
        { name: "Pakistan", code: "+92" },
        { name: "Bangladesh", code: "+880" },
        { name: "Sri Lanka", code: "+94" },
        { name: "Nepal", code: "+977" },
        { name: "Afghanistan", code: "+93" },
        { name: "Indonesia", code: "+62" },
        { name: "Malaysia", code: "+60" },
        { name: "Singapore", code: "+65" },
        { name: "Thailand", code: "+66" },
        { name: "Vietnam", code: "+84" },
        { name: "Philippines", code: "+63" },
        { name: "Cambodia", code: "+855" },
        { name: "Laos", code: "+856" },
        { name: "Myanmar", code: "+95" },
        { name: "Mongolia", code: "+976" },
        { name: "Hong Kong", code: "+852" },
        { name: "Macau", code: "+853" },
        { name: "Maldives", code: "+960" },
        { name: "Brunei", code: "+673" },
        { name: "Timor-Leste", code: "+670" },
        { name: "Saudi Arabia", code: "+966" },
        { name: "Qatar", code: "+974" },
        { name: "Kuwait", code: "+965" },
        { name: "Oman", code: "+968" },
        { name: "Bahrain", code: "+973" },
        { name: "Jordan", code: "+962" },
        { name: "Lebanon", code: "+961" },
        { name: "Syria", code: "+963" },
        { name: "Iraq", code: "+964" },
        { name: "Iran", code: "+98" },
        { name: "Israel", code: "+972" },
        { name: "Palestine", code: "+970" },
        { name: "Yemen", code: "+967" }
    ];

    // =============================================================
    // FORMAT KONFIGURATSIYALARI
    // ph — placeholder matn; g — guruhlash (raqamlar guruhining uzunliklari)
    // Misol: +998 uchun [2,3,2,2] → "88 888 88 88"
    // =============================================================
    const FORMATS = {
        "+44": { ph: "7400 123 456", g: [4, 3, 3] },
        "+353": { ph: "83 123 4567", g: [2, 3, 4] },
        "+33": { ph: "6 12 34 56 78", g: [1, 2, 2, 2, 2] },
        "+49": { ph: "1512 3456789", g: [4, 7] },
        "+39": { ph: "312 345 6789", g: [3, 3, 4] },
        "+34": { ph: "612 34 56 78", g: [3, 2, 2, 2] },
        "+351": { ph: "912 345 678", g: [3, 3, 3] },
        "+31": { ph: "6xx 123 4567", g: [3, 3, 4] },
        "+32": { ph: "4xx 12 34 56", g: [3, 2, 2, 2] },
        "+352": { ph: "621 234 567", g: [3, 3, 3] },
        "+41": { ph: "79 123 45 67", g: [2, 3, 2, 2] },
        "+43": { ph: "650 123 4567", g: [3, 3, 4] },
        "+48": { ph: "123 456 789", g: [3, 3, 3] },
        "+420": { ph: "123 456 789", g: [3, 3, 3] },
        "+421": { ph: "912 345 678", g: [3, 3, 3] },
        "+36": { ph: "30 123 4567", g: [2, 3, 4] },
        "+386": { ph: "31 234 567", g: [2, 3, 3] },
        "+385": { ph: "91 234 5678", g: [2, 3, 4] },
        "+387": { ph: "61 234 567", g: [2, 3, 3] },
        "+381": { ph: "60 123 4567", g: [2, 3, 4] },
        "+382": { ph: "67 123 456", g: [2, 3, 3] },
        "+389": { ph: "70 123 456", g: [2, 3, 3] },
        "+355": { ph: "68 123 4567", g: [2, 3, 4] },
        "+30": { ph: "691 234 5678", g: [3, 3, 4] },
        "+359": { ph: "87 123 4567", g: [2, 3, 4] },
        "+40": { ph: "712 345 678", g: [3, 3, 3] },
        "+373": { ph: "621 234 567", g: [3, 3, 3] },
        "+380": { ph: "67 123 4567", g: [2, 3, 4] },
        "+375": { ph: "29 123 45 67", g: [2, 3, 2, 2] },
        "+370": { ph: "612 34567", g: [3, 5] },
        "+371": { ph: "21 234 567", g: [2, 3, 3] },
        "+372": { ph: "5123 4567", g: [4, 4] },
        "+47": { ph: "412 34 567", g: [3, 2, 3] },
        "+46": { ph: "7xx 123 456", g: [3, 3, 3] },
        "+45": { ph: "12 34 56 78", g: [2, 2, 2, 2] },
        "+358": { ph: "40 123 4567", g: [2, 3, 4] },
        "+354": { ph: "611 2345", g: [3, 4] },
        "+356": { ph: "9912 3456", g: [4, 4] },
        "+357": { ph: "96 123 456", g: [2, 3, 3] },
        "+377": { ph: "6 12 34 56 78", g: [1, 2, 2, 2, 2] },
        "+376": { ph: "612 345", g: [3, 3] },
        "+423": { ph: "79 123 45 67", g: [2, 3, 2, 2] },
        "+383": { ph: "43 123 456", g: [2, 3, 3] },
        "+995": { ph: "555 12 34 56", g: [3, 2, 2, 2] },
        "+994": { ph: "50 123 45 67", g: [2, 3, 2, 2] },
        "+374": { ph: "91 234 567", g: [2, 3, 3] },
        "+7": { ph: "900 123 4567", g: [3, 3, 4] },
        "+998": { ph: "88 888 88 88", g: [2, 3, 2, 2] },
        "+992": { ph: "55 555 5555", g: [2, 3, 4] },
        "+996": { ph: "555 123 456", g: [3, 3, 3] },
        "+993": { ph: "6 123 4567", g: [1, 3, 4] },
        "+1": { ph: "555 123 4567", g: [3, 3, 4] },
        "+82": { ph: "10 1234 5678", g: [2, 4, 4] },
        "+90": { ph: "5xx 123 45 67", g: [3, 3, 2, 2] },
        "+971": { ph: "50 123 4567", g: [2, 3, 4] },
        "+86": { ph: "131 2345 6789", g: [3, 4, 4] },
        "+81": { ph: "90 1234 5678", g: [2, 4, 4] },
        "+91": { ph: "91234 56789", g: [5, 5] },
        "+92": { ph: "301 234 5678", g: [3, 3, 4] },
        "+880": { ph: "17 1234 5678", g: [2, 4, 4] },
        "+94": { ph: "71 234 5678", g: [2, 3, 4] },
        "+977": { ph: "981 234 5678", g: [3, 3, 4] },
        "+93": { ph: "70 123 4567", g: [2, 3, 4] },
        "+62": { ph: "812 1234 5678", g: [3, 4, 4] },
        "+60": { ph: "12 345 6789", g: [2, 3, 4] },
        "+65": { ph: "8123 4567", g: [4, 4] },
        "+66": { ph: "81 234 5678", g: [2, 3, 4] },
        "+84": { ph: "91 234 5678", g: [2, 3, 4] },
        "+63": { ph: "912 345 6789", g: [3, 3, 4] },
        "+855": { ph: "12 345 678", g: [2, 3, 3] },
        "+856": { ph: "20 1234 5678", g: [2, 4, 4] },
        "+95": { ph: "9 1234 5678", g: [1, 4, 4] },
        "+976": { ph: "8812 3456", g: [4, 4] },
        "+852": { ph: "5123 4567", g: [4, 4] },
        "+853": { ph: "6612 3456", g: [4, 4] },
        "+960": { ph: "771 2345", g: [3, 4] },
        "+673": { ph: "712 3456", g: [3, 4] },
        "+670": { ph: "77 123 456", g: [2, 3, 3] },
        "+966": { ph: "50 123 4567", g: [2, 3, 4] },
        "+974": { ph: "3312 3456", g: [4, 4] },
        "+965": { ph: "5001 2345", g: [4, 4] },
        "+968": { ph: "9212 3456", g: [4, 4] },
        "+973": { ph: "3412 3456", g: [4, 4] },
        "+962": { ph: "7 9012 3456", g: [1, 4, 4] },
        "+961": { ph: "71 234 567", g: [2, 3, 3] },
        "+963": { ph: "93 123 4567", g: [2, 3, 4] },
        "+964": { ph: "770 123 4567", g: [3, 3, 4] },
        "+98": { ph: "912 345 6789", g: [3, 3, 4] },
        "+972": { ph: "50 123 4567", g: [2, 3, 4] },
        "+970": { ph: "59 123 4567", g: [2, 3, 4] },
        "+967": { ph: "71 234 5678", g: [2, 3, 4] }
    };

    // =============================================================
    // KOD UCHUN KONFIG YASASH (format funksiyasi, validator, maxLen)
    // =============================================================
    function getConfig(code) {
        const conf = FORMATS[code] || FORMATS["+998"];
        const groups = conf.g;

        return {
            placeholder: conf.ph,

            // Raqamlarni guruhlarga ajratib, bo'sh joy bilan birlashtirish
            format(digits) {
                const parts = [];
                let pos = 0;
                for (const len of groups) {
                    if (pos >= digits.length) break;
                    parts.push(digits.slice(pos, pos + len));
                    pos += len;
                }
                return parts.join(" ");
            },

            // Validatsiya uchun regex: "^\d{2}\s\d{3}\s\d{2}\s\d{2}$"
            validate: new RegExp(
                "^" + groups.map(n => `\\d{${n}}`).join("\\s") + "$"
            ),

            // Maksimal uzunlik (raqamlar + bo'shliqlar)
            maxLen: groups.reduce((a, b) => a + b, 0) + (groups.length - 1)
        };
    }

    // =============================================================
    // JORIY DAVLAT KODI (bu o'zgaruvchi userning tanlovi bilan yangilanadi)
    // =============================================================
    let currentCode = defaultCode;

    // =============================================================
    // INPUT QIYMATINI FORMATLASH
    // Agar user "+998901234567" yozib qo'yadi — bu avtomatik davlatni aniqlab,
    // raqamni formatlab chiqaradi.
    // =============================================================
    function applyValue(rawValue) {
        if (!rawValue) {
            inputEl.value = "";
            return;
        }

        let value = rawValue.trim();
        let detectedCode = currentCode;
        let remainingDigits = value;

        // Agar "+" bilan boshlansa — mos kelgan eng uzun davlat kodini topish
        if (value.startsWith("+")) {
            const codes = Object.keys(FORMATS).sort((a, b) => b.length - a.length);
            for (const code of codes) {
                if (value.startsWith(code)) {
                    detectedCode = code;
                    remainingDigits = value.slice(code.length);
                    break;
                }
            }
        }

        // Kod o'zgargan bo'lsa — UI'ni yangilash
        if (detectedCode !== currentCode) {
            currentCode = detectedCode;
            if (codeLabelEl) codeLabelEl.textContent = detectedCode;
        }

        const config = getConfig(currentCode);
        const digits = remainingDigits.replace(/\D/g, "");

        inputEl.placeholder = config.placeholder;
        inputEl.maxLength = config.maxLen;
        inputEl.value = config.format(digits);
    }

    // =============================================================
    // DROPDOWN'NI YOPISH
    // =============================================================
    function closeDropdown() {
        if (!dropdownEl) return;
        dropdownEl.style.display = "none";
        if (iconEl) {
            iconEl.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        }
    }

    // =============================================================
    // DROPDOWN'NI OCHISH / YOPISH (trigger click)
    // =============================================================
    if (triggerEl && dropdownEl) {
        triggerEl.addEventListener("click", function () {
            // Agar ochiq bo'lsa — yopib qo'yamiz
            if (dropdownEl.style.display === "block") {
                closeDropdown();
                return;
            }

            // Aks holda ro'yxatni qayta yaratib, ochamiz
            dropdownEl.innerHTML = "";

            COUNTRIES.forEach(country => {
                const item = document.createElement("div");
                item.className = "country-option";
                if (country.code === currentCode) {
                    item.classList.add("selected");
                }
                item.innerHTML = `
                    <span class="country-name">${country.name}</span>
                    <span class="country-code">${country.code}</span>
                `;

                // Davlat tanlash
                item.addEventListener("click", function () {
                    currentCode = country.code;
                    if (codeLabelEl) codeLabelEl.textContent = country.code;

                    const config = getConfig(currentCode);
                    inputEl.placeholder = config.placeholder;
                    inputEl.maxLength = config.maxLen;
                    inputEl.value = "";

                    if (errorEl) errorEl.style.display = "none";
                    dropdownEl.style.display = "none";
                    if (iconEl) {
                        iconEl.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
                    }
                });

                dropdownEl.appendChild(item);
            });

            dropdownEl.style.display = "block";
            if (iconEl) {
                // Yuqoriga qaratilgan "chevron" (dropdown ochiq ekanligini bildiradi)
                iconEl.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
            }
        });

        // Tashqariga bosilganda dropdown yopiladi
        document.addEventListener("click", function (e) {
            if (!triggerEl.contains(e.target) && !dropdownEl.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // =============================================================
    // INPUT EVENT'LARI
    // =============================================================
    inputEl.addEventListener("input", function (e) {
        applyValue(e.target.value);
        if (errorEl) errorEl.style.display = "none";
    });

    inputEl.addEventListener("change", function (e) {
        applyValue(e.target.value);
    });

    // =============================================================
    // BOSHLANG'ICH HOLAT
    // =============================================================
    const initialConfig = getConfig(currentCode);
    if (codeLabelEl) codeLabelEl.textContent = currentCode;
    inputEl.placeholder = initialConfig.placeholder;
    inputEl.maxLength = initialConfig.maxLen;

    // Agar input'da qiymat bor bo'lsa (masalan reload paytida) — formatlash
    if (inputEl.value && inputEl.value.trim() !== "") {
        applyValue(inputEl.value);
    }

    // =============================================================
    // TASHQI METODLAR (formdan chaqirilishi mumkin)
    // =============================================================
    return {
        getCurrentCode: () => currentCode,
        getConfig: () => getConfig(currentCode),
        validate: (value) => getConfig(currentCode).validate.test(String(value || "").trim())
    };
}