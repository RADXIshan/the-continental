"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip transition on first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Still scroll to top on first load
      window.scrollTo(0, 0);
      return;
    }

    // Create overlay element if it doesn't exist
    if (!overlayRef.current) {
      overlayRef.current = document.createElement("div");
      overlayRef.current.className = "page-transition-overlay";
      document.body.appendChild(overlayRef.current);
    }

    const overlay = overlayRef.current;

    // Scroll to top BEFORE transition starts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Animate in
    gsap.set(overlay, {
      display: "block",
      scaleY: 0,
      transformOrigin: "bottom center",
    });

    const tl = gsap.timeline();

    // Curtain closes (scales up from bottom)
    tl.to(overlay, {
      scaleY: 1,
      duration: 0.6,
      ease: "power3.inOut",
    })
      // Brief pause at full coverage - scroll happens here too
      .call(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      })
      .to(overlay, {
        duration: 0.15,
      })
      // Curtain opens (scales down from top)
      .to(overlay, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          // Final scroll to top after transition
          window.scrollTo(0, 0);
        },
      });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (overlayRef.current && overlayRef.current.parentNode) {
        overlayRef.current.parentNode.removeChild(overlayRef.current);
      }
    };
  }, []);

  return null;
}
