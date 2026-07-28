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
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
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
      <div className="h-screen flex flex-col">
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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-amber"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="section-label">View all suites</span>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
