"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
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
          scrub: true,
        },
      });

      gsap.to(".hero-overlay", {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
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
          scrub: true,
        },
      });

      gsap.from(".hero-headline .line", {
        y: "110%",
        duration: 1.2,
        stagger: 0.15,
        delay: 2.4,
        ease: "power4.out",
      });

      gsap.from(".hero-search", {
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 2.8,
        ease: "power3.out",
      });

      gsap.from(".hero-scroll-hint", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 3.2,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      <div className="hero-bg absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2400&auto=format&fit=crop"
          alt="The Continental — luxury lakeside retreat at night"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/20 to-midnight/90 opacity-60" />

      <div className="hero-watermark absolute inset-0 flex items-start justify-center pt-[12vh] md:pt-[8vh] pointer-events-none">
        <h1
          aria-hidden
          className="watermark-text text-[18vw] md:text-[16vw] leading-none whitespace-nowrap"
        >
          Continental
        </h1>
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col justify-end pb-10 md:pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="hero-headline max-w-2xl">
            <h2 className="heading-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream">
              <span className="line-reveal block">
                <span className="line block">Where Timeless</span>
              </span>
              <span className="line-reveal block">
                <span className="line block">Elegance Awaits</span>
              </span>
            </h2>
            <p className="mt-6 text-muted text-base md:text-lg max-w-md leading-relaxed opacity-0 animate-[fadeIn_1s_ease_3s_forwards]">
              A sanctuary of refined luxury nestled where starlit waters meet
              architectural brilliance.
            </p>
          </div>

          <div className="hero-search glass-pill flex items-center rounded-full p-2 pl-6 max-w-md w-full lg:w-auto lg:min-w-[380px]">
            <input
              type="text"
              placeholder="Search availability"
              className="flex-1 bg-transparent text-cream placeholder:text-white/40 text-sm outline-none min-w-0"
            />
            <button type="button" className="btn-amber rounded-full px-6 py-3 text-sm shrink-0">
              Search
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="section-label text-[0.6rem] text-white/40">
            Scroll to explore
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-amber/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
