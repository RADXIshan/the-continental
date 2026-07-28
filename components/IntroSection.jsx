"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".intro-label", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".intro-line").forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
          },
          y: "110%",
          duration: 1,
          ease: "power4.out",
        });
      });

      gsap.from(".intro-body p", {
        scrollTrigger: {
          trigger: ".intro-body",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".intro-stat", {
        scrollTrigger: {
          trigger: ".intro-stats",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".intro-image", {
        scrollTrigger: {
          trigger: ".intro-image-wrap",
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
        y: 60,
        scale: 1.06,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineLines = [
    "A century of",
    "unparalleled",
    "hospitality",
  ];

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-midnight py-24 md:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-350 px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="intro-label section-label mb-8">Chapter I — The Legacy</p>

            <h2 className="heading-serif text-5xl md:text-6xl lg:text-7xl text-cream mb-12">
              {headlineLines.map((line) => (
                <span key={line} className="line-reveal block">
                  <span className="intro-line block">{line}</span>
                </span>
              ))}
            </h2>

            <div className="intro-body space-y-5 text-muted text-base md:text-lg leading-relaxed max-w-lg">
              <p>
                Since 1924, The Continental has stood as a beacon of refined
                living — where every detail is curated, every moment cherished,
                and every guest treated as royalty.
              </p>
              <p>
                Step through our doors and enter a world where Art Deco
                grandeur meets contemporary comfort, where the whispers of
                history echo through marble halls and candlelit corridors.
              </p>
            </div>

            <div className="intro-stats grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
              {[
                { value: "100+", label: "Years of Excellence" },
                { value: "47", label: "Luxury Suites" },
                { value: "12", label: "Award-Winning Chefs" },
              ].map((stat) => (
                <div key={stat.label} className="intro-stat">
                  <p className="heading-serif text-4xl md:text-5xl text-amber">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted mt-2 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="intro-image-wrap relative aspect-[3/4] rounded-sm overflow-hidden">
            <div
              className="intro-image absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop)",
                willChange: "transform",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-midnight/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="section-label mb-2">Grand Lobby</p>
              <p className="heading-serif text-2xl text-cream">
                Where every arrival becomes an occasion
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
