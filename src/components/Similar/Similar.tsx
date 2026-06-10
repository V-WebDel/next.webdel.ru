"use client";

import Link from "next/link";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "./Similar.scss";

const ARROW_ICON = "/sprite.svg#arrow";

export type SimilarItem = {
  id: number;
  title?: string;
  href?: string;
  imageJpg?: string;
  imageWebp?: string;
  imageAlt?: string;
};

type Props = {
  title?: string;
  items?: SimilarItem[];
};

export default function Similar({
  title = "Похожие проекты",
  items = [],
}: Props) {
  if (!items.length) return null;

  const hasControls = items.length > 1;

  return (
    <section className="section section--accent similar">
      <div className="container">
        <h2 className="title-text title-text--reverse">{title}</h2>

        <Swiper
          className="swiper-container swiper-similar"
          modules={[Autoplay, Navigation, Pagination, A11y]}
          autoplay={
            hasControls
              ? {
                  delay: 5000,
                }
              : false
          }
          navigation={
            hasControls
              ? {
                  nextEl: ".similar__next",
                  prevEl: ".similar__prev",
                }
              : false
          }
          pagination={
            hasControls
              ? {
                  el: ".similar__bullets",
                  clickable: true,
                }
              : false
          }
          loop={items.length > 3}
          observer
          observeParents
          slidesPerView={1}
          spaceBetween={10}
          speed={1000}
          touchRatio={1}
          watchOverflow
          breakpoints={{
            320: {
              slidesPerView: 1,
              centeredSlides: true,
            },
            576: {
              slidesPerView: 2,
              centeredSlides: false,
            },
            992: {
              slidesPerView: 3,
              centeredSlides: true,
            },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Link className="similar__item" href={item.href || "/"}>
                <span className="similar__inner">
                  <picture>
                    {item.imageWebp ? (
                      <source srcSet={item.imageWebp} type="image/webp" />
                    ) : null}
                    {item.imageJpg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="swiper-lazy"
                        src={item.imageJpg}
                        alt={item.imageAlt || item.title || ""}
                        loading="lazy"
                      />
                    ) : null}
                  </picture>
                </span>

                {item.title ? (
                  <span
                    className="similar__name"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                ) : null}
              </Link>
            </SwiperSlide>
          ))}

          {hasControls ? (
            <div className="similar__pagination">
              <button
                className="swiper-button-prev similar__prev"
                type="button"
                aria-label="Предыдущий проект"
              >
                <svg aria-hidden="true" focusable="false">
                  <use href={ARROW_ICON} xlinkHref={ARROW_ICON} />
                </svg>
              </button>
              <button
                className="swiper-button-next similar__next"
                type="button"
                aria-label="Следующий проект"
              >
                <svg aria-hidden="true" focusable="false">
                  <use href={ARROW_ICON} xlinkHref={ARROW_ICON} />
                </svg>
              </button>
              <div className="swiper-pagination similar__bullets" />
            </div>
          ) : null}
        </Swiper>
      </div>
    </section>
  );
}
