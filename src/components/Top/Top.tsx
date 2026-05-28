"use client";

import { useEffect, useRef } from "react";

import "./Top.scss";

const TYPE_DELAY = 90;
const DELETE_DELAY = 80;
const START_DELAY = 3000;
const HOLD_AFTER_DELETE = 300;
const AFTER_TYPE_DELAY = 2000;

function useTypeLine(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const fromWord = element.dataset.from ?? "";
    const toWord = element.dataset.to ?? "";
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const setText = (text: string) => {
      if (!cancelled) element.textContent = text;
    };

    const deleteText = (text: string, index: number, onDone: () => void) => {
      if (cancelled) return;

      setText(text.slice(0, index));

      if (index <= 0) {
        timeoutId = setTimeout(onDone, HOLD_AFTER_DELETE);
        return;
      }

      timeoutId = setTimeout(() => deleteText(text, index - 1, onDone), DELETE_DELAY);
    };

    const typeText = (text: string, index: number, onDone: () => void) => {
      if (cancelled) return;

      setText(text.slice(0, index));

      if (index >= text.length) {
        timeoutId = setTimeout(onDone, AFTER_TYPE_DELAY);
        return;
      }

      timeoutId = setTimeout(() => typeText(text, index + 1, onDone), TYPE_DELAY);
    };

    const loop = (current: string, next: string) => {
      deleteText(current, current.length, () => {
        typeText(next, 1, () => loop(next, current));
      });
    };

    timeoutId = setTimeout(() => loop(fromWord, toWord), START_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [ref]);
}

type Props = {
  title?: string;
  hello?: string;
  text?: string;
  specialty?: {
    first?: string;
    second?: string;
    developer?: string;
  };
};

export default function Top({ title, hello, text, specialty }: Props) {
  const typeRef = useRef<HTMLSpanElement | null>(null);

  const pageTitle =
    "Портфолио Frontend-разработчика: создаю посадочные страницы и многостраничные сайты на CMS WordPress";
  const helloText = "Добрый день! Меня зовут Виктор, и я";
  const description =
    "Создаю сайты от лендингов до крупных корпоративных решений - под ключ и до результата";
  const fromWord = specialty?.first?.trim() || "WordPress";
  const toWord = specialty?.second?.trim() || "Frontend";
  const developerRaw = specialty?.developer?.trim() || "разработчик";
  const developer = developerRaw.startsWith("-")
    ? developerRaw
    : `-${developerRaw}`;

  useTypeLine(typeRef);

  return (
    <section className="section--full top">
      <div className="container">
        <div className="top__wrap">
          <h1 className="top__title visually-hidden">{title || pageTitle}</h1>

          <p className="top__hello">
            {hello || helloText}{" "}
            <span className="text-nowrap">
              <br />
            </span>
          </p>

          <p className="top__profession">
            <span
              ref={typeRef}
              className="typeline"
              aria-live="polite"
              data-from={fromWord}
              data-to={toWord}
            >
              {fromWord}
            </span>
            {developer}
          </p>

          <p className="top__text">{text || description}</p>
        </div>
      </div>
    </section>
  );
}
