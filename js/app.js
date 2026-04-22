document.addEventListener("DOMContentLoaded", function() { const e = document.querySelectorAll(".webinar-cta"),
        t = document.getElementById("registrationModal"),
        n = document.getElementById("closeModalBtn"),
        o = document.querySelector(".homeModalOverlay"),
        l = document.getElementById("registrationForm"),
        d = document.getElementById("name"),
        r = document.getElementById("nameError"),
        a = document.getElementById("phone"),
        i = document.getElementById("phoneError"),
        c = document.getElementById("submitBtn"),
        s = document.getElementById("selectedCountry"),
        u = document.getElementById("selectedCountryCode"),
        m = document.getElementById("countryDropdown"),
        y = document.getElementById("dropdownIcon"),
        p = setupPhoneFormatter({ inputEl: a, codeLabelEl: u, dropdownEl: m, triggerEl: s, iconEl: y, errorEl: i, defaultCode: "+998" }); let E = !1,
        g = 0;

    function f() { t && (E = !0, g = window.scrollY, t.style.display = "block", document.body.style.overflow = "hidden", r.style.display = "none", i.style.display = "none") }

    function v() { t && E && (E = !1, t.style.display = "none", document.body.style.overflow = "", document.body.style.position = "", document.body.style.top = "", window.scrollTo(0, g)) }
    e.forEach(e => e.addEventListener("click", f)), n && n.addEventListener("click", v), o && o.addEventListener("click", v), document.querySelectorAll(".title, .event__list__title, .text span, .expert__img").forEach(function(e) { e.style.cursor = "pointer", e.addEventListener("click", f) }), l.addEventListener("submit", function(e) { e.preventDefault(); const t = d.value.trim(),
            n = a.value.trim(); let o = !1; if (t ? r.style.display = "none" : (r.style.display = "block", o = !0), p.validate(n) ? i.style.display = "none" : (i.style.display = "block", o = !0), o) return;
        c.textContent = "YUBORILMOQDA...", c.disabled = !0; const l = new Date,
            s = l.toLocaleDateString("uz-UZ"),
            u = l.toLocaleTimeString("uz-UZ"),
            m = { Ism: t, TelefonRaqam: p.getCurrentCode() + " " + n, SanaSoat: s + " - " + u };
        localStorage.setItem("formData", JSON.stringify(m)), window.location.href = "/thankYou.html", c.textContent = "DAVOM ETISH", c.disabled = !1, d.value = "", a.value = "", v() }) }), document.addEventListener("DOMContentLoaded", function() { document.querySelectorAll(".webinar-faq__dropdown").forEach(e => { const t = e.querySelector(".webinar-faq__dropdown__head");
        t && t.addEventListener("click", function() { if (e.classList.contains("is-open")) e.classList.remove("is-open"), e.style.maxHeight = "80px";
            else { e.classList.add("is-open"), e.style.maxHeight = "200px"; const t = e.scrollHeight;
                e.style.maxHeight = t + "px" } }) }) }), document.addEventListener("DOMContentLoaded", () => { const e = document.getElementById("timer"); if (!e) return; let t = 120; const n = setInterval(() => { const o = Math.floor(t / 60),
            l = t % 60;
        e.textContent = `${String(o).padStart(2,"0")}:${String(l).padStart(2,"0")}`, t <= 0 && clearInterval(n), t-- }, 1e3) }), document.addEventListener("DOMContentLoaded", function() { if ("function" != typeof setupPhoneFormatter) return; const e = document.getElementById("applyPhone"); if (!e) return; const t = setupPhoneFormatter({ inputEl: e, codeLabelEl: document.getElementById("applyCode"), dropdownEl: document.getElementById("applyDropdown"), triggerEl: document.getElementById("applyCountry"), iconEl: document.getElementById("applyCaret"), errorEl: document.getElementById("applyPhoneError"), defaultCode: "+998" }),
        n = document.getElementById("applyForm"),
        o = document.getElementById("applyPhoneError"),
        l = document.getElementById("applyType"),
        d = document.getElementById("applyRooms"),
        r = document.getElementById("applyAddress"),
        a = document.getElementById("applyName"),
        i = n ? n.querySelector(".apply__btn") : null;

    function c(e) { if (!e) return ""; if (e.value) return e.value; const t = e.options && e.options[e.selectedIndex]; return t ? t.text : "" }
    n && (n.addEventListener("submit", function(n) { n.preventDefault(); const s = e.value.trim(); if (!t.validate(s)) return o && (o.style.display = "block"), void e.focus();
        o && (o.style.display = "none"); const u = a && a.value.trim() || "",
            m = c(l),
            y = c(d),
            p = r && r.value.trim() || "";
        i && (i.textContent = "YUBORILMOQDA...", i.disabled = !0); const E = new Date,
            g = E.toLocaleDateString("uz-UZ"),
            f = E.toLocaleTimeString("uz-UZ"),
            v = { Ism: u, TelefonRaqam: t.getCurrentCode() + " " + s, SanaSoat: g + " - " + f, XonadonTuri: m, XonalarSoni: y, Manzil: p };
        localStorage.setItem("applyFormData", JSON.stringify(v)), window.location.href = "/thankYou.html" }), e.addEventListener("input", function() { o && (o.style.display = "none") })) }), document.addEventListener("DOMContentLoaded", function() { const e = document.querySelector(".gallery__viewport"),
        t = document.querySelector(".gallery__grid"); if (!e || !t) return; const n = t.querySelectorAll(".gallery__image"),
        o = document.querySelector(".gallery__nav-btn--prev"),
        l = document.querySelector(".gallery__nav-btn--next"),
        d = document.querySelector(".gallery__dots"),
        r = n.length; if (!r) return; let a, i = 0,
        c = 0,
        s = 0,
        u = !1,
        m = 0; if (d) { d.innerHTML = ""; for (let e = 0; e < r; e++) { const t = document.createElement("button");
            t.type = "button", t.className = "gallery__dot" + (0 === e ? " is-active" : ""), t.setAttribute("aria-label", "Slide " + (e + 1)), t.addEventListener("click", function() { g(e) }), d.appendChild(t) } }

    function y(e) { t.style.transition = e ? "transform 450ms cubic-bezier(0.25, 0.8, 0.3, 1)" : "none" }

    function p(e) { t.style.transform = "translate3d(" + e + "px, 0, 0)" }

    function E() { return e.getBoundingClientRect().width }

    function g(e, t) { i = (e + r) % r, y(!1 !== t), p(-i * E()), d && d.querySelectorAll(".gallery__dot").forEach((e, t) => { e.classList.toggle("is-active", t === i) }), f() }

    function f() { clearInterval(a), a = setInterval(() => g(i + 1), 4e3) }

    function v(e) { u = !0, c = e, s = e, m = Date.now(), y(!1), clearInterval(a) }

    function L(e) { if (!u) return;
        s = e; const t = s - c;
        p(-i * E() + t) }

    function I() { if (!u) return;
        u = !1; const e = s - c,
            t = Date.now() - m,
            n = E(),
            o = e / t; let l = i;
        (Math.abs(e) > .2 * n || Math.abs(o) > .5) && (l = i + (e < 0 ? 1 : -1)), g(l) }
    o && o.addEventListener("click", () => g(i - 1)), l && l.addEventListener("click", () => g(i + 1)), t.addEventListener("touchstart", e => v(e.touches[0].clientX), { passive: !0 }), t.addEventListener("touchmove", e => L(e.touches[0].clientX), { passive: !0 }), t.addEventListener("touchend", I), t.addEventListener("touchcancel", I), t.addEventListener("mousedown", e => { e.preventDefault(), v(e.clientX) }), window.addEventListener("mousemove", e => { u && L(e.clientX) }), window.addEventListener("mouseup", I), t.addEventListener("dragstart", e => e.preventDefault()), window.addEventListener("resize", () => { y(!1), p(-i * E()) }), g(0, !1), f() });