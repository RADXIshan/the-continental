"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";
import Navbar from "./Navbar";
import Hero from "./Hero";
import IntroSection from "./IntroSection";
import RoomsSection from "./RoomsSection";
import DiningSection from "./DiningSection";
import SpaSection from "./SpaSection";
import ExperiencesSection from "./ExperiencesSection";
import TestimonialsSection from "./TestimonialsSection";
import PartnersSection from "./PartnersSection";
import BookingSection from "./BookingSection";
import Footer from "./Footer";
import { preloaderState } from "../lib/preloaderState";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const contentRef  = useRef(null);
  const progressRef = useRef(null);

  // Called by Preloader once curtains start sliding open
  const handlePreloaderComplete = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    // Make content visible immediately (curtains are still covering it)
    gsap.set(content, { visibility: "visible", opacity: 1 });

    // Curtain slide takes 1.6s with expo.inOut — hero entrance begins after
    // curtains have fully cleared (~1.5s), so elements animate in clean air.
    const curtainDuration = 1.6;

    const ctx = gsap.context(() => {
      gsap.timeline({ delay: curtainDuration - 0.05, onComplete: () => ScrollTrigger.refresh() })
        // Navbar drops in first
        .from(".nav-logo",    { y: -18, opacity: 0, duration: 0.65, ease: "power3.out" })
        .from(".nav-item",    { y: -14, opacity: 0, duration: 0.55, stagger: 0.055, ease: "power3.out" }, "-=0.45")
        .from(".nav-reserve", { y: -14, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.35")
        // Hero headline rises up
        .to(".hero-line-1",   { y: 0, duration: 1.1, ease: "power3.out" }, "-=0.45")
        .to(".hero-line-2",   { y: 0, duration: 1.1, ease: "power3.out" }, "-=0.85")
        // Supporting elements
        .to(".hero-subtext",     { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.65")
        .to(".hero-search",      { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" }, "-=0.75")
        .to(".hero-scroll-hint", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.6");

      // Scroll progress bar — independent
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    }, content);

    return () => ctx.revert();
  }, []);

  // If preloader already played (client-side nav back to home), snap everything
  // to its final visible state instantly — no animation needed.
  useEffect(() => {
    if (!preloaderState.hasPlayed) return;

    const content = contentRef.current;
    if (!content) return;

    // Reveal wrapper
    gsap.set(content, { visibility: "visible", opacity: 1 });

    const ctx = gsap.context(() => {
      // Nav elements — clear any stale from-tween inline styles
      gsap.set([".nav-logo", ".nav-item", ".nav-reserve"], { clearProps: "all" });

      // Hero elements — snap to their final animated state
      gsap.set([".hero-line-1", ".hero-line-2"], { y: 0 });
      gsap.set(".hero-subtext",     { opacity: 1, y: 0 });
      gsap.set(".hero-search",      { opacity: 1, x: 0 });
      gsap.set(".hero-scroll-hint", { opacity: 1, y: 0 });

      // Scroll progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    }, content);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />

      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Invisible until curtains start opening */}
      <div ref={contentRef} style={{ visibility: "hidden", opacity: 0 }}>
        <SmoothScroll>
          <Navbar />
          <main>
            <Hero />
            <IntroSection />
            <RoomsSection />
            <DiningSection />
            <SpaSection />
            <ExperiencesSection />
            <TestimonialsSection />
            <PartnersSection />
            <BookingSection />
          </main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
