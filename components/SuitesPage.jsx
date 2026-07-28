"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rooms } from "../lib/rooms";

gsap.registerPlugin(ScrollTrigger);

// ─── Filter options ────────────────────────────────────────────
const FILTERS = ["All", "Under $600", "$600–$900", "Over $900"];

function priceValue(priceStr) {
  return parseInt(priceStr.replace(/\D/g, ""), 10);
}

function matchesFilter(room, filter) {
  if (filter === "All") return true;
  const v = priceValue(room.price);
  if (filter === "Under $600") return v < 600;
  if (filter === "$600–$900") return v >= 600 && v <= 900;
  if (filter === "Over $900") return v > 900;
  return true;
}

// ─── Amenity icon map ──────────────────────────────────────────
function AmenityIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 text-amber mt-0.5"
      aria-hidden
    >
      <path
        d="M2 6l2.8 2.8L10 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Individual suite card ─────────────────────────────────────
function SuiteCard({ room, index }) {
  const cardRef = useRef(null);
  const even = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 56,
        opacity: 0,
        duration: 0.9,
        delay: (index % 2) * 0.1,
        ease: "power3.out",
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className={`suite-card grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-sm overflow-hidden border border-white/8 bg-deep-blue/60 ${
        even ? "" : "lg:[direction:rtl]"
      }`}
    >
      {/* Image pane */}
      <div
        className="relative overflow-hidden lg:[direction:ltr]"
        style={{ minHeight: "360px" }}
      >
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-midnight/70 via-transparent to-transparent" />

        {/* Index label */}
        <span className="absolute top-6 left-6 section-label text-white/50">
          0{index + 1}
        </span>

        {/* Badge */}
        {room.badge && (
          <span className="absolute top-6 right-6 bg-amber text-midnight text-[0.6rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full">
            {room.badge}
          </span>
        )}
      </div>

      {/* Content pane */}
      <div className="lg:[direction:ltr] flex flex-col justify-center p-8 md:p-12 gap-6">
        <div>
          <p className="section-label mb-3">{room.size} &bull; {room.guests}</p>
          <h2 className="heading-serif text-3xl md:text-4xl text-cream mb-3">
            {room.name}
          </h2>
          <p className="text-muted text-base leading-relaxed">
            {room.longDesc}
          </p>
        </div>

        {/* Features list */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {room.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-cream/70 text-sm"
            >
              <AmenityIcon />
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          <p className="text-amber text-lg font-semibold">{room.price}<span className="text-muted text-sm font-normal"> / night</span></p>
          <Link
            href="/#booking"
            className="btn-amber rounded-full px-7 py-3 text-sm font-semibold tracking-widest shadow-[0_0_24px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
          >
            Reserve
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function SuitesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const pageRef = useRef(null);   // scoped to the root div — covers header too
  const heroRef = useRef(null);
  const filterBarRef = useRef(null);

  const filtered = rooms.filter((r) => matchesFilter(r, activeFilter));

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hero + header entrance — use pageRef so .suites-back-link is in scope
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".suites-back-link", { x: -16, opacity: 0, duration: 0.6 })
        .from(".suites-hero-label", { y: 20, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(".suites-hero-h1 .line-reveal-inner", { y: "110%", duration: 1.1, stagger: 0.12 }, "-=0.4")
        .from(".suites-hero-sub", { y: 16, opacity: 0, duration: 0.8 }, "-=0.5");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Filter bar entrance — no ScrollTrigger; plays unconditionally after hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".filter-btn", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        delay: 0.4,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });
    }, filterBarRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-midnight min-h-screen">

      {/* ── Sticky top navigation bar ────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-midnight/90 backdrop-blur-md border-b border-white/5 py-4">
        <div className="mx-auto max-w-350 px-6 md:px-10 flex items-center justify-between">
          <Link
            href="/"
            className="suites-back-link flex items-center gap-2.5 glass-pill px-4 py-2.5 rounded-full hover:border-amber/30 transition-all duration-300 group"
            aria-label="Back to homepage"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="group-hover:-translate-x-1 transition-transform duration-300">
              <path
                d="M11 14l-5-5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-muted group-hover:stroke-amber transition-colors duration-300"
              />
            </svg>
            <span className="text-sm font-medium tracking-wide text-cream group-hover:text-amber transition-colors duration-300">Back to Home</span>
          </Link>

          <Link
            href="/"
            className="flex flex-col leading-none group"
            aria-label="The Continental — home"
          >
            <span className="heading-serif text-cream text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-amber transition-colors duration-300">
              Continental
            </span>
            <span className="section-label text-[0.52rem] mt-0.5 tracking-[0.3em]">
              Est. 1924
            </span>
          </Link>

          <Link
            href="/#booking"
            className="btn-amber rounded-full px-6 py-2.5 text-xs font-semibold tracking-widest shadow-[0_0_20px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
          >
            Reserve Now
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-40 pb-20 md:pt-48 md:pb-24 px-6 md:px-10 overflow-hidden"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2400&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-midnight/60 via-midnight/80 to-midnight" />
        </div>

        {/* Watermark */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 watermark-text text-[20vw] leading-none whitespace-nowrap pointer-events-none select-none"
        >
          Suites
        </span>

        <div className="relative z-10 max-w-350 mx-auto">
          <p className="suites-hero-label section-label mb-6">Chapter II — Accommodations</p>
          <h1 className="suites-hero-h1 heading-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream max-w-3xl">
            <span className="line-reveal block">
              <span className="line-reveal-inner block" style={{ transform: "translateY(110%)" }}>Every stay,</span>
            </span>
            <span className="line-reveal block">
              <span className="line-reveal-inner block" style={{ transform: "translateY(110%)" }}>a world apart.</span>
            </span>
          </h1>
          <p className="suites-hero-sub mt-6 text-muted text-lg md:text-xl max-w-xl leading-relaxed" style={{ opacity: 0, transform: "translateY(16px)" }}>
            Five distinct residences, each a complete world of its own. Choose
            your sanctuary.
          </p>
        </div>
      </section>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <div
        ref={filterBarRef}
        className="sticky top-18 z-40 bg-midnight/95 backdrop-blur-md border-b border-white/5 py-5"
      >
        <div className="max-w-350 mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-muted text-xs tracking-widest uppercase mr-2 hidden sm:block">Filter</span>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`filter-btn rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-amber ${
                  activeFilter === f
                    ? "bg-amber text-midnight"
                    : "glass-pill text-muted hover:text-cream"
                }`}
              >
                {f}
              </button>
            ))}

            {/* Result count */}
            <span className="ml-auto text-muted text-xs tracking-wide whitespace-nowrap">
              {filtered.length} suite{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Suite cards ──────────────────────────────────────── */}
      <main
        className="max-w-350 mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col gap-12 md:gap-16"
        id="suites-list"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="heading-serif text-3xl text-cream/40">No suites match this filter.</p>
          </div>
        ) : (
          filtered.map((room, i) => (
            <SuiteCard key={room.slug} room={room} index={i} />
          ))
        )}
      </main>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="border-t border-white/8 py-24 px-6 md:px-10 text-center">
        <p className="section-label mb-5">Ready to arrive?</p>
        <h2 className="heading-serif text-4xl md:text-5xl text-cream mb-8 max-w-lg mx-auto leading-tight">
          Your suite awaits
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#booking"
            className="btn-amber inline-block rounded-full px-10 py-4 text-sm font-semibold tracking-widest shadow-[0_0_40px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
          >
            Reserve Now
          </Link>
          <Link
            href="/"
            className="glass-pill inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-cream hover:text-amber hover:border-amber/30 transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-amber"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="group-hover:-translate-x-1 transition-transform duration-300">
              <path
                d="M11 14l-5-5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>

      {/* ── Simple footer ────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-10 text-center">
        <p className="text-muted text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} The Continental. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
