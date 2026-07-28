"use client";

import PageTransition from "./PageTransition";

export default function Providers({ children }) {
  return (
    <>
      <PageTransition />
      <div id="app-content">
        {children}
      </div>
    </>
  );
}
