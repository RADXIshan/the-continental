"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpaTreatmentModal from "./SpaTreatmentModal";

gsap.registerPlugin(ScrollTrigger);

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

export default function SpaSection() {
  const sectionRef = useRef(null);
  const [modalTreatment, setModalTreatment] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // for mobile dropdown
  // Cursor image — managed entirely via GSAP/DOM to avoid React re-renders
  const cursorRef = useRef(null);
  const cursorImgRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Smooth cursor follow via RAF — no setState, pure DOM mutation
  // Only runs on non-touch devices, and only while the section is visible
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Skip on touch-primary devices (no hover cursor)
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    cursor.style.visibility = "hidden";
    cursor.style.opacity = "0";

    let cursorWidth = cursor.offsetWidth;
    let cursorHeight = cursor.offsetHeight;
    let isRunning = false;

    const updateCursorSize = () => {
      cursorWidth = cursor.offsetWidth;
      cursorHeight = cursor.offsetHeight;
    };

    const move = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("resize", updateCursorSize);

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      const loop = () => {
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.14;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.14;
        cursor.style.transform = `translate3d(${currentPos.current.x - cursorWidth / 2}px, ${currentPos.current.y - cursorHeight / 2}px, 0)`;
        if (isRunning) rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      isRunning = false;
      cancelAnimationFrame(rafRef.current);
    };

    // Use IntersectionObserver to only run RAF when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
            // Hide cursor when section leaves viewport
            if (cursor) {
              gsap.killTweensOf(cursor);
              cursor.style.visibility = "hidden";
              cursor.style.opacity = "0";
            }
          }
        });
      },
      { threshold: 0 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", updateCursorSize);
      stopLoop();
      observer.disconnect();
    };
  }, []);

  const handleRowEnter = (treatment) => {
    const cursor = cursorRef.current;
    const img = cursorImgRef.current;
    if (!cursor || !img) return;
    img.src = treatment.image;
    img.alt = treatment.name;
    cursor.style.visibility = "visible";
    gsap.killTweensOf(cursor);
    gsap.to(cursor, { opacity: 1, duration: 0.22, ease: "power2.out" });
  };

  const handleRowLeave = () => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    gsap.killTweensOf(cursor);
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        cursor.style.visibility = "hidden";
      },
    });
  };

  const handleTreatmentsGridLeave = () => {
    handleRowLeave();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Promote parallax and clip-path layers before scrub animations begin
      gsap.set(".spa-main-img", { willChange: "transform" });
      gsap.set(".spa-portrait-img", { willChange: "transform" });
      gsap.set(".spa-main-frame", { willChange: "clip-path, transform" });

      gsap.to(".spa-main-img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".spa-portrait-img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
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
      {/* Cursor image — positioned & shown via GSAP, no React re-renders */}
      <div
        ref={cursorRef}
        className="hidden md:block pointer-events-none fixed z-200 w-64 h-72 md:w-72 md:h-80 overflow-hidden rounded-3xl border border-white/10 shadow-[0_28px_64px_rgba(0,0,0,0.7)]"
        style={{ top: 0, left: 0, opacity: 0, visibility: "hidden", willChange: "transform, opacity" }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={cursorImgRef}
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-[1.03] transition-transform duration-700 ease-out"
          style={{ transformOrigin: "center center" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-midnight/10 to-midnight/50" />
      </div>

      <section
        ref={sectionRef}
        id="spa"
        className="relative bg-midnight py-28 md:py-44 overflow-hidden"
      >
        <div className="relative mx-auto max-w-350 px-6 md:px-10">

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

              <button
                type="button"
                onClick={() => setModalTreatment(treatments[0])}
                className="spa-cta inline-flex items-center gap-3 text-amber hover:gap-5 transition-all duration-300 text-sm font-semibold tracking-widest uppercase"
              >
                Book a treatment
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="spa-stats grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/8">
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
                <div className="absolute inset-0 bg-linear-to-t from-midnight/40 to-transparent" />
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
                <div className="absolute inset-0 bg-linear-to-t from-midnight/60 to-transparent" />
              </div>
            </div>
          </div>

          {/* ── Bottom: treatments list with cursor hover image (desktop) / accordion (mobile) ── */}
          <div
            className="spa-treatments-grid border-t border-white/8 pt-16 md:pt-20"
            onMouseLeave={handleTreatmentsGridLeave}
          >
            <p className="section-label text-white/30 mb-10">Signature Treatments</p>
            <div className="divide-y divide-white/8">
              {treatments.map((t) => {
                const isExpanded = expandedRow === t.name;
                return (
                  <div key={t.name} className="spa-treatment-row">
                    {/* ── Row header — tap on mobile, hover on desktop ── */}
                    <div
                      className="group grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-10 cursor-pointer md:cursor-none"
                      onMouseEnter={() => handleRowEnter(t)}
                      onMouseLeave={handleRowLeave}
                      onClick={() => {
                        // Always open modal on click
                        setModalTreatment(t);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setModalTreatment(t);
                        }
                      }}
                      aria-label={`Book ${t.name}`}
                    >
                      {/* Number */}
                      <div className="col-span-1 flex items-center">
                        <span className="section-label text-white/25 group-hover:text-amber transition-colors duration-300">
                          {t.number}
                        </span>
                      </div>

                      {/* Name + duration (stacked on mobile, split on md+) */}
                      <div className="col-span-9 md:col-span-4 flex flex-col justify-center">
                        <h3 className="heading-serif text-xl sm:text-2xl md:text-3xl text-cream group-hover:text-amber transition-colors duration-300 leading-tight">
                          {t.name}
                        </h3>
                        {/* Duration visible below name on mobile only */}
                        <span className="md:hidden text-xs text-white/35 tracking-widest uppercase mt-1.5">
                          {t.duration}
                        </span>
                      </div>

                      {/* Description — hidden on mobile (shown in accordion) */}
                      <div className="hidden md:block md:col-span-4">
                        <p className="text-muted text-sm md:text-base leading-relaxed">{t.desc}</p>
                      </div>

                      {/* Right side: duration + book (desktop) | chevron (mobile) */}
                      <div className="col-span-2 md:col-span-3 flex justify-end items-center gap-4">
                        {/* Duration — desktop only */}
                        <span className="hidden md:inline text-xs text-white/30 group-hover:text-amber/60 transition-colors duration-300 tracking-widest uppercase">
                          {t.duration}
                        </span>
                        {/* Book pill — desktop hover only */}
                        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber/0 group-hover:text-amber border border-amber/0 group-hover:border-amber/40 rounded-full px-3 py-1 transition-all duration-300 tracking-widest uppercase whitespace-nowrap">
                          Book
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {/* Chevron — mobile/tablet only */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRow(isExpanded ? null : t.name);
                          }}
                          className="md:hidden shrink-0 text-amber/50 hover:text-amber transition-colors duration-300 p-1"
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* ── Accordion panel — mobile/tablet only ── */}
                    <div
                      className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
                      }`}
                      aria-hidden={!isExpanded}
                    >
                      <div className="pb-7 flex flex-col sm:flex-row gap-5">
                        {/* Treatment image */}
                        <div className="relative w-full sm:w-40 shrink-0 rounded-xl overflow-hidden"
                          style={{ height: "clamp(180px, 36vw, 220px)" }}>
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 640px) 100vw, 160px"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-midnight/40 to-transparent" />
                        </div>

                        {/* Description + book CTA */}
                        <div className="flex flex-col justify-between gap-5">
                          <p className="text-muted text-sm leading-relaxed">{t.desc}</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalTreatment(t);
                            }}
                            className="self-start inline-flex items-center gap-2.5 text-amber border border-amber/35 hover:border-amber/70 rounded-full px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300"
                          >
                            Book treatment
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <SpaTreatmentModal
        key={modalTreatment?.name ?? "closed"}
        isOpen={!!modalTreatment}
        onClose={() => setModalTreatment(null)}
        treatment={modalTreatment}
      />
    </>
  );
}
