'use client';

// With Zustand, we don't need wrapping Providers anymore.
// Stores are global and auto-initialize. This component just
// renders children directly — kept for root layout compatibility.
export function Providers({ children }) {
  return children;
}
