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
        <span class="page-transition-logo__wordmark">Continental</span>
        <span class="page-transition-logo__est">Est. 1924</span>
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
