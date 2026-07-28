"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "Private Yacht Charter",
    label: "On the water",
    desc: "Glide across the lake at golden hour aboard our fleet of classic wooden yachts, with a private chef and sommelier.",
    image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Helicopter Tours",
    label: "Above the Alps",
    desc: "Doors-off Alpine flights over glaciers and peaks, followed by a Champagne landing on a private ridge.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Wine Country Excursion",
    label: "Vineyard & cellar",
    desc: "Chauffeured journeys through storied estates, with private vertical tastings and a harvest-table lunch.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Stargazing on the Lake",
    label: "Midnight ritual",
    desc: "A telescope, a blanket of constellations, and a thermos of truffle cocoa — our astronomer guides the evening.",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Art Gallery Private Viewing",
    label: "Culture & art",
    desc: "After-hours access to Geneva's finest collections, with a curator who speaks fluent art and excellent wine.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ExperiencesSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-header > *", {
        scrollTrigger: { trigger: ".exp-header", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".exp-strip", {
        scrollTrigger: { trigger: ".exp-strip", start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="relative py-24 md:py-40 bg-deep-blue overflow-hidden"
    >
      <div className="mx-auto max-w-350 px-6 md:px-10">

        {/* Header */}
        <div className="exp-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div>
            <p className="section-label mb-4">Chapter V — Curated Moments</p>
            <h2 className="heading-serif text-5xl md:text-6xl text-cream max-w-lg">
              Experiences beyond imagination
            </h2>
          </div>
          <p className="text-muted max-w-sm text-base leading-relaxed">
            Our concierge crafts bespoke adventures tailored to your desires —
            from dawn to the witching hour.
          </p>
        </div>

        {/* Accordion photo strip — horizontal scroll on mobile, accordion on md+ */}
        <div
          className="exp-strip hidden md:flex gap-3"
          style={{ height: "clamp(380px, 62vh, 680px)" }}
        >
          {experiences.map((exp, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={exp.title}
                className="relative overflow-hidden rounded-sm cursor-pointer shrink-0 group"
                style={{
                  flex: isActive ? "4 0 0%" : "1 0 0%",
                  transition: "flex 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
                }}
                onMouseEnter={() => setActiveIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={exp.title}
                onKeyDown={(e) => e.key === "Enter" && setActiveIndex(i)}
              >
                {/* Photo */}
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 40vw"
                />

                {/* Gradient overlay — always present */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to top, rgba(5,12,24,0.92) 0%, rgba(5,12,24,0.3) 50%, transparent 100%)",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />

                {/* Collapsed: vertical label */}
                <div
                  className="absolute inset-0 flex items-end justify-center pb-8 transition-opacity duration-300"
                  style={{ opacity: isActive ? 0 : 1 }}
                >
                  <span
                    className="section-label text-white/50 whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                  >
                    {exp.title}
                  </span>
                </div>

                {/* Expanded: full content */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(16px)",
                  }}
                >
                  <p className="section-label text-amber/70 mb-3">{exp.label}</p>
                  <h3 className="heading-serif text-2xl md:text-3xl text-cream mb-3">
                    {exp.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed max-w-xs mb-5 hidden md:block">
                    {exp.desc}
                  </p>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 text-amber text-xs font-semibold tracking-widest uppercase hover:gap-4 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Enquire
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                {/* Active indicator — thin amber line at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px bg-amber transition-opacity duration-500"
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile: horizontal scroll cards */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 px-6">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className="relative shrink-0 w-[78vw] rounded-sm overflow-hidden snap-start"
              style={{ height: "clamp(300px, 55vw, 420px)" }}
            >
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover"
                sizes="78vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,12,24,0.92) 0%, rgba(5,12,24,0.3) 55%, transparent 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="section-label text-amber/70 mb-2">{exp.label}</p>
                <h3 className="heading-serif text-xl text-cream mb-2">{exp.title}</h3>
                <a href="#booking" className="inline-flex items-center gap-2 text-amber text-xs font-semibold tracking-widest uppercase">
                  Enquire
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Dot navigation — desktop only */}
        <div className="hidden md:flex items-center gap-2 mt-6 justify-end">
          {experiences.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Select experience ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? "24px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === activeIndex ? "var(--amber)" : "rgba(245,240,232,0.2)",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
