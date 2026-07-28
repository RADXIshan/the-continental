"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Hide app content immediately when any internal link is clicked,
// before Next.js even starts the navigation. This prevents the
// split-second flash of the new page before the curtain covers it.
function hideAppContent() {
  const el = document.getElementById("app-content");
  if (el) el.style.visibility = "hidden";
}

function showAppContent() {
  const el = document.getElementById("app-content");
  if (el) el.style.visibility = "";
}

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const isFirstRender = useRef(true);

  // Attach a global click listener that hides content the moment any
  // internal <a> is clicked — before the route change fires.
  useEffect(() => {
    function onLinkClick(e) {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal navigations (not hash links or external)
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      const isHash = href.startsWith("#") || href.startsWith("/#");
      if (!isInternal || isHash) return;

      // Same page? skip
      const targetPath = href.split("#")[0];
      if (targetPath === window.location.pathname) return;

      hideAppContent();
    }

    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, []);

  useEffect(() => {
    // Skip transition on first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      window.scrollTo(0, 0);
      return;
    }

    // Build overlay DOM once
    if (!overlayRef.current) {
      const overlay = document.createElement("div");
      overlay.className = "page-transition-overlay";

      const logo = document.createElement("div");
      logo.className = "page-transition-logo";
      logo.innerHTML = `
        <div class="page-transition-logo__ornament">
          <svg width="72" height="10" viewBox="0 0 72 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0"  y1="5" x2="28" y2="5" stroke="#e8a849" stroke-width="0.5" opacity="0.35" />
            <line x1="0"  y1="5" x2="14" y2="5" stroke="#e8a849" stroke-width="0.5" opacity="0.6" />
            <rect x="31" y="2" width="6" height="6" transform="rotate(45 34 5)" fill="none" stroke="#e8a849" stroke-width="0.6" opacity="0.8" />
            <rect x="32.5" y="3.5" width="3" height="3" transform="rotate(45 34 5)" fill="#e8a849" opacity="0.6" />
            <line x1="44" y1="5" x2="72" y2="5" stroke="#e8a849" stroke-width="0.5" opacity="0.35" />
            <line x1="58" y1="5" x2="72" y2="5" stroke="#e8a849" stroke-width="0.5" opacity="0.6" />
          </svg>
        </div>
        <span class="page-transition-logo__wordmark">Continental</span>
        <span class="page-transition-logo__est">Est.&nbsp;&nbsp;1924</span>
      `;
      overlay.appendChild(logo);
      document.body.appendChild(overlay);

      overlayRef.current = overlay;
      logoRef.current = logo;
    }

    const overlay = overlayRef.current;
    const logo = logoRef.current;

    // Ensure content stays hidden while curtain animates in
    hideAppContent();

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    gsap.set(overlay, {
      display: "flex",
      scaleY: 1, // start fully covering — content is already hidden
      transformOrigin: "bottom center",
    });
    gsap.set(logo, { opacity: 0, y: 10 });

    const tl = gsap.timeline();

    // Logo fades in (curtain is already fully closed)
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    })
      // Brief hold
      .to({}, { duration: 0.2 })
      // Reveal incoming page content, then open curtain
      .call(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        showAppContent();
      })
      // Logo fades out
      .to(logo, {
        opacity: 0,
        y: -8,
        duration: 0.2,
        ease: "power2.in",
      })
      // Curtain opens (scales down from top)
      .to(overlay, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          window.scrollTo(0, 0);
        },
      });

    return () => {
      tl.kill();
      showAppContent();
    };
  }, [pathname]);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      if (overlayRef.current?.parentNode) {
        overlayRef.current.parentNode.removeChild(overlayRef.current);
      }
      showAppContent();
    };
  }, []);

  return null;
}
