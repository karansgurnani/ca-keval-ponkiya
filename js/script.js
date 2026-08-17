/* ==========================================================================
   Keval Ponkiya & Associates (KPA) — site interactions (vanilla JS)
   - Sticky navbar shrink on scroll
   - Mobile nav auto-close on link click
   - Scrollspy active-link highlighting
   - Reveal-on-scroll animations (IntersectionObserver)
   - Animated stat counters
   - Back-to-top button
   - Dynamic copyright year
   ========================================================================== */
(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* ---------- Current year in footer ---------- */
        var yearEl = document.getElementById("year");
        if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

        /* ---------- Sticky navbar shrink ---------- */
        var nav = document.querySelector(".main-nav");
        var onScrollNav = function () {
            if (!nav) { return; }
            nav.classList.toggle("scrolled", window.scrollY > 30);
        };
        onScrollNav();
        window.addEventListener("scroll", onScrollNav, { passive: true });

        /* ---------- Mobile nav (offcanvas): close on link tap ---------- */
        var offcanvasEl = document.getElementById("mobileNav");
        if (offcanvasEl) {
            offcanvasEl.querySelectorAll(".nav-link, .nav-cta").forEach(function (link) {
                link.addEventListener("click", function () {
                    if (offcanvasEl.classList.contains("show") && window.bootstrap) {
                        var inst = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
                        inst.hide();
                    }
                });
            });
        }

        /* ---------- Reveal-on-scroll ---------- */
        var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
        var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced || !("IntersectionObserver" in window)) {
            revealEls.forEach(function (el) { el.classList.add("is-visible"); });
        } else {
            var revealObs = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
            revealEls.forEach(function (el) { revealObs.observe(el); });
        }

        /* ---------- Animated counters ---------- */
        var counters = Array.prototype.slice.call(document.querySelectorAll(".stat-num"));

        var runCounter = function (el) {
            var target = parseInt(el.getAttribute("data-target"), 10) || 0;
            var suffix = el.getAttribute("data-suffix") || "";
            if (prefersReduced) { el.textContent = target + suffix; return; }
            var duration = 1500;
            var start = null;
            var step = function (ts) {
                if (start === null) { start = ts; }
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);      // easeOutCubic
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) { requestAnimationFrame(step); }
            };
            requestAnimationFrame(step);
        };

        if (counters.length) {
            if (!("IntersectionObserver" in window)) {
                counters.forEach(runCounter);
            } else {
                var countObs = new IntersectionObserver(function (entries, obs) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            runCounter(entry.target);
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                counters.forEach(function (el) { countObs.observe(el); });
            }
        }

        /* ---------- Scrollspy: highlight active nav link ---------- */
        var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
        var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav .nav-link"));

        if (sections.length && navLinks.length && "IntersectionObserver" in window) {
            var setActive = function (id) {
                navLinks.forEach(function (link) {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                });
            };
            var spyObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { setActive(entry.target.id); }
                });
            }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
            sections.forEach(function (s) { spyObs.observe(s); });
        }

        /* ---------- Back-to-top ---------- */
        var toTop = document.getElementById("backToTop");
        if (toTop) {
            var onScrollTop = function () {
                toTop.classList.toggle("show", window.scrollY > 500);
            };
            onScrollTop();
            window.addEventListener("scroll", onScrollTop, { passive: true });
            toTop.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
            });
        }
    });
})();
