import Image from "next/image";

import "./Resume.scss";

type ResumeInfo = {
  subtitle?: string;
  show?: boolean;
  text?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type ResumeSection = {
  subtitle?: string;
  show?: boolean;
  text?: string;
};

type Props = {
  title?: string;
  information?: ResumeInfo;
  sections?: ResumeSection[];
};

function HtmlContent({ html }: { html?: string }) {
  if (!html) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Resume({ title, information, sections = [] }: Props) {
  const visibleSections = sections.filter(
    (section) => section.show !== false && (section.subtitle || section.text)
  );
  const showInformation =
    information?.show !== false &&
    (information?.subtitle || information?.text || information?.imageUrl);

  return (
    <section className="section resume">
      <div className="container container-mobile">
        <h1 className="title-text">{title}</h1>

        {showInformation ? (
          <>
            {information?.subtitle ? (
              <h2 className="resume__subtitle">{information.subtitle}</h2>
            ) : null}

            <div className="resume__block">
              {information?.imageUrl ? (
                <div className="resume__foto">
                  <Image
                    src={information.imageUrl}
                    alt={information.imageAlt || title || ""}
                    title="WordPress-разработчик"
                    width={360}
                    height={480}
                    loading="lazy"
                    unoptimized
                  />
                </div>
              ) : null}

              {information?.text ? (
                <div className="resume__info">
                  <HtmlContent html={information.text} />
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {visibleSections.map((section, index) => {
          const Heading = index === 0 ? "h2" : "h3";

          return (
            <div className="resume__section" key={`${section.subtitle}-${index}`}>
              {section.subtitle ? (
                <Heading className="resume__subtitle">
                  {section.subtitle}
                </Heading>
              ) : null}

              {section.text ? (
                <div className="resume__content">
                  <HtmlContent html={section.text} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
