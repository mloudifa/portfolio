"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
}

export default function Typewriter({ words }: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((p) => p + 1), 80);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((p) => p - 1), 40);
    } else if (deleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((p) => (p + 1) % words.length);
      }, 10);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, words]);

  return (
    <span>
      {words[index].slice(0, charIndex)}
      <span className="animate-blink text-accent">|</span>
    </span>
  );
}
