"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navLinks = [
  { label: "Suites & Rooms", href: "#rooms" },
  { label: "Dining & Bar", href: "#dining" },
  { label: "Experiences", href: "#experiences" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -60",
        end: 99999,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });

      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 2.2,
        ease: "power3.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled || menuOpen
          ? "bg-midnight/80 backdrop-blur-xl border-b border-white/5 py-5"
          : "bg-transparent py-7 md:py-9"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <nav className="flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-8 lg:gap-10 flex-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-item nav-link text-sm tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reserve"
              className="nav-item hidden md:inline-flex items-center btn-amber rounded-full px-6 py-2.5 text-sm whitespace-nowrap ml-auto"
            >
              Reserve Now
            </a>
          </div>

          <a
            href="#"
            className="nav-item heading-serif text-xl md:text-2xl text-cream md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            The Continental
          </a>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              aria-label="Toggle menu"
              className="nav-item md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`block h-px w-6 bg-cream transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-cream transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        <div
          className={`hidden md:block h-px bg-white/10 mt-6 transition-opacity duration-500 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            menuOpen ? "max-h-64 mt-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pb-4 border-t border-white/10 pt-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-lg"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reserve"
              className="btn-amber rounded-full px-6 py-3 text-sm text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Reserve Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
