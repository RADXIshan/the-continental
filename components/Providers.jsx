"use client";

import PageTransition from "./PageTransition";

export default function Providers({ children }) {
  return (
    <>
      <PageTransition />
      {children}
    </>
  );
}
