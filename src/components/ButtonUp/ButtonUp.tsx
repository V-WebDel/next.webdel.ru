"use client";

import { useEffect, useRef } from "react";

const SHOW_OFFSET = 300;

export default function ButtonUp() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const updateButton = () => {
      const isShown = window.scrollY > SHOW_OFFSET;

      button.classList.toggle("btn-up--show", isShown);

      if (isShown) {
        button.classList.remove("btn-up--top");
      }
    };

    updateButton();
    window.addEventListener("scroll", updateButton, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateButton);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });

    buttonRef.current?.classList.add("btn-up--top");
  };

  return (
    <button
      ref={buttonRef}
      className="btn-up"
      type="button"
      aria-label="Наверх"
      onClick={handleClick}
    >
      <svg aria-hidden="true">
        <use href="/sprite.svg#up-arrow" xlinkHref="/sprite.svg#up-arrow" />
      </svg>
    </button>
  );
}
