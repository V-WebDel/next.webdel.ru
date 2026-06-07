"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import "./Portfolio.scss";

const SORT_ICON = "/sprite.svg#sort";

export type PortfolioTerm = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export type PortfolioItem = {
  id: number;
  title?: string;
  href?: string;
  date?: string;
  termIds?: number[];
  imageJpg?: string;
  imageWebp?: string;
  imageAlt?: string;
};

type SortOrder = "new" | "old";

type Props = {
  title?: string;
  items?: PortfolioItem[];
  terms?: PortfolioTerm[];
};

function compareByDate(order: SortOrder) {
  return (a: PortfolioItem, b: PortfolioItem) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;

    return order === "new" ? bTime - aTime : aTime - bTime;
  };
}

export default function Portfolio({
  title = "Моё портфолио",
  items = [],
  terms = [],
}: Props) {
  const [activeTermId, setActiveTermId] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("new");

  const visibleItems = useMemo(() => {
    const filtered =
      activeTermId === "all"
        ? items
        : items.filter((item) => item.termIds?.includes(activeTermId));

    return [...filtered].sort(compareByDate(sortOrder));
  }, [activeTermId, items, sortOrder]);

  return (
    <section className="section--full portfolio">
      <div className="container">
        <h1 className="title-text title-text--reverse">{title}</h1>

        <form className="form-filters" action="/portfolio">
          <fieldset className="form-filters__filters">
            <legend className="visually-hidden">Фильтр проектов</legend>
            <div className="form-filters__list form-filters__list--btns">
              <label className="radio radio--btn form-filters__item">
                <input
                  className="radio__default"
                  type="radio"
                  name="filter"
                  checked={activeTermId === "all"}
                  onChange={() => setActiveTermId("all")}
                />
                <span className="radio__new"></span>
                <span className="radio__label">Все</span>
              </label>

              {terms.map((term) => (
                <label
                  className="radio radio--btn form-filters__item"
                  key={term.id}
                >
                  <input
                    className="radio__default"
                    type="radio"
                    name="filter"
                    value={term.slug}
                    checked={activeTermId === term.id}
                    onChange={() => setActiveTermId(term.id)}
                  />
                  <span className="radio__new"></span>
                  <span className="radio__label">{term.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-filters__list form-filters__list--sort">
            <legend className="visually-hidden">Сортировка проектов</legend>
            <label className="radio form-filters__item">
              <input
                className="radio__default"
                type="radio"
                name="sort"
                value="new"
                checked={sortOrder === "new"}
                onChange={() => setSortOrder("new")}
              />
              <span className="radio__new">
                <svg aria-hidden="true" focusable="false">
                  <use href={SORT_ICON} xlinkHref={SORT_ICON} />
                </svg>
              </span>
              <span className="radio__label">Сначала новые</span>
            </label>

            <label className="radio form-filters__item">
              <input
                className="radio__default"
                type="radio"
                name="sort"
                value="old"
                checked={sortOrder === "old"}
                onChange={() => setSortOrder("old")}
              />
              <span className="radio__new radio__new--reverse">
                <svg aria-hidden="true" focusable="false">
                  <use href={SORT_ICON} xlinkHref={SORT_ICON} />
                </svg>
              </span>
              <span className="radio__label">Сначала старые</span>
            </label>
          </fieldset>
        </form>

        {visibleItems.length ? (
          <ul className="portfolio__wrap">
            {visibleItems.map((item) => (
              <li className="portfolio__item" key={item.id}>
                <Link className="portfolio__link" href={item.href || "/"}>
                  <span className="portfolio__inner">
                    <picture>
                      {item.imageWebp ? (
                        <source srcSet={item.imageWebp} type="image/webp" />
                      ) : null}
                      {item.imageJpg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageJpg}
                          alt={item.imageAlt || item.title || ""}
                          loading="lazy"
                        />
                      ) : null}
                    </picture>
                  </span>

                  {item.title ? (
                    <span
                      className="portfolio__name"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="portfolio__empty">Проекты не найдены</p>
        )}
      </div>
    </section>
  );
}
