"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);

  // Scroll-driven parallax only — entrance is handled by HomePage timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-watermark", {
        yPercent: -15,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-overlay", {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-content", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      <div className="hero-bg absolute inset-0 scale-110" style={{ willChange: "transform" }}>
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2400&auto=format&fit=crop"
          alt="The Continental — luxury lakeside retreat at night"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-midnight/75 via-midnight/30 to-midnight/50 opacity-60" />

      <div className="hero-watermark absolute inset-0 flex items-start justify-center pt-[12vh] md:pt-[8vh] pointer-events-none" style={{ willChange: "transform, opacity" }}>
        <h1
          aria-hidden
          className="watermark-text text-[22vw] sm:text-[18vw] md:text-[16vw] leading-none whitespace-nowrap"
        >
          Continental
        </h1>
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col justify-end pb-10 md:pb-16 px-6 md:px-10 max-w-[1400px] mx-auto" style={{ willChange: "transform, opacity" }}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10">
          <div className="max-w-2xl">
            <h2 className="heading-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-cream font-semibold">
              <span className="line-reveal block">
                <span
                  className="hero-line-1 block"
                  style={{ transform: "translateY(110%)" }}
                >
                  Where Timeless
                </span>
              </span>
              <span className="line-reveal block">
                <span
                  className="hero-line-2 block"
                  style={{ transform: "translateY(110%)" }}
                >
                  Elegance Awaits
                </span>
              </span>
            </h2>

            <p
              className="hero-subtext mt-5 text-muted text-base md:text-lg max-w-md leading-relaxed font-medium"
              style={{ opacity: 0, transform: "translateY(16px)" }}
            >
              A sanctuary of refined luxury nestled where starlit waters meet
              architectural brilliance.
            </p>
          </div>

          <div
            className="hero-search glass-pill flex items-center rounded-full p-2 pl-5 w-full sm:max-w-md lg:w-auto lg:min-w-[380px]"
            style={{ opacity: 0, transform: "translateX(60px)" }}
          >
            <input
              type="text"
              placeholder="Search availability"
              className="flex-1 bg-transparent text-cream placeholder:text-white/40 text-sm outline-none min-w-0"
            />
            <button
              type="button"
              className="btn-amber rounded-full px-5 py-3 text-sm shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        <div
          className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          <span className="section-label text-[0.6rem] text-white/40">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-amber/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
