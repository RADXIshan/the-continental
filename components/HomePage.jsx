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
import BookingSection from "./BookingSection";
import Footer from "./Footer";
import { preloaderState } from "../lib/preloaderState";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const contentRef  = useRef(null);
  const progressRef = useRef(null);

  // Called by Preloader as curtains start opening
  const handlePreloaderComplete = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    // Ultra-smooth, coordinated page entrance with faster hero/navbar
    gsap.timeline({ 
      onStart: () => {
        gsap.set(content, { visibility: "visible" });
      },
      onComplete: () => ScrollTrigger.refresh() 
    })
      // Extended, buttery-smooth main fade
      .fromTo(content, 
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power1.inOut" }
      )
      // Navbar - faster and snappier
      .from(".nav-logo",    { y: -20, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.8")
      .from(".nav-item",    { y: -16, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }, "-=0.5")
      .from(".nav-reserve", { y: -16, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      // Hero headline - faster, more responsive
      .to(".hero-line-1",   { y: 0, duration: 1.0, ease: "power2.out" }, "-=0.4")
      .to(".hero-line-2",   { y: 0, duration: 1.0, ease: "power2.out" }, "-=0.75")
      // Hero supporting elements - quicker appearance
      .to(".hero-subtext",    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(".hero-search",     { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(".hero-scroll-hint",{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");

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
  }, []);

  // If preloader already played (client-side nav back to home), snap everything
  // to its final visible state instantly — no animation needed.
  useEffect(() => {
    if (!preloaderState.hasPlayed) return;

    const content = contentRef.current;
    if (!content) return;

    // Reveal wrapper
    gsap.set(content, { visibility: "visible", opacity: 1 });

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

    ScrollTrigger.refresh();
  }, [handlePreloaderComplete]);

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
            <BookingSection />
          </main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
