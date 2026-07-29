"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ReservationModal({ isOpen, onClose, suite }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Handle animations
  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      // Show modal with animation
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        modalRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
      );
    } else {
      // Hide modal with animation
      gsap.to(modalRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    alert(`Thank you for your reservation request for the ${suite?.name}. We will contact you shortly to confirm your booking.`);
    onClose();
  };

  if (!suite) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 hidden items-center justify-center p-4 opacity-0"
      style={{ background: "rgba(5, 12, 24, 0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/12 bg-deep-blue/95 backdrop-blur-xl shadow-2xl opacity-0"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 60px rgba(232, 168, 73, 0.15), 0 20px 60px rgba(0, 0, 0, 0.4)",
        }}
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

        {/* Header */}
        <div className="relative border-b border-white/8 px-8 pt-8 pb-6">
          <p className="section-label mb-3">Reserve Your Stay</p>
          <h2 className="heading-serif text-3xl md:text-4xl text-cream mb-2">
            {suite.name}
          </h2>
          <div className="flex items-center gap-3 text-muted text-sm">
            <span>{suite.size}</span>
            <span>&bull;</span>
            <span>{suite.guests}</span>
            <span>&bull;</span>
            <span className="text-amber font-semibold">{suite.price} / night</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Guest Information */}
          <div>
            <h3 className="text-cream text-lg font-semibold mb-4 tracking-wide">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-muted mb-2 tracking-wide">
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
                <label htmlFor="lastName" className="block text-sm text-muted mb-2 tracking-wide">
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
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm text-muted mb-2 tracking-wide">
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
              <label htmlFor="phone" className="block text-sm text-muted mb-2 tracking-wide">
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
          </div>

          {/* Stay Details */}
          <div>
            <h3 className="text-cream text-lg font-semibold mb-4 tracking-wide">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm text-muted mb-2 tracking-wide">
                  Check-In Date *
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
                <label htmlFor="checkOut" className="block text-sm text-muted mb-2 tracking-wide">
                  Check-Out Date *
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
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm text-muted mb-2 tracking-wide">
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
              {suite.guests.includes("6") && (
                <>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                </>
              )}
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm text-muted mb-2 tracking-wide">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows="3"
              className="w-full px-4 py-3 rounded-md glass-pill text-cream bg-midnight/40 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all duration-300 resize-none"
              placeholder="Let us know if you have any special requests or requirements..."
            />
          </div>

          {/* Suite Features Reminder */}
          <div className="border-t border-white/8 pt-6">
            <p className="text-xs text-muted mb-3 tracking-wide uppercase">Included Features</p>
            <div className="grid grid-cols-2 gap-2">
              {suite.features.slice(0, 4).map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-cream/70 text-sm">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-amber">
                    <path
                      d="M2 6l2.8 2.8L10 3.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            {suite.features.length > 4 && (
              <p className="text-xs text-muted mt-2">+ {suite.features.length - 4} more amenities</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-amber rounded-full px-8 py-4 text-sm font-semibold tracking-widest shadow-[0_0_30px_var(--amber-glow)] focus-visible:outline-2 focus-visible:outline-amber"
            >
              Confirm Reservation
            </button>
            <button
              type="button"
              onClick={onClose}
              className="glass-pill rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-muted hover:text-cream hover:border-amber/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-amber"
            >
              Cancel
            </button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-muted/60 text-center leading-relaxed">
            By submitting this reservation, you agree to our cancellation policy. 
            A deposit may be required to secure your booking.
          </p>
        </form>
      </div>
    </div>
  );
}
