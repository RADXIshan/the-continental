"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BookingSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".booking-bg", {
        yPercent: 25,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".booking-content > *", {
        scrollTrigger: {
          trigger: ".booking-content",
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reserve"
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      <div className="booking-bg absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2400&auto=format&fit=crop"
          alt="The Continental at sunset"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-midnight/70" />
      </div>

      <div className="booking-content relative z-10 mx-auto max-w-350 px-6 md:px-10 py-24 md:py-32 text-center w-full">
        <p className="section-label mb-6">Your Journey Begins</p>
        <h2 className="heading-serif text-5xl md:text-7xl lg:text-8xl text-cream mb-8 max-w-4xl mx-auto">
          Reserve your place in history
        </h2>
        <p className="text-muted text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Limited suites available for the season. Allow us to prepare an
          unforgettable arrival tailored exclusively for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="btn-amber rounded-full px-10 py-4 text-base font-semibold"
          >
            Check Availability
          </a>
          <a
            href="#"
            className="rounded-full px-10 py-4 text-base border border-white/20 text-cream hover:bg-white/5 transition-colors duration-300"
          >
            Contact Concierge
          </a>
        </div>
      </div>
    </section>
  );
}
