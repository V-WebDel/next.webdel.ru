"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import "./Header.scss";
import "./Menu.scss";

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const offsetRef = useRef(0);
  const wasMenuOpenRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const getTop = () =>
    (typeof window !== "undefined" &&
      (window.pageYOffset || document.documentElement.scrollTop)) ||
    0;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((value) => !value);

  useEffect(() => {
    const body = document.body;

    if (!menuOpen && !wasMenuOpenRef.current) {
      headerRef.current?.setAttribute("aria-expanded", "false");
      return;
    }

    if (menuOpen) {
      const scrollY = window.scrollY || window.pageYOffset;

      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.overflow = "hidden";
      body.style.width = "100%";
      headerRef.current?.setAttribute("aria-expanded", "true");
      menuRef.current?.classList.add("show");
      wasMenuOpenRef.current = true;

      return;
    }

    const y = parseInt(
      (
        getComputedStyle(document.documentElement).getPropertyValue("--scroll-y") ||
        "0"
      ).replace("px", ""),
      10
    );

    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("left");
    body.style.removeProperty("right");
    body.style.removeProperty("overflow");
    body.style.removeProperty("width");
    window.scrollTo(0, y || 0);
    headerRef.current?.setAttribute("aria-expanded", "false");
    menuRef.current?.classList.remove("show");
    wasMenuOpenRef.current = false;
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = getTop();
      const scrollUp = scrolled - offsetRef.current;

      if (headerRef.current) {
        if (scrollUp > 0) {
          headerRef.current.classList.add("header--hide", "header--scroll");
        } else {
          headerRef.current.classList.remove("header--hide");
        }

        if (scrolled > 10) {
          headerRef.current.classList.add("header--scroll");
        } else {
          headerRef.current.classList.remove("header--scroll");
        }
      }

      offsetRef.current = scrolled;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (getTop() > 0) {
      headerRef.current?.classList.add("header--scroll");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="header"
      ref={headerRef}
      aria-expanded="false"
      aria-label="Основная шапка сайта"
    >
      <div className="container container-mobile">
        <div className="header__wrap">
          <div className="logo header__logo">
            <Link href="/" className="logo__link" onClick={closeMenu}>
              <span className="logo__name">WebDel</span>
              <span className="logo__description">Создание сайтов</span>
            </Link>
          </div>

          <nav
            id="header-menu"
            className="menu header__menu"
            ref={menuRef}
            aria-hidden={!menuOpen}
          >
            <ul className="menu__list">
              <li className="menu__item">
                <Link href="/rezume" className="menu__link" onClick={closeMenu}>
                  <svg className="menu__svg menu__svg--business" aria-hidden="true">
                    <use href="/sprite.svg#business" />
                  </svg>
                  <span className="menu__name">Резюме</span>
                </Link>
              </li>

              <li className="menu__item">
                <Link href="/portfolio" className="menu__link" onClick={closeMenu}>
                  <svg className="menu__svg menu__svg--briefcas" aria-hidden="true">
                    <use href="/sprite.svg#briefcas" />
                  </svg>
                  <span className="menu__name">Портфолио</span>
                </Link>
              </li>

              <li className="menu__item">
                <Link href="/blog" className="menu__link" onClick={closeMenu}>
                  <svg className="menu__svg menu__svg--contacts" aria-hidden="true">
                    <use href="/sprite.svg#writing-list" />
                  </svg>
                  <span className="menu__name">Блог</span>
                </Link>
              </li>

              <li className="menu__item">
                <Link href="/contact" className="menu__link" onClick={closeMenu}>
                  <svg className="menu__svg menu__svg--contacts" aria-hidden="true">
                    <use href="/sprite.svg#contact" />
                  </svg>
                  <span className="menu__name">Контакты</span>
                </Link>
              </li>
            </ul>

            <button
              className="header__close-menu close-menu"
              type="button"
              aria-label="Закрыть меню"
              aria-controls="header-menu"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="close-menu__line"></span>
              <span className="visually-hidden">Закрыть меню</span>
            </button>
          </nav>

          <button
            className="header__open-menu open-menu"
            type="button"
            aria-label="Открыть меню"
            aria-controls="header-menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="open-menu__line"></span>
            <span className="visually-hidden">Открыть меню</span>
          </button>
        </div>
      </div>
    </header>
  );
}
