"use client";

import { useEffect, useRef, useState } from "react";
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

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
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
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />
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
    </>
  );
}
