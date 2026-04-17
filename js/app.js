document.addEventListener("DOMContentLoaded",(function(){const e=document.querySelectorAll(".webinar-cta"),t=document.getElementById("registrationModal"),n=document.getElementById("closeModalBtn"),o=document.querySelector(".homeModalOverlay"),d=document.getElementById("registrationForm"),l=document.getElementById("name"),a=document.getElementById("nameError"),r=document.getElementById("phone"),c=document.getElementById("phoneError"),i=document.getElementById("submitBtn"),s=document.getElementById("selectedCountry"),m=document.getElementById("selectedCountryCode"),u=document.getElementById("countryDropdown"),y=document.getElementById("dropdownIcon"),E=setupPhoneFormatter({inputEl:r,codeLabelEl:m,dropdownEl:u,triggerEl:s,iconEl:y,errorEl:c,defaultCode:"+998"});let g=!1,p=0;function f(){t&&(g=!0,p=window.scrollY,t.style.display="block",document.body.style.overflow="hidden",a.style.display="none",c.style.display="none")}function v(){t&&g&&(g=!1,t.style.display="none",document.body.style.overflow="",document.body.style.position="",document.body.style.top="",window.scrollTo(0,p))}e.forEach((e=>e.addEventListener("click",f))),n&&n.addEventListener("click",v),o&&o.addEventListener("click",v),document.querySelectorAll(".title, .event__list__title, .text span, .expert__img").forEach((function(el){el.style.cursor="pointer";el.addEventListener("click",f)})),d.addEventListener("submit",(function(e){e.preventDefault();const t=l.value.trim(),n=r.value.trim();let o=!1;if(t?a.style.display="none":(a.style.display="block",o=!0),E.validate(n)?c.style.display="none":(c.style.display="block",o=!0),o)return;i.textContent="YUBORILMOQDA...",i.disabled=!0;const d=new Date,s=d.toLocaleDateString("uz-UZ"),m=d.toLocaleTimeString("uz-UZ"),u={Ism:t,TelefonRaqam:E.getCurrentCode()+" "+n,SanaSoat:s+" - "+m};localStorage.setItem("formData",JSON.stringify(u)),window.location.href="/thankYou.html",i.textContent="DAVOM ETISH",i.disabled=!1,l.value="",r.value="",v()}))})),document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".webinar-faq__dropdown").forEach((e=>{const t=e.querySelector(".webinar-faq__dropdown__head");t&&t.addEventListener("click",(function(){if(e.classList.contains("is-open"))e.classList.remove("is-open"),e.style.maxHeight="80px";else{e.classList.add("is-open"),e.style.maxHeight="200px";const t=e.scrollHeight;e.style.maxHeight=t+"px"}}))}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("timer");if(!e)return;let t=120;const n=setInterval((()=>{const o=Math.floor(t/60),d=t%60;e.textContent=`${String(o).padStart(2,"0")}:${String(d).padStart(2,"0")}`,t<=0&&clearInterval(n),t--}),1e3)}));

document.addEventListener("DOMContentLoaded", function () {
    if (typeof setupPhoneFormatter !== "function") return;
    const input = document.getElementById("applyPhone");
    if (!input) return;

    const api = setupPhoneFormatter({
        inputEl: input,
        codeLabelEl: document.getElementById("applyCode"),
        dropdownEl: document.getElementById("applyDropdown"),
        triggerEl: document.getElementById("applyCountry"),
        iconEl: document.getElementById("applyCaret"),
        errorEl: document.getElementById("applyPhoneError"),
        defaultCode: "+998"
    });

    const form = document.getElementById("applyForm");
    const errorEl = document.getElementById("applyPhoneError");
    const typeEl = document.getElementById("applyType");
    const roomsEl = document.getElementById("applyRooms");
    const addressEl = document.getElementById("applyAddress");
    const nameEl = document.getElementById("applyName");
    const submitBtn = form ? form.querySelector(".apply__btn") : null;
    if (!form) return;

    function getSelectValue(el) {
        if (!el) return "";
        if (el.value) return el.value;
        const opt = el.options && el.options[el.selectedIndex];
        return opt ? opt.text : "";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const val = input.value.trim();
        if (!api.validate(val)) {
            if (errorEl) errorEl.style.display = "block";
            input.focus();
            return;
        }
        if (errorEl) errorEl.style.display = "none";

        const name = (nameEl && nameEl.value.trim()) || "";
        if (!name) {
            nameEl && nameEl.focus();
            return;
        }

        const type = getSelectValue(typeEl);
        const rooms = getSelectValue(roomsEl);
        const address = (addressEl && addressEl.value.trim()) || "";

        if (submitBtn) {
            submitBtn.textContent = "YUBORILMOQDA...";
            submitBtn.disabled = true;
        }

        const d = new Date();
        const sana = d.toLocaleDateString("uz-UZ");
        const soat = d.toLocaleTimeString("uz-UZ");

        const applyData = {
            Ism: name,
            TelefonRaqam: api.getCurrentCode() + " " + val,
            SanaSoat: sana + " - " + soat,
            XonadonTuri: type,
            XonalarSoni: rooms,
            Manzil: address
        };

        localStorage.setItem("applyFormData", JSON.stringify(applyData));
        window.location.href = "/thankYou.html";
    });

    input.addEventListener("input", function () {
        if (errorEl) errorEl.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const viewport = document.querySelector(".gallery__viewport");
    const grid = document.querySelector(".gallery__grid");
    if (!viewport || !grid) return;

    const slides = grid.querySelectorAll(".gallery__image");
    const prevBtn = document.querySelector(".gallery__nav-btn--prev");
    const nextBtn = document.querySelector(".gallery__nav-btn--next");
    const dotsWrap = document.querySelector(".gallery__dots");
    const total = slides.length;
    if (!total) return;

    let index = 0;
    let autoTimer;
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let startTime = 0;

    if (dotsWrap) {
        dotsWrap.innerHTML = "";
        for (let i = 0; i < total; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "gallery__dot" + (i === 0 ? " is-active" : "");
            dot.setAttribute("aria-label", "Slide " + (i + 1));
            dot.addEventListener("click", function () { goTo(i); });
            dotsWrap.appendChild(dot);
        }
    }

    function setTransition(on) {
        grid.style.transition = on ? "transform 450ms cubic-bezier(0.25, 0.8, 0.3, 1)" : "none";
    }

    function translate(px) {
        grid.style.transform = "translate3d(" + px + "px, 0, 0)";
    }

    function slideWidth() {
        return viewport.getBoundingClientRect().width;
    }

    function goTo(i, animated) {
        index = (i + total) % total;
        setTransition(animated !== false);
        translate(-index * slideWidth());
        if (dotsWrap) {
            dotsWrap.querySelectorAll(".gallery__dot").forEach(function (d, idx) {
                d.classList.toggle("is-active", idx === index);
            });
        }
        restartAuto();
    }

    function restartAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(function () { goTo(index + 1); }, 4000);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

    function onDown(x) {
        dragging = true;
        startX = x;
        currentX = x;
        startTime = Date.now();
        setTransition(false);
        clearInterval(autoTimer);
    }

    function onMove(x) {
        if (!dragging) return;
        currentX = x;
        const dx = currentX - startX;
        translate(-index * slideWidth() + dx);
    }

    function onUp() {
        if (!dragging) return;
        dragging = false;
        const dx = currentX - startX;
        const dt = Date.now() - startTime;
        const w = slideWidth();
        const velocity = dx / dt;
        let target = index;
        if (Math.abs(dx) > w * 0.2 || Math.abs(velocity) > 0.5) {
            target = index + (dx < 0 ? 1 : -1);
        }
        goTo(target);
    }

    grid.addEventListener("touchstart", function (e) {
        onDown(e.touches[0].clientX);
    }, { passive: true });
    grid.addEventListener("touchmove", function (e) {
        onMove(e.touches[0].clientX);
    }, { passive: true });
    grid.addEventListener("touchend", onUp);
    grid.addEventListener("touchcancel", onUp);

    grid.addEventListener("mousedown", function (e) {
        e.preventDefault();
        onDown(e.clientX);
    });
    window.addEventListener("mousemove", function (e) {
        if (dragging) onMove(e.clientX);
    });
    window.addEventListener("mouseup", onUp);

    grid.addEventListener("dragstart", function (e) { e.preventDefault(); });

    window.addEventListener("resize", function () {
        setTransition(false);
        translate(-index * slideWidth());
    });

    goTo(0, false);
    restartAuto();
});

