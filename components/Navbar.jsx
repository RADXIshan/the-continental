"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import BookingSidePanel from "./BookingSidePanel";

const navLinks = [
  { label: "Suites", href: "#rooms" },
  { label: "Dining", href: "#dining" },
  { label: "Spa", href: "#spa" },
  { label: "Experiences", href: "#experiences" },
  { label: "Our Story", href: "#story" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingPanelOpen, setBookingPanelOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);

  const isHome = pathname === "/";

  // Scroll-based background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu open/close animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const links = mobileLinksRef.current;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(menu, { autoAlpha: 1, duration: 0.4, ease: "power3.out" });
      gsap.from(links, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        delay: 0.1,
        ease: "power3.out",
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(menu, { autoAlpha: 0, duration: 0.3, ease: "power3.in" });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (isHome) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Store the target section id so the home page can scroll to it
      // after the preloader finishes revealing content.
      sessionStorage.setItem("scrollTarget", href);
      window.location.href = "/";
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setBookingPanelOpen(true);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-midnight/90 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-7"
        }`}
      >
        <nav
          className="mx-auto max-w-350 px-6 md:px-10 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href={isHome ? "#" : "/"}
            className="nav-logo flex flex-col leading-none group"
            onClick={handleLogoClick}
          >
            <span className="heading-serif text-cream text-3xl md:text-4xl font-semibold tracking-tight group-hover:text-amber transition-colors duration-300">
              Continental
            </span>
            <span className="section-label text-[0.55rem] mt-0.5 tracking-[0.3em]">
              Est. 1924
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-9" role="list">
            {navLinks.map((link) => (
              <li key={link.label} className="nav-item">
                {isHome ? (
                  <a
                    href={link.href}
                    className="nav-link text-base font-semibold tracking-wide"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    href={`/${link.href}`}
                    className="nav-link text-base font-semibold tracking-wide"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center nav-reserve">
            <button
              type="button"
              onClick={handleBookingClick}
              className="btn-amber rounded-full px-8 py-3 text-sm font-semibold tracking-widest shadow-[0_0_24px_var(--amber-glow)]"
            >
              Reserve Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex flex-col gap-1.25 p-2 group"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`block h-px w-6 bg-cream transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-1.75" : ""
              }`}
            />
            <span
              className={`block h-px bg-cream transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-4"
              }`}
            />
            <span
              className={`block h-px w-6 bg-cream transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-1.75" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-midnight flex flex-col justify-center px-8"
        style={{ visibility: "hidden", opacity: 0 }}
        aria-hidden={!menuOpen}
      >
        {/* Decorative watermark */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 heading-serif text-[22vw] text-white/3 select-none pointer-events-none whitespace-nowrap"
        >
          Continental
        </span>

        <ul className="space-y-1" role="list">
          {navLinks.map((link, i) => (
            <li key={link.label}>
              {isHome ? (
                <a
                  ref={(el) => (mobileLinksRef.current[i] = el)}
                  href={link.href}
                  className="block heading-serif text-5xl sm:text-6xl text-cream/70 hover:text-amber transition-colors duration-300 py-3 border-b border-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  ref={(el) => (mobileLinksRef.current[i] = el)}
                  href={`/${link.href}`}
                  className="block heading-serif text-5xl sm:text-6xl text-cream/70 hover:text-amber transition-colors duration-300 py-3 border-b border-white/5"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div
          ref={(el) => (mobileLinksRef.current[navLinks.length] = el)}
          className="mt-10"
        >
          <button
            type="button"
            onClick={handleBookingClick}
            className="btn-amber w-full text-center rounded-full py-4 text-sm font-semibold tracking-widest shadow-[0_0_32px_var(--amber-glow)]"
          >
            Reserve Now
          </button>
        </div>
      </div>

      {/* Booking Side Panel */}
      <BookingSidePanel
        isOpen={bookingPanelOpen}
        onClose={() => setBookingPanelOpen(false)}
      />
    </>
  );
}
