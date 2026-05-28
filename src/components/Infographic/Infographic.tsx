"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Infographic.scss";

gsap.registerPlugin(ScrollTrigger);

type InfographicItem = {
  icon: string;
  title?: string;
  text?: string;
};

const fallbackItems: InfographicItem[] = [
  {
    icon: "webpages",
    title: "5+",
    text: "лет опыта в разработке сайтов",
  },
  {
    icon: "tools",
    title: "CMS",
    text: "WordPress и удобная админ-панель",
  },
  {
    icon: "check",
    title: "100%",
    text: "адаптивная верстка под устройства",
  },
  {
    icon: "time",
    title: "SEO",
    text: "базовая подготовка к продвижению",
  },
];

type Props = {
  title?: string;
  items?: InfographicItem[];
};

export default function Infographic({ title, items }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const infographicItems = items?.length ? items : fallbackItems;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".infographic__item");

      if (!cards.length) return;

      if (reduceMotion) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section infographic" ref={rootRef}>
      <div className="container">
        {title ? <h2 className="title-text">{title}</h2> : null}

        <ul className="infographic__list">
          {infographicItems.map((item, index) => (
            <li className="infographic__item" key={`${item.icon}-${index}`}>
              <div className="infographic__icon" aria-hidden="true">
                <svg>
                  <use href={`/sprite.svg#${item.icon}`} />
                </svg>
              </div>

              <div className="infographic__content">
                {item.title ? (
                  <span
                    className="infographic__title"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                ) : null}
                {item.text ? (
                  <span className="infographic__text">{item.text}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
