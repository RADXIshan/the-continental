"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { rooms } from "../lib/rooms";

export default function BookingSidePanel({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [selectedSuite, setSelectedSuite] = useState("");
  const [step, setStep] = useState(1); // 1: dates & suite, 2: guest details

  // Handle animations
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      // Show panel with animation
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.fromTo(
        panelRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power3.out" }
      );
    } else {
      // Hide panel with animation
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
          setStep(1); // Reset to step 1 when closing
        },
      });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      // Compensate for scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Stop Lenis so it doesn't fight the lock
      if (window.lenis) window.lenis.stop();

      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        if (window.lenis) window.lenis.start();
      };
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Final submission
      alert("Thank you for your reservation request. Our concierge will contact you shortly to confirm your booking.");
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 hidden opacity-0"
      style={{ background: "rgba(5, 12, 24, 0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <aside
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full md:w-120 lg:w-135 bg-deep-blue border-l border-white/12 shadow-2xl overflow-y-auto"
        style={{
          transform: "translateX(100%)",
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(232, 168, 73, 0.1)",
          overscrollBehavior: "contain",
        }}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-deep-blue/95 backdrop-blur-xl border-b border-white/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label mb-1.5">Book Your Stay</p>
              <h2 className="heading-serif text-3xl text-cream">
                {step === 1 ? "Choose Your Suite" : "Guest Details"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full glass-pill hover:border-amber/30 transition-all duration-300 group"
              aria-label="Close booking panel"
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
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-amber" : "bg-white/10"}`} />
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-amber" : "bg-white/10"}`} />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          {step === 1 ? (
            <>
              {/* Suite Selection */}
              <div>
                <label htmlFor="suite" className="block text-cream text-base font-semibold mb-4 tracking-wide">
                  Select Your Suite *
                </label>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <label
                      key={room.slug}
                      className={`block relative cursor-pointer transition-all duration-300 ${
                        selectedSuite === room.slug
                          ? "ring-2 ring-amber shadow-[0_0_20px_var(--amber-glow)]"
                          : "hover:border-amber/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="suite"
                        value={room.slug}
                        checked={selectedSuite === room.slug}
                        onChange={(e) => setSelectedSuite(e.target.value)}
                        className="sr-only"
                        required
                      />
                      <div className="glass-pill rounded-lg p-4 transition-all duration-300">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-cream font-semibold text-base mb-1">
                              {room.name}
                            </h3>
                            <p className="text-muted text-sm mb-2">{room.desc}</p>
                            <div className="flex items-center gap-3 text-xs text-muted">
                              <span>{room.size}</span>
                              <span>&bull;</span>
                              <span>{room.guests}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-amber font-bold text-lg whitespace-nowrap">
                              {room.price}
                            </p>
                            <p className="text-muted text-xs">per night</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkIn" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                    Check-In *
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    required
                    className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="checkOut" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                    Check-Out *
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    required
                    className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label htmlFor="guests" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                >
                  <option value="">Select number of guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label htmlFor="email" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="specialRequests" className="block text-cream text-sm font-semibold mb-2 tracking-wide">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="4"
                  className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300 resize-none"
                  placeholder="Dietary requirements, early check-in, special occasions..."
                />
              </div>

              {/* Booking Summary */}
              {selectedSuite && (
                <div className="border-t border-white/8 pt-6">
                  <p className="text-xs text-muted mb-3 tracking-wide uppercase">Booking Summary</p>
                  <div className="glass-pill rounded-lg p-4">
                    <p className="text-cream font-semibold mb-1">
                      {rooms.find((r) => r.slug === selectedSuite)?.name}
                    </p>
                    <p className="text-muted text-sm">
                      {rooms.find((r) => r.slug === selectedSuite)?.size} &bull;{" "}
                      {rooms.find((r) => r.slug === selectedSuite)?.guests}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 -mx-8 -mb-8 bg-deep-blue/95 backdrop-blur-xl border-t border-white/10 px-8 py-6">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full mb-3 glass-pill rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide text-muted hover:text-cream hover:border-amber/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M11 14l-5-5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Suite Selection
              </button>
            )}
            <button
              type="submit"
              className="w-full btn-amber rounded-full px-8 py-4 text-sm font-semibold tracking-widest shadow-[0_0_30px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
            >
              {step === 1 ? "Continue to Guest Details" : "Complete Reservation"}
            </button>
            <p className="text-xs text-muted/60 text-center mt-4 leading-relaxed">
              By proceeding, you agree to our terms and cancellation policy.
            </p>
          </div>
        </form>
      </aside>
    </div>
  );
}
