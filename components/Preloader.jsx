"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.to(".preloader-bar-fill", {
        scaleX: 1,
        duration: 1.8,
        ease: "power2.inOut",
      })
        .to(
          ".preloader-title",
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.3
        )
        .to(
          ".preloader-sub",
          { opacity: 1, duration: 0.6 },
          0.8
        )
        .to(ref.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.3,
        })
        .to(
          ref.current,
          { opacity: 0, duration: 0.3 },
          "-=0.2"
        );
    }, ref);

    document.body.style.overflow = "hidden";

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div ref={ref} className="preloader">
      <p
        className="preloader-title heading-serif text-4xl md:text-5xl opacity-0 translate-y-4"
        style={{ transform: "translateY(16px)" }}
      >
        The Continental
      </p>
      <p className="preloader-sub section-label opacity-0">Est. 1924</p>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" />
      </div>
    </div>
  );
}
