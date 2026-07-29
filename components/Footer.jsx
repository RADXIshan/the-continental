"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  Explore: ["Suites & Rooms", "Dining", "Spa & Wellness", "Experiences"],
  Hotel: ["Our Story", "Gallery", "Awards", "Sustainability"],
  Connect: ["Contact", "Careers", "Press", "Partnerships"],
};

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-col", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".footer-brand", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-midnight border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-350 px-6 md:px-10">
        <div className="footer-brand mb-16 md:mb-24">
          <p className="heading-serif text-6xl md:text-8xl text-cream/10 select-none text-center">
            Continental
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h4 className="section-label mb-6 text-white/40">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted hover:text-amber transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col col-span-2 md:col-span-1">
            <h4 className="section-label mb-6 text-white/40">Visit</h4>
            <address className="not-italic text-sm text-muted leading-relaxed space-y-1">
              <p>1 Continental Drive</p>
              <p>Lake Geneva, Switzerland</p>
              <p className="pt-4">
                <a href="tel:+41225550100" className="hover:text-amber transition-colors">
                  +41 22 555 0100
                </a>
              </p>
              <p>
                <a href="mailto:concierge@thecontinental.com" className="hover:text-amber transition-colors">
                  concierge@thecontinental.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} The Continental. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-white/30 hover:text-amber transition-colors duration-300 tracking-wide"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
