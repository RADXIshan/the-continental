"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const treatments = [
  { name: "Signature Ritual", duration: "120 min", desc: "Full-body renewal with rare botanical oils" },
  { name: "Hydrotherapy", duration: "90 min", desc: "Ancient thermal pools and mineral springs" },
  { name: "Couples Retreat", duration: "180 min", desc: "Private suite with champagne and roses" },
];

export default function SpaSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".spa-pin-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          pin: ".spa-pin-inner",
          scrub: 1,
        },
        opacity: 0,
        y: 100,
        ease: "none",
      });

      gsap.to(".spa-reveal-image", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 1,
        },
        clipPath: "inset(0% 0 0 0)",
        ease: "none",
      });

      gsap.from(".spa-treatment", {
        scrollTrigger: {
          trigger: ".spa-treatments",
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="spa"
      className="relative bg-ocean min-h-[150vh]"
    >
      <div className="spa-pin-inner relative h-screen flex items-center overflow-hidden">
        <div
          className="spa-reveal-image absolute inset-0"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2400&auto=format&fit=crop)",
            }}
          />
          <div className="absolute inset-0 bg-midnight/50" />
        </div>

        <div className="spa-pin-content relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 w-full">
          <div className="max-w-2xl">
            <p className="section-label mb-6">Chapter IV — Wellness</p>
            <h2 className="heading-serif text-5xl md:text-7xl text-cream mb-8">
              Restore body &amp; soul
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-12">
              Descend into our subterranean spa — a temple of tranquility
              where time slows and the world fades away. Ancient healing
              traditions meet cutting-edge wellness science.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-40 -mt-20">
        <div className="spa-treatments grid md:grid-cols-3 gap-6">
          {treatments.map((t) => (
            <div
              key={t.name}
              className="spa-treatment experience-card rounded-sm p-8 hover:border-amber/30 transition-colors duration-500"
            >
              <p className="text-amber text-sm mb-4">{t.duration}</p>
              <h3 className="heading-serif text-2xl text-cream mb-3">
                {t.name}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
