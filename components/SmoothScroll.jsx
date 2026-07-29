"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Reduce smoothness on touch/mobile — native scroll feels better there
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const lenis = new Lenis({
      duration: isTouchDevice ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: isTouchDevice ? 1.2 : 1.5,
      // Prevent scroll smoothing from interfering with pinned scroll sections
      wheelMultiplier: 1,
    });

    // Expose lenis globally so other components can control it
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => lenis.resize();
    window.addEventListener("resize", refresh);
    ScrollTrigger.addEventListener("refresh", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      ScrollTrigger.removeEventListener("refresh", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.lenis;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return children;
}
