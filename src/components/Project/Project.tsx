import "./Project.scss";

type ProjectImage = {
  src?: string;
  webp?: string;
  alt?: string;
};

type Props = {
  title?: string;
  description?: string;
  work?: string;
  link?: string;
  linkText?: string;
  linkDescription?: string;
  variant?: boolean;
  desktopImage?: ProjectImage;
  mobileImage?: ProjectImage;
};

function ProjectPicture({
  image,
  className,
  link,
}: {
  image?: ProjectImage;
  className?: string;
  link?: string;
}) {
  if (!image?.src) return null;

  const picture = (
    <picture>
      {image.webp ? <source srcSet={image.webp} type="image/webp" /> : null}
      <img
        src={image.src}
        alt={image.alt || "Скрин сайта"}
        title={link ? "Перейти на проект" : undefined}
        loading="lazy"
      />
    </picture>
  );

  if (!link) {
    return <div className={className}>{picture}</div>;
  }

  return (
    <a className={className} href={link} target="_blank" rel="noreferrer">
      {picture}
    </a>
  );
}

export default function Project({
  title,
  description,
  work,
  link,
  linkText,
  linkDescription,
  variant,
  desktopImage,
  mobileImage,
}: Props) {
  const hasLink = Boolean(link && linkText);
  const hasLinkSection = Boolean(linkDescription || hasLink);
  const projectTitle = title ? `Проект «${title}»` : "Проект";

  return (
    <section className="section project">
      <div className="container container-mobile">
        <h1 className="title-text project__title-text">{projectTitle}</h1>

        <div className="project__wrap">
          <div className="project__block project__block--left">
            {description ? (
              <>
                <h2 className="project__subtitle">Описание проекта:</h2>
                <div
                  className="project__text"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </>
            ) : null}

            {work ? (
              <>
                <h3 className="project__subtitle">Выполненная работа:</h3>
                <div
                  className="project__text"
                  dangerouslySetInnerHTML={{ __html: work }}
                />
              </>
            ) : null}

            {hasLinkSection ? (
              <>
                <p className="project__subtitle">Ссылка на проект:</p>
                <div className="project__text">
                  {linkDescription ? (
                    <p
                      className="project__onlink"
                      dangerouslySetInnerHTML={{ __html: linkDescription }}
                    />
                  ) : (
                    <a
                      href={link}
                      title="Перейти на проект"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {linkText}
                    </a>
                  )}
                </div>
              </>
            ) : null}
          </div>

          <div className="project__block project__block--image">
              <ProjectPicture
                image={desktopImage || mobileImage}
                className="project__image"
                link={link}
              />
            </div>
        </div>
      </div>
    </section>
  );
}
