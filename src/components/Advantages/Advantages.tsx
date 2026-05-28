"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Advantages.scss";

gsap.registerPlugin(ScrollTrigger);

type AdvantageItem = {
  imageUrl?: string;
  name?: string;
  text?: string;
};

const fallbackAdvantages: AdvantageItem[] = [
  {
    name: "Адаптивная верстка",
    text: "Сайт корректно выглядит на телефонах, планшетах и больших экранах.",
  },
  {
    name: "Удобная поддержка",
    text: "Структура проекта остается понятной, чтобы сайт было легко развивать.",
  },
  {
    name: "Аккуратная реализация",
    text: "Слежу за деталями, скоростью загрузки и стабильной работой интерфейса.",
  },
];

type Props = {
  title?: string;
  items?: AdvantageItem[];
};

export default function Advantages({ title, items }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const advantages = items?.length ? items : fallbackAdvantages;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".advantages__item");

      if (!cards.length) return;

      if (reduceMotion) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 250, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: "power1.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section advantages" ref={rootRef}>
      <div className="container">
        <h2 className="title-text">{title || "Преимущества"}</h2>

        <ul className="advantages__list">
          {advantages.map((item, index) => (
            <li className="advantages__item" key={item.name || index}>
              <div className="advantages__icon">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name || ""}
                    fill
                    sizes="48px"
                    unoptimized
                  />
                ) : (
                  <svg aria-hidden="true">
                    <use href="/sprite.svg#check" />
                  </svg>
                )}
              </div>

              <div className="advantages__content">
                {item.name ? (
                  <h3 className="advantages__title">{item.name}</h3>
                ) : null}
                {item.text ? (
                  <p
                    className="advantages__text"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
