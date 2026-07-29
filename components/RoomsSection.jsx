"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rooms } from "../lib/rooms";

export default function RoomsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Only apply pinned horizontal scroll on non-touch / md+ screens
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover)");
    if (!mq.matches) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const viewportWidth = track?.parentElement?.clientWidth || window.innerWidth;
      const totalScroll = Math.max(track.scrollWidth - viewportWidth, 0);

      gsap.set(track, { willChange: "transform" });

      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 0.15,
        },
      });

      gsap.from(".rooms-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
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
      id="rooms"
      className="relative bg-deep-blue overflow-hidden"
    >
      {/* Desktop: pinned horizontal scroll layout */}
      <div className="hidden md:flex h-svh flex-col">
        <div className="rooms-header shrink-0 pt-24 md:pt-28 pb-8 px-6 md:px-10 max-w-350 mx-auto w-full">
          <p className="section-label mb-4">Chapter II — Accommodations</p>
          <h2 className="heading-serif text-4xl md:text-6xl text-cream max-w-xl">
            Suites crafted for the discerning traveler
          </h2>
        </div>

        <div className="flex-1 flex items-center min-h-0 pb-8">
          <div
            ref={trackRef}
            className="horizontal-scroll-panel flex gap-6 md:gap-8 pl-6 md:pl-10 pr-6 items-center"
          >
            {rooms.map((room, i) => (
              <article
                key={room.name}
                className="room-panel shrink-0 w-[80vw] md:w-[50vw] lg:w-[38vw] group"
              >
                <div className="relative overflow-hidden rounded-sm mb-5" style={{ height: "clamp(220px, 38vh, 420px)" }}>
                  <div className="room-image relative w-full h-full">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 80vw, 40vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-transparent to-transparent" />
                  <span className="absolute top-6 left-6 section-label text-white/60">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="heading-serif text-2xl md:text-3xl text-cream mb-2">
                      {room.name}
                    </h3>
                    <p className="text-muted text-sm md:text-base">{room.desc}</p>
                  </div>
                  <p className="text-amber text-sm md:text-base whitespace-nowrap font-medium">
                    {room.price}
                  </p>
                </div>
              </article>
            ))}

            <div className="shrink-0 w-[30vw] flex items-center justify-center">
              <Link
                href="/suites"
                className="group flex flex-col items-center gap-4 text-center"
              >
                <span className="w-20 h-20 rounded-full border border-amber/40 flex items-center justify-center group-hover:bg-amber/10 transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="section-label">View all suites</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: native snap horizontal scroll — no JS, no jank */}
      <div className="md:hidden py-20 px-6">
        <div className="rooms-header mb-8">
          <p className="section-label mb-4">Chapter II — Accommodations</p>
          <h2 className="heading-serif text-4xl text-cream max-w-xs">
            Suites crafted for the discerning traveler
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-6 px-6 pb-4">
          {rooms.map((room, i) => (
            <article
              key={room.name}
              className="shrink-0 w-[82vw] snap-start"
            >
              <div className="relative overflow-hidden rounded-sm mb-4" style={{ height: "clamp(200px, 52vw, 320px)" }}>
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="82vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-transparent to-transparent" />
                <span className="absolute top-5 left-5 section-label text-white/60">0{i + 1}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="heading-serif text-2xl text-cream mb-1">{room.name}</h3>
                  <p className="text-muted text-sm">{room.desc}</p>
                </div>
                <p className="text-amber text-sm whitespace-nowrap font-medium">{room.price}</p>
              </div>
            </article>
          ))}

          <div className="shrink-0 w-[50vw] flex items-center justify-center snap-start">
            <Link href="/suites" className="group flex flex-col items-center gap-3 text-center">
              <span className="w-16 h-16 rounded-full border border-amber/40 flex items-center justify-center group-active:bg-amber/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-label text-[0.6rem]">View all suites</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
