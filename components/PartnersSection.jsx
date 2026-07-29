"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const partners = [
  { num: "01", name: "Forbes Travel\nGuide",    detail: "Five-Star Award",   year: "2024" },
  { num: "02", name: "Condé Nast\nTraveler",    detail: "Gold List",         year: "2024" },
  { num: "03", name: "Michelin\nGuide",          detail: "Two Stars",         year: "2023" },
  { num: "04", name: "Relais &\nChâteaux",       detail: "Grand Member",      year: "Since 2011" },
  { num: "05", name: "Leading\nHotels",          detail: "World Member",      year: "Since 2008" },
  { num: "06", name: "Travel +\nLeisure",        detail: "World's Best",      year: "2024" },
  { num: "07", name: "Virtuoso",                 detail: "Preferred Partner", year: "2024" },
  { num: "08", name: "Tatler",                   detail: "Hotels Guide",      year: "2024" },
];

export default function PartnersSection() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  // Section entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".p-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".p-track-wrap", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        opacity: 0,
        duration: 1.1,
        delay: 0.15,
        ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28 bg-midnight"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,168,73,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Top rule */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)",
        }}
      />

      {/* Header */}
      <div className="p-header relative max-w-350 mx-auto px-6 md:px-12 lg:px-20 mb-14 md:mb-18 flex items-end justify-between">
        <div>
          <p className="section-label mb-3" style={{ color: "rgba(232,168,73,0.6)" }}>
            Partners &amp; Recognition
          </p>
          <h2
            className="heading-serif text-4xl md:text-5xl text-cream"
            style={{ fontWeight: 300 }}
          >
            Trusted by the world's<br className="hidden md:block" /> finest authorities
          </h2>
        </div>
        <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
          A decade of recognition from the institutions that define global hospitality.
        </p>
      </div>

      {/* Marquee */}
      <div
        className="p-track-wrap"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        {/* Single flex row — duplicated content for seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-4"
          style={{
            width: "max-content",
            animation: "partners-scroll 40s linear infinite",
            willChange: "transform",
          }}
        >
          {/* Render twice so the loop is seamless */}
          {[...partners, ...partners].map((p, i) => (
            <PartnerCard key={i} {...p} />
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)",
        }}
      />

      <style>{`
        @keyframes partners-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function PartnerCard({ num, name, detail, year }) {
  return (
    <div
      className="relative flex flex-col justify-between shrink-0 overflow-hidden"
      style={{
        width: "clamp(180px, 20vw, 260px)",
        height: "clamp(200px, 26vw, 300px)",
        padding: "clamp(1.25rem, 2vw, 1.75rem)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "2px",
      }}
    >
      {/* Amber top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, var(--amber), transparent)",
        }}
      />

      {/* Ghost numeral */}
      <span
        aria-hidden
        className="heading-serif absolute bottom-2 right-3 select-none pointer-events-none"
        style={{
          fontSize: "clamp(4.5rem, 9vw, 7rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(232,168,73,0.1)",
          fontWeight: 300,
        }}
      >
        {num}
      </span>

      {/* Index + year */}
      <div className="flex items-center justify-between">
        <span
          className="heading-serif"
          style={{
            fontSize: "clamp(0.7rem, 1vw, 0.8rem)",
            color: "rgba(232,168,73,0.55)",
            fontWeight: 400,
            letterSpacing: "0.15em",
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.25)",
          }}
        >
          {year}
        </span>
      </div>

      {/* Partner name */}
      <div className="mt-auto mb-3 relative z-10">
        <h3
          className="heading-serif text-cream leading-[1.15]"
          style={{
            fontSize: "clamp(1.3rem, 2.2vw, 1.75rem)",
            fontWeight: 300,
            whiteSpace: "pre-line",
          }}
        >
          {name}
        </h3>
      </div>

      {/* Accolade */}
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(232,168,73,0.6)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {detail}
      </p>
    </div>
  );
}
