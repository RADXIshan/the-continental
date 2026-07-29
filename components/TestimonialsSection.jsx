"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const testimonials = [
  {
    quote:
      "The Continental isn't just a hotel — it's a portal to another era of grace and sophistication.",
    author: "Victoria Ashworth",
    role: "Travel Editor",
    publication: "Luxe Magazine",
    index: "01",
  },
  {
    quote:
      "Every corner whispers elegance. The spa alone is worth the journey across continents.",
    author: "James Chen",
    role: "Architect & Design Critic",
    publication: "Architectural Digest",
    index: "02",
  },
  {
    quote:
      "We've stayed at the world's finest properties. The Continental remains unmatched in every regard.",
    author: "Elena & Marco Rossi",
    role: "Returning Guests",
    publication: "Twelve Consecutive Years",
    index: "03",
  },
  {
    quote:
      "Chef Laurent's tasting menu redefined my understanding of what culinary art can truly be.",
    author: "Sophie Laurent",
    role: "Inspector",
    publication: "Michelin Guide",
    index: "04",
  },
];

const INTERVAL = 4500;

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);
  const quoteRefs = useRef([]);
  const progressRef = useRef(null);
  const progressTlRef = useRef(null);
  // Stable ref so startTimer closure never goes stale
  const activeRef = useRef(0);
  const transitioningRef = useRef(false);

  const goTo = useCallback(
    (next) => {
      if (transitioningRef.current || next === activeRef.current) return;
      transitioningRef.current = true;
      setTransitioning(true);

      const currentIdx = activeRef.current;
      setPrev(currentIdx);

      const currentEl = quoteRefs.current[currentIdx];
      const nextEl = quoteRefs.current[next];

      if (currentEl && nextEl) {
        gsap.set(nextEl, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          onComplete: () => {
            setPrev(null);
            activeRef.current = next;
            setActive(next);
            transitioningRef.current = false;
            setTransitioning(false);
          },
        });

        tl.to(currentEl, {
          opacity: 0,
          y: -24,
          duration: 0.45,
          ease: "power2.in",
        }).fromTo(
          nextEl,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      } else {
        activeRef.current = next;
        setActive(next);
        transitioningRef.current = false;
        setTransitioning(false);
      }
    },
    [] // stable — reads from refs
  );

  // Stable startTimer — only created once, reads activeRef
  const startTimer = useCallback(() => {
    if (progressTlRef.current) progressTlRef.current.kill();
    if (progressRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          const next = (activeRef.current + 1) % testimonials.length;
          goTo(next);
        },
      });
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: INTERVAL / 1000, ease: "none" }
      );
      progressTlRef.current = tl;
    }
  }, [goTo]); // goTo is now stable too

  // Restart timer whenever active changes
  useEffect(() => {
    startTimer();
    return () => {
      if (progressTlRef.current) progressTlRef.current.kill();
    };
  }, [active, startTimer]);

  // Section entrance animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".t-section-label", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".t-section-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.1,
        ease: "power3.out",
      });
      gsap.from(".t-main-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 1.1,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(".t-author-strip", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Set initial visibility
  useEffect(() => {
    quoteRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
    });
  }, []);

  const t = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-midnight overflow-hidden"
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(232,168,73,0.045) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-350 mx-auto px-6 md:px-12 lg:px-20">

        {/* Section header */}
        <div className="flex items-center justify-between mb-14 md:mb-18">
          <div>
            <p className="t-section-label section-label mb-3">Guest Reflections</p>
            <h2 className="t-section-heading heading-serif text-4xl md:text-5xl text-cream">
              What our guests say
            </h2>
          </div>
          {/* Auto-progress bar */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <span className="section-label text-muted/50">
              {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <div className="w-32 h-px bg-white/10 overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-amber origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        {/* Main quote card */}
        <div
          className="t-main-card relative mb-10 md:mb-12"
          style={{
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 50%, rgba(232,168,73,0.025) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2px",
          }}
        >
          {/* Amber top accent */}
          <div
            className="absolute top-0 left-0 h-px bg-amber"
            style={{
              width: `${((active + 1) / testimonials.length) * 100}%`,
              transition: "width 0.6s cubic-bezier(0.76,0,0.24,1)",
            }}
          />

          <div className="grid md:grid-cols-12 gap-0">
            {/* Left number column */}
            <div
              className="hidden md:flex md:col-span-2 items-start justify-center pt-12 pb-12"
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                className="heading-serif text-7xl lg:text-8xl select-none"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(232,168,73,0.15)",
                  fontWeight: 300,
                  lineHeight: 1,
                  transition: "WebkitTextStroke 0.4s ease",
                }}
              >
                {t.index}
              </span>
            </div>

            {/* Quote area — stacked slides */}
            <div className="md:col-span-10 px-8 md:px-12 lg:px-16 py-12 md:py-16 relative" style={{ minHeight: "clamp(220px, 30vh, 360px)" }}>
              {testimonials.map((item, i) => (
                <div
                  key={item.author}
                  ref={(el) => (quoteRefs.current[i] = el)}
                  className="absolute inset-0 px-8 md:px-12 lg:px-16 py-12 md:py-16 flex flex-col justify-between"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {/* Large decorative open quote */}
                  <div
                    aria-hidden
                    className="absolute top-6 right-8 md:right-12 select-none pointer-events-none"
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "clamp(5rem, 10vw, 8rem)",
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(232,168,73,0.1)",
                      fontWeight: 300,
                    }}
                  >
                    &rdquo;
                  </div>

                  <p
                    className="heading-serif text-cream text-2xl md:text-3xl lg:text-4xl leading-[1.4] max-w-3xl"
                    style={{ fontStyle: "italic", fontWeight: 300 }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-8 flex items-center gap-5">
                    <div className="w-8 h-px bg-amber/50" />
                    <div>
                      <p
                        className="heading-serif text-amber text-lg md:text-xl"
                        style={{ fontWeight: 500 }}
                      >
                        {item.author}
                      </p>
                      <p className="text-xs tracking-[0.25em] uppercase text-muted mt-0.5">
                        {item.role}
                        <span className="mx-1.5 opacity-40">&middot;</span>
                        {item.publication}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Author strip navigation */}
        <div className="t-author-strip grid grid-cols-2 md:grid-cols-4 gap-px bg-white/6">
          {testimonials.map((item, i) => (
            <button
              key={item.author}
              onClick={() => {
                if (progressTlRef.current) progressTlRef.current.kill();
                goTo(i);
              }}
              aria-current={i === active ? "true" : undefined}
              className="group relative text-left px-6 py-5 transition-colors duration-300 cursor-pointer"
              style={{
                background:
                  i === active
                    ? "rgba(232,168,73,0.07)"
                    : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Active left border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500"
                style={{
                  background:
                    i === active
                      ? "linear-gradient(to bottom, transparent, var(--amber), transparent)"
                      : "transparent",
                }}
              />

              <p
                className="heading-serif text-base md:text-lg mb-0.5 transition-colors duration-300"
                style={{
                  color: i === active ? "var(--amber)" : "rgba(245,240,232,0.55)",
                  fontWeight: i === active ? 500 : 300,
                }}
              >
                {item.author}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-muted/50 truncate">
                {item.publication}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
