"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  typingMs?: number;
  deletingMs?: number;
  holdMs?: number;
}

/**
 * Accessible typewriter: the animated text is hidden from assistive tech
 * (aria-hidden) while a visually hidden span exposes the full role list.
 */
export function Typewriter({
  words,
  typingMs = 80,
  deletingMs = 40,
  holdMs = 2000,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((p) => p + 1), typingMs);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((p) => p - 1), deletingMs);
    } else if (deleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((p) => (p + 1) % words.length);
      }, 10);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, words, typingMs, deletingMs, holdMs]);

  return (
    <span className="relative inline-flex">
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span>{words[index].slice(0, charIndex)}</span>
        <span className="animate-blink text-accent">&nbsp;|</span>
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
