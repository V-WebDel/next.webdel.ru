import Link from "next/link";

import ArticleEffects from "./ArticleEffects";
import "./Article.scss";

export type ArticleNavPost = {
  title?: string;
  href: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  title?: string;
  content?: string;
  date?: string;
  readingTime?: string;
  views?: string;
  categories?: Array<{ id: number; name: string; href?: string }>;
  previousPost?: ArticleNavPost;
  nextPost?: ArticleNavPost;
};

function NavPost({
  previousPost,
  nextPost,
  variant,
}: {
  previousPost?: ArticleNavPost;
  nextPost?: ArticleNavPost;
  variant: "desktop" | "mobile";
}) {
  if (!previousPost && !nextPost) return null;

  return (
    <div className={`navpost navpost--${variant}`}>
      <div className="navpost__inner sidebar-block">
        {previousPost ? (
          <div className="navpost__article">
            <div className="navpost__title">Предыдущая статья:</div>
            <Link className="navpost__link" href={previousPost.href}>
              <div className="navpost__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previousPost.image || "/images/articles/default.png"} alt={previousPost.imageAlt || "image"} />
              </div>
              {previousPost.title ? (
                <div
                  className="navpost__name"
                  dangerouslySetInnerHTML={{ __html: previousPost.title }}
                />
              ) : null}
            </Link>
          </div>
        ) : null}

        {nextPost ? (
          <div className="navpost__article">
            <div className="navpost__title">Следующая статья:</div>
            <Link className="navpost__link" href={nextPost.href}>
              <div className="navpost__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nextPost.image || "/images/articles/default.png"} alt={nextPost.imageAlt || "image"} />
              </div>
              {nextPost.title ? (
                <div
                  className="navpost__name"
                  dangerouslySetInnerHTML={{ __html: nextPost.title }}
                />
              ) : null}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Article({
  title,
  content,
  date,
  readingTime,
  views,
  categories = [],
  previousPost,
  nextPost,
}: Props) {
  return (
    <>
      <ArticleEffects />

      <div className="inner inner--top article-top">
        <section className="section heading">
          <div className="container">
            {title ? (
              <h1
                className="title-text title-text--reverse heading__title"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : null}
          </div>
        </section>
      </div>

      <section>
        <div className="container">
          <div className="breadcrumb">
            <div className="breadcrumb__wrap">
              <span>
                <span>
                  <Link href="/">WebDel</Link>
                </span>
                <span aria-hidden="true">→</span>
                <span>
                  <Link href="/blog">Блог</Link>
                </span>
                <span aria-hidden="true">→</span>
                {title ? (
                  <span
                    className="breadcrumb_last"
                    aria-current="page"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                ) : null}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section article">
        <div className="container">
          <div className="article__wrap">
            <main
              className="article__main content"
              dangerouslySetInnerHTML={{ __html: content || "" }}
            />

            <NavPost
              previousPost={previousPost}
              nextPost={nextPost}
              variant="mobile"
            />

            <aside className="article__sidebar">
              <div className="info">
                <div className="info__inner sidebar-block">
                  <div className="info__title sidebar-block__title">Детали статьи:</div>
                  <ul className="info__list">
                    {date ? (
                      <li className="info__item info__item--icon info__item--date">
                        <span>{date}</span>
                      </li>
                    ) : null}
                    {readingTime ? (
                      <li className="info__item info__item--icon info__item--read">
                        <span>{readingTime}</span>
                      </li>
                    ) : null}
                    {views ? (
                      <li className="info__item info__item--icon info__item--show">
                        <span>{views}</span>
                      </li>
                    ) : null}
                  </ul>

                  {categories.length ? (
                    <>
                      <div className="info__title sidebar-block__title">Категории:</div>
                      <ul className="info__list">
                        <li className="info__item info__item--category">
                          {categories.map((category) =>
                            category.href ? (
                              <Link
                                className="info__link"
                                href={category.href}
                                key={category.id}
                              >
                                {category.name}
                              </Link>
                            ) : (
                              <span className="info__link" key={category.id}>
                                {category.name}
                              </span>
                            )
                          )}
                        </li>
                      </ul>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="sticky-sidebar">
                <div className="toc">
                  <div className="toc__inner sidebar-block toc-main">
                    <div className="toc__title sidebar-block__title">
                      Навигация по статье:
                      <button className="no-btn toc__show" type="button" aria-label="Показать или скрыть оглавление" />
                    </div>
                    <div className="toc__block" />
                  </div>
                </div>

                <NavPost
                  previousPost={previousPost}
                  nextPost={nextPost}
                  variant="desktop"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
