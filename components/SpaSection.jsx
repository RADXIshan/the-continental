"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const treatments = [
  {
    number: "01",
    name: "Signature Ritual",
    duration: "120 min",
    desc: "Full-body renewal with rare botanical oils drawn from the Alpine meadows. Begins with dry brushing and concludes with hot-stone integration.",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "02",
    name: "Thermal Hydrotherapy",
    duration: "90 min",
    desc: "A journey through ancient thermal pools and mineral springs at contrasting temperatures — designed to reset the nervous system and restore deep calm.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    name: "Couples Sanctuary",
    duration: "180 min",
    desc: "A private candlelit suite, champagne, and synchronised treatments crafted for two. The evening concludes with a private soak in a cedar hot tub.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "04",
    name: "Lumière Facial",
    duration: "75 min",
    desc: "Swiss cellular science meets ancient lymphatic technique. Formulated exclusively for The Continental using high-altitude botanicals.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
  },
];

function CursorImage({ visible, position, src, alt }) {
  return (
    <div
      className="pointer-events-none fixed z-[200] w-44 h-56 overflow-hidden rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="176px"
        />
      )}
      <div className="absolute inset-0 bg-midnight/20" />
    </div>
  );
}

export default function SpaSection() {
  const sectionRef = useRef(null);
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0, src: "", alt: "" });
  const rafRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Smooth cursor follow via RAF
  useEffect(() => {
    const move = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);

    const loop = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.12;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.12;
      setCursor((prev) =>
        prev.visible
          ? { ...prev, x: currentPos.current.x, y: currentPos.current.y }
          : prev
      );
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleRowEnter = (treatment) => {
    setCursor({
      visible: true,
      x: currentPos.current.x,
      y: currentPos.current.y,
      src: treatment.image,
      alt: treatment.name,
    });
  };

  const handleRowLeave = () => {
    setCursor((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".spa-main-img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".spa-portrait-img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".spa-label", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".spa-headline-line").forEach((line) => {
        gsap.from(line, {
          scrollTrigger: { trigger: line, start: "top 90%" },
          y: "110%",
          duration: 1.1,
          ease: "power4.out",
        });
      });

      gsap.from(".spa-body", {
        scrollTrigger: { trigger: ".spa-body", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".spa-cta", {
        scrollTrigger: { trigger: ".spa-cta", start: "top 88%" },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".spa-main-frame", {
        scrollTrigger: {
          trigger: ".spa-main-frame",
          start: "top 75%",
          end: "top 30%",
          scrub: 1.2,
        },
        clipPath: "inset(18% 8% 18% 8%)",
        ease: "none",
      });

      gsap.from(".spa-portrait-frame", {
        scrollTrigger: { trigger: ".spa-portrait-frame", start: "top 80%" },
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".spa-accent-line", {
        scrollTrigger: { trigger: ".spa-accent-line", start: "top 88%" },
        scaleX: 0,
        duration: 1.4,
        ease: "power3.inOut",
        transformOrigin: "left",
      });

      gsap.from(".spa-treatment-row", {
        scrollTrigger: { trigger: ".spa-treatments-grid", start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".spa-stat", {
        scrollTrigger: { trigger: ".spa-stats", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <CursorImage
        visible={cursor.visible}
        position={{ x: cursor.x, y: cursor.y }}
        src={cursor.src}
        alt={cursor.alt}
      />

      <section
        ref={sectionRef}
        id="spa"
        className="relative bg-midnight py-28 md:py-44 overflow-hidden"
      >
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">

          {/* ── Top: editorial two-column layout ── */}
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-10 items-start mb-24 md:mb-36">

            {/* Left — text */}
            <div className="lg:col-span-5 lg:pt-20">
              <p className="spa-label section-label mb-8">Chapter IV — Wellness</p>

              <h2 className="heading-serif text-5xl md:text-6xl lg:text-7xl text-cream mb-10 leading-[1.02]">
                <span className="line-reveal block">
                  <span className="spa-headline-line block">A temple of</span>
                </span>
                <span className="line-reveal block">
                  <span className="spa-headline-line block italic text-amber/90">silence</span>
                </span>
                <span className="line-reveal block">
                  <span className="spa-headline-line block">and renewal</span>
                </span>
              </h2>

              <div className="spa-accent-line h-px w-20 bg-amber mb-10" />

              <p className="spa-body text-muted text-base md:text-lg leading-relaxed max-w-sm mb-10">
                Descend into our subterranean sanctuary — a world apart, where
                candlelight replaces daylight and the only sound is water moving
                over ancient stone. Ancient healing traditions meet Swiss
                cellular science.
              </p>

              <a
                href="#booking"
                className="spa-cta inline-flex items-center gap-3 text-amber hover:gap-5 transition-all duration-300 text-sm font-semibold tracking-widest uppercase"
              >
                Book a treatment
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <div className="spa-stats grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/[0.08]">
                {[
                  { value: "14", label: "Treatment Rooms" },
                  { value: "3", label: "Thermal Pools" },
                  { value: "∞", label: "Pure Stillness" },
                ].map((s) => (
                  <div key={s.label} className="spa-stat">
                    <p className="heading-serif text-3xl md:text-4xl text-amber">{s.value}</p>
                    <p className="text-xs text-muted mt-1 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — stacked images */}
            <div className="lg:col-span-7 relative">
              <div
                className="spa-main-frame relative overflow-hidden rounded-sm w-full"
                style={{ clipPath: "inset(0% 0% 0% 0%)", height: "clamp(360px, 65vh, 680px)" }}
              >
                <div className="spa-main-img absolute inset-0 scale-110">
                  <Image
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop"
                    alt="The Continental Spa — thermal pools"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
                <span className="absolute bottom-6 right-6 section-label text-white/40">Thermal Wing</span>
              </div>

              <div
                className="spa-portrait-frame absolute -bottom-10 -left-4 md:-left-10 w-40 md:w-56 overflow-hidden rounded-sm border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
                style={{ height: "clamp(180px, 28vh, 320px)" }}
              >
                <div className="spa-portrait-img absolute inset-0 scale-110">
                  <Image
                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop"
                    alt="Spa treatment detail"
                    fill
                    className="object-cover object-center"
                    sizes="224px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
              </div>
            </div>
          </div>

          {/* ── Bottom: treatments list with cursor hover image ── */}
          <div className="spa-treatments-grid border-t border-white/[0.08] pt-16 md:pt-20">
            <p className="section-label text-white/30 mb-10">Signature Treatments</p>
            <div className="divide-y divide-white/[0.08]">
              {treatments.map((t) => (
                <div
                  key={t.name}
                  className="spa-treatment-row group grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 cursor-none"
                  onMouseEnter={() => handleRowEnter(t)}
                  onMouseLeave={handleRowLeave}
                >
                  <div className="md:col-span-1 flex items-start pt-1">
                    <span className="section-label text-white/25 group-hover:text-amber transition-colors duration-300">
                      {t.number}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="heading-serif text-2xl md:text-3xl text-cream group-hover:text-amber transition-colors duration-300">
                      {t.name}
                    </h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-muted text-sm md:text-base leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="md:col-span-2 flex md:justify-end items-start">
                    <span className="text-xs text-white/30 group-hover:text-amber/60 transition-colors duration-300 tracking-widest uppercase pt-1">
                      {t.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
