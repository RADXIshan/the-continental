"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { preloaderState } from "../lib/preloaderState";

export default function Preloader({ onComplete }) {
  const containerRef   = useRef(null);
  const leftSvgRef     = useRef(null);
  const rightSvgRef    = useRef(null);
  const leftPathRef    = useRef(null);
  const rightPathRef   = useRef(null);
  const monogramRef    = useRef(null);
  const titleRef       = useRef(null);
  const taglineRef     = useRef(null);
  const ornamentTopRef = useRef(null);
  const ornamentBotRef = useRef(null);
  const svgLineLeftRef  = useRef(null);
  const svgLineRightRef = useRef(null);
  const counterRef     = useRef(null);

  // Keep onComplete in a ref so changing it never re-runs the effect
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Guard: only ever run once, even in StrictMode double-mount
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // If preloader already played (client-side navigation), skip and hide self
    if (preloaderState.hasPlayed) {
      const container = containerRef.current;
      if (container) gsap.set(container, { autoAlpha: 0, display: "none" });
      document.body.style.overflow = "";
      return;
    }

    // Straight curtain path (simple rectangle)
    const straightPath = "M 0 0 L 50 0 L 50 100 L 0 100 Z";
    
    leftPathRef.current.setAttribute("d", straightPath);
    rightPathRef.current.setAttribute("d", straightPath);

    gsap.set(
      [monogramRef.current, titleRef.current, taglineRef.current,
       ornamentTopRef.current, ornamentBotRef.current, counterRef.current],
      { autoAlpha: 0 }
    );
    // Hide SVG lines initially
    gsap.set([svgLineLeftRef.current, svgLineRightRef.current], { autoAlpha: 0 });

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    // Phase 1 — reveal preloader content with smoother timing
    tl.to(monogramRef.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" })
      .to([ornamentTopRef.current, ornamentBotRef.current],
          { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, "-=0.5")
      // Lines stay hidden until later
      .to(titleRef.current,     { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.3")
      .to(taglineRef.current,   { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .to(counterRef.current,   { autoAlpha: 1, duration: 0.4 }, "-=0.6")
      .to({}, {
        duration: 1.4,
        ease: "power1.inOut",
        onUpdate() {
          const el = counterRef.current;
          if (el) el.textContent = `${Math.round(this.progress() * 100)}`;
        },
      }, "<")
      .to({}, { duration: 0.5 }) // hold

    // Phase 2 — fade out preloader content smoothly
      .to(
        [monogramRef.current, titleRef.current, taglineRef.current,
         ornamentTopRef.current, ornamentBotRef.current, counterRef.current],
        { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }
      )
      // Reveal lines just before curtains start opening
      .to([svgLineLeftRef.current, svgLineRightRef.current],
        { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");

    // Phase 3 — straight curtain exit with buttery smooth reveal
    tl.to([leftSvgRef.current, rightSvgRef.current], {
      xPercent: (index) => index === 0 ? -100 : 100,
      duration: 1.8,
      ease: "power2.inOut",
      onStart() {
        // Signal to show content early in the curtain animation
        gsap.delayedCall(0.4, () => {
          preloaderState.hasPlayed = true;
          onCompleteRef.current?.();
        });
      },
      // Curtains fully off-screen
      onComplete() {
        document.body.style.overflow = "";
      },
    }, "-=0.1");

    // Fade out preloader container gradually as curtains open
    tl.to(containerRef.current, { 
      autoAlpha: 0, 
      duration: 1.0, 
      ease: "power2.inOut" 
    }, "-=1.4");

    return () => {
      // cleanup only kills tweens, not the hasRun guard
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="preloader-wrap">
      <svg
        ref={leftSvgRef}
        className="preloader-curtain-svg preloader-curtain-svg--left"
        viewBox="0 0 50 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curtainGradL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#050c18" />
            <stop offset="100%" stopColor="#050c18" />
          </linearGradient>
        </defs>
        <path ref={leftPathRef} fill="url(#curtainGradL)" />
        {/* Golden line on the right edge of the left curtain */}
        <line
          ref={svgLineLeftRef}
          x1="50" y1="0" x2="50" y2="100"
          stroke="#e8a849"
          strokeWidth="0.3"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg
        ref={rightSvgRef}
        className="preloader-curtain-svg preloader-curtain-svg--right"
        viewBox="0 0 50 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curtainGradR" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#050c18" />
            <stop offset="100%" stopColor="#050c18" />
          </linearGradient>
        </defs>
        <path ref={rightPathRef} fill="url(#curtainGradR)" />
        {/* Golden line on the left edge of the right curtain */}
        <line
          ref={svgLineRightRef}
          x1="0" y1="0" x2="0" y2="100"
          stroke="#e8a849"
          strokeWidth="0.3"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="preloader-center">
        <div ref={ornamentTopRef} className="preloader-ornament">
          <OrnamentDiamond />
        </div>

        <div
          ref={monogramRef}
          className="preloader-monogram"
          style={{ transform: "translateY(20px)" }}
        >
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="preloader-monogram-svg"
          >
            <circle cx="40" cy="40" r="38" stroke="var(--amber)" strokeWidth="0.6" />
            <circle cx="40" cy="40" r="32" stroke="var(--amber)" strokeWidth="0.3" opacity="0.45" />
            <text
              x="40" y="50"
              textAnchor="middle"
              fill="var(--amber)"
              fontFamily="Georgia, serif"
              fontSize="22"
              fontWeight="300"
              letterSpacing="2"
            >
              TC
            </text>
          </svg>
        </div>

        <h1
          ref={titleRef}
          className="preloader-title"
          style={{ transform: "translateY(14px)" }}
        >
          The Continental
        </h1>

        <p ref={taglineRef} className="preloader-tagline">
          Est.&nbsp;&nbsp;1924
        </p>

        <div ref={ornamentBotRef} className="preloader-ornament preloader-ornament--bottom">
          <OrnamentDiamond />
        </div>
      </div>

      <span ref={counterRef} className="preloader-counter">0</span>
    </div>
  );
}

function OrnamentDiamond() {
  return (
    <svg width="40" height="8" viewBox="0 0 40 8" fill="none">
      <line x1="0" y1="4" x2="16" y2="4" stroke="var(--amber)" strokeWidth="0.5" opacity="0.6" />
      <rect
        x="17.5" y="1.5"
        width="5" height="5"
        transform="rotate(45 20 4)"
        fill="var(--amber)"
        opacity="0.9"
      />
      <line x1="24" y1="4" x2="40" y2="4" stroke="var(--amber)" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}
