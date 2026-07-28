"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DiningSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".dining-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".dining-text > *", {
        scrollTrigger: {
          trigger: ".dining-text",
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".dining-image-main", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 40%",
          scrub: 1,
        },
        clipPath: "inset(100% 0 0 0)",
        ease: "none",
      });

      gsap.from(".dining-image-secondary", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1.5,
        },
        y: 100,
        opacity: 0,
        ease: "none",
      });

      gsap.from(".dining-accent-line", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        scaleX: 0,
        duration: 1.2,
        ease: "power3.inOut",
        transformOrigin: "left",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="dining"
      className="relative py-24 md:py-40 overflow-hidden"
    >
      <div className="dining-bg absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-5 dining-text">
            <p className="section-label mb-6">Chapter III — Culinary Arts</p>
            <h2 className="heading-serif text-5xl md:text-6xl text-cream mb-8">
              A feast for the senses
            </h2>
            <div className="dining-accent-line h-px w-24 bg-amber mb-8" />
            <p className="text-muted text-base md:text-lg leading-relaxed mb-6">
              Our Michelin-starred restaurant, Le Jardin, transforms locally
              sourced ingredients into edible masterpieces. From sunrise
              breakfasts on the terrace to midnight cognac in the library bar.
            </p>
            <p className="text-muted text-base md:text-lg leading-relaxed mb-10">
              Executive Chef Antoine Laurent brings three decades of Parisian
              refinement to every plate — a symphony of flavor, texture, and
              artistry.
            </p>
            <a
              href="#reserve"
              className="inline-flex items-center gap-3 text-amber hover:gap-5 transition-all duration-300 text-sm font-medium tracking-wide"
            >
              Reserve a table
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="lg:col-span-7 relative">
            <div
              className="dining-image-main relative aspect-[4/5] md:aspect-[5/4] overflow-hidden rounded-sm"
              style={{ clipPath: "inset(0 0 0 0)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop"
                alt="Fine dining at The Continental"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="dining-image-secondary absolute -bottom-12 -left-6 md:-left-12 w-48 md:w-64 aspect-square overflow-hidden rounded-sm border-4 border-midnight shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&auto=format&fit=crop"
                alt="Chef's preparation"
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
