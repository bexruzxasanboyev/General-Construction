/**
 * app.js — landing sahifaning asosiy JS fayli
 *
 * TARKIB:
 *   1) Registration modal (webinar CTA) + form submit
 *   2) FAQ akkordion
 *   3) Countdown timer (120 soniya)
 *   4) Apply form (kvartira qidirish anketasi)
 *   5) Gallery slider (touch/drag qo'llab-quvvatlovchi)
 *
 * Bog'liqlik: phone-formatter.js (setupPhoneFormatter funksiyasi)
 */


// =================================================================
// 1) REGISTRATION MODAL + WEBINAR CTA
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    const ctaButtons  = document.querySelectorAll(".webinar-cta");
    const modal       = document.getElementById("registrationModal");
    const closeBtn    = document.getElementById("closeModalBtn");
    const overlay     = document.querySelector(".homeModalOverlay");
    const form        = document.getElementById("registrationForm");
    const nameInput   = document.getElementById("name");
    const nameError   = document.getElementById("nameError");
    const phoneInput  = document.getElementById("phone");
    const phoneError  = document.getElementById("phoneError");
    const submitBtn   = document.getElementById("submitBtn");

    // Telefon formatter uchun kerak bo'ladigan elementlar
    const selectedCountry     = document.getElementById("selectedCountry");
    const selectedCountryCode = document.getElementById("selectedCountryCode");
    const countryDropdown     = document.getElementById("countryDropdown");
    const dropdownIcon        = document.getElementById("dropdownIcon");

    // Phone formatter'ni ishga tushirish
    const phoneFormatter = setupPhoneFormatter({
        inputEl:     phoneInput,
        codeLabelEl: selectedCountryCode,
        dropdownEl:  countryDropdown,
        triggerEl:   selectedCountry,
        iconEl:      dropdownIcon,
        errorEl:     phoneError,
        defaultCode: "+998"
    });

    let isModalOpen = false;
    let savedScrollY = 0;

    function openModal() {
        if (!modal) return;
        isModalOpen = true;
        savedScrollY = window.scrollY;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        nameError.style.display = "none";
        phoneError.style.display = "none";
    }

    function closeModal() {
        if (!modal || !isModalOpen) return;
        isModalOpen = false;
        modal.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, savedScrollY);
    }

    // Webinar CTA tugmalari modal ochadi
    ctaButtons.forEach(btn => btn.addEventListener("click", openModal));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay)  overlay.addEventListener("click",  closeModal);

    // Boshqa clickable elementlar (title, tadbir ro'yxati va hk) ham modal ochadi
    document.querySelectorAll(".title, .event__list__title, .text span, .expert__img")
        .forEach(function (el) {
            el.style.cursor = "pointer";
            el.addEventListener("click", openModal);
        });

    // ===== FORM SUBMIT =====
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name  = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        let hasError = false;

        // Validatsiya — ism
        if (!name) {
            nameError.style.display = "block";
            hasError = true;
        } else {
            nameError.style.display = "none";
        }

        // Validatsiya — telefon
        if (!phoneFormatter.validate(phone)) {
            phoneError.style.display = "block";
            hasError = true;
        } else {
            phoneError.style.display = "none";
        }

        if (hasError) return;

        // Tugma holatini o'zgartirish
        submitBtn.textContent = "YUBORILMOQDA...";
        submitBtn.disabled = true;

        // Sana va soatni uz-UZ formatida yig'ish
        const now  = new Date();
        const date = now.toLocaleDateString("uz-UZ");
        const time = now.toLocaleTimeString("uz-UZ");

        // localStorage ga saqlash (keyin thankyou.js buni oladi)
        const data = {
            Ism: name,
            TelefonRaqam: phoneFormatter.getCurrentCode() + " " + phone,
            SanaSoat: date + " - " + time
        };
        localStorage.setItem("formData", JSON.stringify(data));

        // Thank You sahifaga redirect
        window.location.href = "/thankYou.html";

        // Tozalash (redirect'dan keyin ham ishlasa ham xalaqit bermaydi)
        submitBtn.textContent = "DAVOM ETISH";
        submitBtn.disabled = false;
        nameInput.value = "";
        phoneInput.value = "";
        closeModal();
    });
});


// =================================================================
// 2) FAQ AKKORDION
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".webinar-faq__dropdown").forEach(item => {
        const head = item.querySelector(".webinar-faq__dropdown__head");
        if (!head) return;

        head.addEventListener("click", function () {
            if (item.classList.contains("is-open")) {
                item.classList.remove("is-open");
                item.style.maxHeight = "80px";
            } else {
                item.classList.add("is-open");
                item.style.maxHeight = "200px";
                // Haqiqiy balandlikni olib, smooth transition'ga moslash
                const fullHeight = item.scrollHeight;
                item.style.maxHeight = fullHeight + "px";
            }
        });
    });
});


// =================================================================
// 3) COUNTDOWN TIMER (120 soniya)
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    const timerEl = document.getElementById("timer");
    if (!timerEl) return;

    let secondsLeft = 120;

    const interval = setInterval(() => {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        timerEl.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (secondsLeft <= 0) clearInterval(interval);
        secondsLeft--;
    }, 1000);
});


// =================================================================
// 4) APPLY FORM (kvartira qidirish anketasi)
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    if (typeof setupPhoneFormatter !== "function") return;

    const phoneInput = document.getElementById("applyPhone");
    if (!phoneInput) return;

    const phoneFormatter = setupPhoneFormatter({
        inputEl:     phoneInput,
        codeLabelEl: document.getElementById("applyCode"),
        dropdownEl:  document.getElementById("applyDropdown"),
        triggerEl:   document.getElementById("applyCountry"),
        iconEl:      document.getElementById("applyCaret"),
        errorEl:     document.getElementById("applyPhoneError"),
        defaultCode: "+998"
    });

    const form         = document.getElementById("applyForm");
    const phoneError   = document.getElementById("applyPhoneError");
    const typeSelect   = document.getElementById("applyType");
    const roomsSelect  = document.getElementById("applyRooms");
    const addressInput = document.getElementById("applyAddress");
    const nameInput    = document.getElementById("applyName");
    const submitBtn    = form ? form.querySelector(".apply__btn") : null;

    // Select'dan qiymat yoki matnni olish
    function getSelectValue(selectEl) {
        if (!selectEl) return "";
        if (selectEl.value) return selectEl.value;
        const option = selectEl.options && selectEl.options[selectEl.selectedIndex];
        return option ? option.text : "";
    }

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const phone = phoneInput.value.trim();

        // Validatsiya
        if (!phoneFormatter.validate(phone)) {
            if (phoneError) phoneError.style.display = "block";
            phoneInput.focus();
            return;
        }
        if (phoneError) phoneError.style.display = "none";

        // Qiymatlarni yig'ish
        const name         = nameInput && nameInput.value.trim() || "";
        const xonadonTuri  = getSelectValue(typeSelect);
        const xonalarSoni  = getSelectValue(roomsSelect);
        const manzil       = addressInput && addressInput.value.trim() || "";

        // Tugma holati
        if (submitBtn) {
            submitBtn.textContent = "YUBORILMOQDA...";
            submitBtn.disabled = true;
        }

        // Sana/soat
        const now  = new Date();
        const date = now.toLocaleDateString("uz-UZ");
        const time = now.toLocaleTimeString("uz-UZ");

        // localStorage ga saqlash
        const data = {
            Ism: name,
            TelefonRaqam: phoneFormatter.getCurrentCode() + " " + phone,
            SanaSoat: date + " - " + time,
            XonadonTuri: xonadonTuri,
            XonalarSoni: xonalarSoni,
            Manzil: manzil
        };
        localStorage.setItem("applyFormData", JSON.stringify(data));

        // Thank You sahifaga redirect
        window.location.href = "/thankYou.html";
    });

    // Foydalanuvchi yozishni boshlasa — xato xabarini yashirish
    phoneInput.addEventListener("input", function () {
        if (phoneError) phoneError.style.display = "none";
    });
});


// =================================================================
// 5) GALLERY SLIDER (touch/drag qo'llab-quvvatlovchi)
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    const viewport = document.querySelector(".gallery__viewport");
    const grid     = document.querySelector(".gallery__grid");
    if (!viewport || !grid) return;

    const images  = grid.querySelectorAll(".gallery__image");
    const prevBtn = document.querySelector(".gallery__nav-btn--prev");
    const nextBtn = document.querySelector(".gallery__nav-btn--next");
    const dotsBox = document.querySelector(".gallery__dots");
    const total   = images.length;
    if (!total) return;

    let autoplayTimer;
    let currentIndex = 0;
    let dragStartX   = 0;
    let dragCurrentX = 0;
    let isDragging   = false;
    let dragStartTime = 0;

    // Dot'larni generatsiya qilish
    if (dotsBox) {
        dotsBox.innerHTML = "";
        for (let i = 0; i < total; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "gallery__dot" + (i === 0 ? " is-active" : "");
            dot.setAttribute("aria-label", "Slide " + (i + 1));
            dot.addEventListener("click", function () {
                goToSlide(i);
            });
            dotsBox.appendChild(dot);
        }
    }

    function setTransition(enabled) {
        grid.style.transition = enabled
            ? "transform 450ms cubic-bezier(0.25, 0.8, 0.3, 1)"
            : "none";
    }

    function setTransform(px) {
        grid.style.transform = "translate3d(" + px + "px, 0, 0)";
    }

    function getViewportWidth() {
        return viewport.getBoundingClientRect().width;
    }

    function goToSlide(index, animate) {
        // Circular index (oxiridan bosh tomonga va aksincha)
        currentIndex = (index + total) % total;

        setTransition(animate !== false);
        setTransform(-currentIndex * getViewportWidth());

        // Dot'larni yangilash
        if (dotsBox) {
            dotsBox.querySelectorAll(".gallery__dot").forEach((dot, i) => {
                dot.classList.toggle("is-active", i === currentIndex);
            });
        }

        restartAutoplay();
    }

    function restartAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
    }

    // === DRAG/TOUCH HANDLERS ===
    function onDragStart(clientX) {
        isDragging = true;
        dragStartX = clientX;
        dragCurrentX = clientX;
        dragStartTime = Date.now();
        setTransition(false);
        clearInterval(autoplayTimer);
    }

    function onDragMove(clientX) {
        if (!isDragging) return;
        dragCurrentX = clientX;
        const delta = dragCurrentX - dragStartX;
        setTransform(-currentIndex * getViewportWidth() + delta);
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const delta    = dragCurrentX - dragStartX;
        const duration = Date.now() - dragStartTime;
        const width    = getViewportWidth();
        const velocity = delta / duration;

        let targetIndex = currentIndex;

        // Agar siljish > 20% yoki tezlik > 0.5 bo'lsa — keyingi/oldingi slayd
        if (Math.abs(delta) > 0.2 * width || Math.abs(velocity) > 0.5) {
            targetIndex = currentIndex + (delta < 0 ? 1 : -1);
        }

        goToSlide(targetIndex);
    }

    // Navigatsiya tugmalari
    if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Touch (mobile)
    grid.addEventListener("touchstart", (e) => onDragStart(e.touches[0].clientX), { passive: true });
    grid.addEventListener("touchmove",  (e) => onDragMove(e.touches[0].clientX),  { passive: true });
    grid.addEventListener("touchend",   onDragEnd);
    grid.addEventListener("touchcancel", onDragEnd);

    // Mouse (desktop)
    grid.addEventListener("mousedown", (e) => {
        e.preventDefault();
        onDragStart(e.clientX);
    });
    window.addEventListener("mousemove", (e) => {
        if (isDragging) onDragMove(e.clientX);
    });
    window.addEventListener("mouseup", onDragEnd);

    // Drag tasvirini o'chirish (brauzer default xulqi)
    grid.addEventListener("dragstart", (e) => e.preventDefault());

    // Oyna o'lchami o'zgarganda pozitsiyani qayta hisoblash
    window.addEventListener("resize", () => {
        setTransition(false);
        setTransform(-currentIndex * getViewportWidth());
    });

    // Start
    goToSlide(0, false);
    restartAutoplay();
});