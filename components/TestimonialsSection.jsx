"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const testimonials = [
  {
    quote:
      "The Continental isn't just a hotel — it's a portal to another era of grace and sophistication.",
    author: "Victoria Ashworth",
    role: "Travel Editor, Luxe Magazine",
  },
  {
    quote:
      "Every corner whispers elegance. The spa alone is worth the journey across continents.",
    author: "James Chen",
    role: "Architect & Design Critic",
  },
  {
    quote:
      "We've stayed at the world's finest properties. The Continental remains unmatched.",
    author: "Elena & Marco Rossi",
    role: "Returning Guests, 12 Years",
  },
  {
    quote:
      "Chef Laurent's tasting menu redefined my understanding of culinary art.",
    author: "Sophie Laurent",
    role: "Michelin Guide Inspector",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const doubled = [...testimonials, ...testimonials];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-deep-blue overflow-hidden"
    >
      <div className="testimonial-header text-center mb-16 px-6">
        <p className="section-label mb-4">Guest Reflections</p>
        <h2 className="heading-serif text-4xl md:text-5xl text-cream">
          Words from our world
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-deep-blue to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-deep-blue to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-8 px-4">
          {doubled.map((t, i) => (
            <blockquote
              key={`${t.author}-${i}`}
              className="shrink-0 w-[85vw] md:w-[480px] experience-card rounded-sm p-8 md:p-10"
            >
              <p className="heading-serif text-xl md:text-2xl text-cream leading-snug mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer>
                <cite className="not-italic text-amber text-sm font-medium">
                  {t.author}
                </cite>
                <p className="text-muted text-xs mt-1">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
