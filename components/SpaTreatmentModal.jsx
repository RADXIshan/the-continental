"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ALL_TREATMENTS = [
  {
    number: "01",
    name: "Signature Ritual",
    duration: "120 min",
    price: "$320",
    desc: "Full-body renewal with rare botanical oils drawn from the Alpine meadows. Begins with dry brushing and concludes with hot-stone integration.",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "02",
    name: "Thermal Hydrotherapy",
    duration: "90 min",
    price: "$240",
    desc: "A journey through ancient thermal pools and mineral springs at contrasting temperatures — designed to reset the nervous system and restore deep calm.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    name: "Couples Sanctuary",
    duration: "180 min",
    price: "$580",
    desc: "A private candlelit suite, champagne, and synchronised treatments crafted for two. The evening concludes with a private soak in a cedar hot tub.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "04",
    name: "Lumière Facial",
    duration: "75 min",
    price: "$195",
    desc: "Swiss cellular science meets ancient lymphatic technique. Formulated exclusively for The Continental using high-altitude botanicals.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
  },
];

export default function SpaTreatmentModal({ isOpen, onClose, treatment }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const headerImgRef = useRef(null);

  // Local selected treatment name — starts from whichever card was clicked
  const [selectedName, setSelectedName] = useState(treatment?.name ?? null);
  const activeTreatment = ALL_TREATMENTS.find((item) => item.name === selectedName) ?? treatment ?? ALL_TREATMENTS[0];
  const activeTreatmentName = activeTreatment?.name ?? null;
  const activeTreatmentImage = activeTreatment?.image ?? null;

  // Crossfade header image when selection changes
  useEffect(() => {
    if (!headerImgRef.current || !activeTreatmentName || !activeTreatmentImage) return;
    gsap.fromTo(
      headerImgRef.current,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1.05, duration: 0.5, ease: "power2.out" }
    );
    headerImgRef.current.src = activeTreatmentImage;
    headerImgRef.current.alt = activeTreatmentName;
  }, [activeTreatmentName, activeTreatmentImage]);

  // Open / close animations
  useEffect(() => {
    if (!overlayRef.current || !modalRef.current || !activeTreatmentName) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        modalRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
      );
    } else {
      gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.97, duration: 0.3, ease: "power2.in" });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [isOpen, activeTreatmentName]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Page scroll lock — stop Lenis and lock body scroll when open.
  // We intercept wheel/touch events on the modal so they never reach Lenis,
  // allowing the modal's own overflow-y scroll to work natively.
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const stopPropagation = (e) => e.stopPropagation();

    if (isOpen) {
      window.lenis?.stop();
      document.body.style.overflow = "hidden";
      modal.addEventListener("wheel", stopPropagation);
      modal.addEventListener("touchmove", stopPropagation);
    } else {
      window.lenis?.start();
      document.body.style.overflow = "";
      modal.removeEventListener("wheel", stopPropagation);
      modal.removeEventListener("touchmove", stopPropagation);
    }

    return () => {
      window.lenis?.start();
      document.body.style.overflow = "";
      modal.removeEventListener("wheel", stopPropagation);
      modal.removeEventListener("touchmove", stopPropagation);
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you for booking the ${activeTreatment?.name}. Our spa concierge will contact you shortly to confirm your appointment.`
    );
    onClose();
  };

  if (!activeTreatment) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 hidden items-center justify-center p-4 opacity-0"
      style={{ background: "rgba(5, 12, 24, 0.88)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[88vh] md:max-h-[90vh] overflow-y-auto rounded-lg border border-white/12 bg-deep-blue/95 backdrop-blur-xl shadow-2xl opacity-0"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 60px rgba(232, 168, 73, 0.15), 0 20px 60px rgba(0,0,0,0.4)" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full glass-pill hover:border-amber/30 transition-all duration-300 group"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-muted group-hover:text-amber transition-colors duration-300"
            />
          </svg>
        </button>

        {/* Header with treatment image */}
        <div className="relative overflow-hidden rounded-t-lg" style={{ height: "clamp(160px, 40vw, 220px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={headerImgRef}
            src={activeTreatment.image}
            alt={activeTreatment.name}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-deep-blue via-deep-blue/50 to-transparent" />
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-4 sm:left-6 md:left-8">
            <p className="section-label mb-1 sm:mb-2 text-[0.65rem] sm:text-xs">Spa Treatment</p>
            <h2 className="heading-serif text-2xl sm:text-3xl md:text-4xl text-cream">{activeTreatment.name}</h2>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <span className="text-amber font-medium tracking-widest uppercase text-[0.65rem] sm:text-xs">
                {activeTreatment.duration}
              </span>
              <span className="text-white/30 text-[0.65rem] sm:text-xs">·</span>
              <span className="text-cream/60 text-[0.65rem] sm:text-xs font-medium tracking-wide">{activeTreatment.price}</span>
            </div>
          </div>
        </div>

        {/* Treatment description */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 md:pb-5 border-b border-white/8">
          <p className="text-muted text-xs sm:text-sm md:text-base leading-relaxed">{activeTreatment.desc}</p>
        </div>

        {/* ── Treatment selector ── */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-white/8">
          <p className="text-[0.65rem] sm:text-xs text-white/40 tracking-widest uppercase mb-3 sm:mb-4">Choose Treatment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {ALL_TREATMENTS.map((t) => {
              const isActive = activeTreatment.name === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setSelectedName(t.name)}
                  className={`text-left rounded-md px-3 sm:px-4 py-2 sm:py-3.5 border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-amber ${
                    isActive
                      ? "border-amber/60 bg-amber/8 text-cream"
                      : "border-white/8 bg-midnight/30 text-muted hover:border-white/20 hover:text-cream"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold tracking-wide truncate ${isActive ? "text-cream" : "text-cream/70"}`}>
                        {t.name}
                      </p>
                      <p className="text-[0.65rem] sm:text-xs text-muted mt-0.5">{t.duration}</p>
                    </div>
                    <span className={`shrink-0 text-[0.65rem] sm:text-xs font-semibold tracking-wide mt-0.5 ${isActive ? "text-amber" : "text-white/30"}`}>
                      {t.price}
                    </span>
                  </div>
                  {isActive && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber" />
                      <span className="text-[0.6rem] text-amber tracking-widest uppercase">Selected</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Guest Information */}
          <div>
            <h3 className="text-cream text-base sm:text-lg font-semibold mb-3 sm:mb-4 tracking-wide">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="spa-firstName" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                  First Name *
                </label>
                <input
                  type="text"
                  id="spa-firstName"
                  name="firstName"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="spa-lastName" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="spa-lastName"
                  name="lastName"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="spa-email" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                Email Address *
              </label>
              <input
                type="email"
                id="spa-email"
                name="email"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label htmlFor="spa-phone" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                Phone Number *
              </label>
              <input
                type="tel"
                id="spa-phone"
                name="phone"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="text-cream text-base sm:text-lg font-semibold mb-3 sm:mb-4 tracking-wide">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="spa-date" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="spa-date"
                  name="date"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="spa-time" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
                  Preferred Time *
                </label>
                <select
                  id="spa-time"
                  name="time"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label htmlFor="spa-guests" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
              Number of Guests *
            </label>
            <select
              id="spa-guests"
              name="guests"
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300"
            >
              <option value="">Select number of guests</option>
              <option value="1">1 Guest</option>
              {activeTreatment.name === "Couples Sanctuary" ? (
                <option value="2">2 Guests</option>
              ) : (
                <>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </>
              )}
            </select>
          </div>

          {/* Special requests */}
          <div>
            <label htmlFor="spa-requests" className="block text-xs sm:text-sm text-muted mb-1.5 sm:mb-2 tracking-wide">
              Special Requests (Optional)
            </label>
            <textarea
              id="spa-requests"
              name="specialRequests"
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md glass-pill text-xs sm:text-sm text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all duration-300 resize-none"
              placeholder="Allergies, preferences, or anything we should know…"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="submit"
              className="flex-1 btn-amber rounded-full px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest shadow-[0_0_30px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
            >
              Book {activeTreatment.name}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="glass-pill rounded-full px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide text-muted hover:text-cream hover:border-amber/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-amber"
            >
              Cancel
            </button>
          </div>

          <p className="text-[0.65rem] sm:text-xs text-muted/60 text-center leading-relaxed">
            Our spa concierge will confirm your appointment within 24 hours.
            Cancellations accepted up to 48 hours in advance.
          </p>
        </form>
      </div>
    </div>
  );
}
