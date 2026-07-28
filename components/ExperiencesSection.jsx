"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const experiences = [
  {
    title: "Private Yacht Charter",
    image:
      "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Helicopter Tours",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Wine Country Excursion",
    image:
      "https://images.unsplash.com/photo-1506377247377-828897a21244?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Stargazing on the Lake",
    image:
      "https://images.unsplash.com/photo-1419242902214-272b359170b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Art Gallery Private Viewing",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Sunrise Meditation",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
  },
];

export default function ExperiencesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-header > *", {
        scrollTrigger: {
          trigger: ".exp-header",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".exp-card", {
        scrollTrigger: {
          trigger: ".exp-grid",
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.utils.toArray(".exp-card").forEach((card) => {
        gsap.to(card.querySelector(".exp-image"), {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          yPercent: -15,
          ease: "none",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="relative py-24 md:py-40 bg-midnight"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="exp-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
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

        <div className="exp-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {experiences.map((exp) => (
            <article
              key={exp.title}
              className="exp-card group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
            >
              <div className="exp-image absolute inset-0 scale-110">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="heading-serif text-xl md:text-2xl text-cream group-hover:text-amber transition-colors duration-300">
                  {exp.title}
                </h3>
                <div className="h-px w-0 group-hover:w-full bg-amber transition-all duration-500 mt-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
