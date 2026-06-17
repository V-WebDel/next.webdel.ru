import Link from "next/link";

import "./Blog.scss";

export type BlogItem = {
  id: number;
  title?: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  readingTime?: string;
  date?: string;
};

export type BlogPaginationLink = {
  label: string;
  href?: string;
  current?: boolean;
  dots?: boolean;
  rel?: "prev" | "next";
};

type Props = {
  title?: string;
  items?: BlogItem[];
  pagination?: BlogPaginationLink[];
};

export default function Blog({
  title = "Мой Блог",
  items = [],
  pagination = [],
}: Props) {
  return (
    <section className="section--full blog">
      <div className="container">
        <h2 className="title-text">{title}</h2>

        <ul className="blog-list">
          {items.map((item) => (
            <li className="blog-list__item blog-item" key={item.id}>
              <Link className="blog-item__link" href={item.href || "/"}>
                <div className="blog-item__image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || "/images/articles/default.png"}
                    alt={item.imageAlt || "image"}
                    loading="lazy"
                  />
                </div>

                <div className="blog-item__content">
                  {item.title ? (
                    <div
                      className="blog-item__name"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                  ) : null}

                  <div className="blog-item__info">
                    {item.readingTime ? <span>{item.readingTime}</span> : null}
                    {item.date ? <span>{item.date}</span> : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}

          {pagination.length ? (
            <nav className="navigation pagination">
              {pagination.map((item, index) => {
                const className = [
                  item.rel,
                  "page-numbers",
                  item.current ? "current" : "",
                  item.dots ? "dots" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                if (item.current || item.dots || !item.href) {
                  return (
                    <span
                      className={className}
                      aria-current={item.current ? "page" : undefined}
                      key={`${item.label}-${index}`}
                    >
                      {item.label}
                    </span>
                  );
                }

                return (
                  <Link
                    className={className}
                    href={item.href}
                    key={`${item.label}-${index}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
