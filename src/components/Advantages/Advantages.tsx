"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Advantages.scss";

gsap.registerPlugin(ScrollTrigger);

type AdvantageItem = {
  icon?: string;
  imageUrl?: string;
  name?: string;
  text?: string;
};

const fallbackAdvantages: AdvantageItem[] = [
  {
    icon: "creativity",
    name: "Более 5 лет опыта",
    text: "Создание сайтов моя основная деятельность, сделал более 150 сайтов",
  },
  {
    icon: "stopwatch",
    name: "Оптимальные сроки",
    text: "Выполняю работы в оговоренные сроки, без потери качества",
  },
  {
    icon: "support",
    name: "Поддержка сайтов",
    text: "Оперативно устраняю проблемы и всегда на связи в Telegram и WhatsApp",
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
                {item.icon ? (
                  <svg aria-hidden="true">
                    <use href={`/sprite.svg#${item.icon}`} />
                  </svg>
                ) : item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name || ""} loading="lazy" />
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
