"use client";

import Link from "next/link";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "./Examples.scss";

const ARROW_ICON = "/sprite.svg#arrow";

export type ExampleItem = {
  id: number;
  title?: string;
  href?: string;
  imageJpg?: string;
  imageWebp?: string;
  imageAlt?: string;
};

type Props = {
  title?: string;
  text?: string;
  buttonText?: string;
  buttonHref?: string;
  items?: ExampleItem[];
};

export default function Examples({
  title,
  text,
  buttonText,
  buttonHref = "/portfolio",
  items = [],
}: Props) {
  return (
    <section className="section section--accent examples">
      <div className="container">
        {title ? (
          <h2
            className="title-text title-text--reverse"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        ) : null}

        <div className="examples__list">
          <div className="examples__item example example--info">
            <div className="example__info">
              {text ? (
                <div
                  className="example__text"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ) : null}

              {buttonText ? (
                <Link
                  className="btn btn--default example__portfolio"
                  href={buttonHref}
                >
                  {buttonText}
                </Link>
              ) : null}
            </div>

            {items.length > 1 ? (
              <div className="examples__pagination">
                <button
                  className="swiper-button-prev examples__prev"
                  type="button"
                  aria-label="Previous example"
                >
                  <svg aria-hidden="true" focusable="false">
                    <use href={ARROW_ICON} xlinkHref={ARROW_ICON} />
                  </svg>
                </button>
                <button
                  className="swiper-button-next examples__next"
                  type="button"
                  aria-label="Next example"
                >
                  <svg aria-hidden="true" focusable="false">
                    <use href={ARROW_ICON} xlinkHref={ARROW_ICON} />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>

          {items.length ? (
            <Swiper
              className="swiper-examples"
              modules={[Navigation, A11y]}
              navigation={{
                prevEl: ".examples__prev",
                nextEl: ".examples__next",
              }}
              centeredSlides
              loop={items.length > 3}
              observer
              observeParents
              slidesPerView={1}
              spaceBetween={16}
              speed={1500}
              touchRatio={1}
              watchOverflow
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  centeredSlides: true,
                },
                800: {
                  slidesPerView: 2,
                  centeredSlides: false,
                },
                1200: {
                  slidesPerView: 3,
                  centeredSlides: true,
                },
              }}
            >
              {items.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="examples__item example">
                    <Link className="example__link" href={item.href || "/"}>
                      <span className="example__image">
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
                          className="example__name"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        />
                      ) : null}
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>
      </div>
    </section>
  );
}
