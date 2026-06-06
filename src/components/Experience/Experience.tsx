import "./Experience.scss";

export type ExperienceProject = {
  link?: string;
  name?: string;
};

export type ExperienceItem = {
  company?: string;
  post?: string;
  start?: string;
  finish?: string;
  description?: string;
  projects?: ExperienceProject[] | null;
};

type Props = {
  title?: string;
  items?: ExperienceItem[];
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function formatDate(value?: string) {
  if (!value || value.length < 6) return undefined;

  const year = value.slice(0, 4);
  const monthIndex = Number(value.slice(4, 6)) - 1;
  const month = MONTHS[monthIndex];

  if (!month || !year) return undefined;

  return `${month} ${year}`;
}

function getProjectLabel(project: ExperienceProject) {
  if (project.name) return project.name;
  if (!project.link) return undefined;

  try {
    return new URL(project.link).hostname.replace(/^www\./, "");
  } catch {
    return project.link;
  }
}

function HtmlContent({ html }: { html?: string }) {
  if (!html) return null;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Experience({ title, items = [] }: Props) {
  const visibleItems = items.filter(
    (item) => item.company || item.post || item.description
  );

  if (!visibleItems.length) return null;

  return (
    <section className="section experience">
      <div className="container container-mobile">
        {title ? <h2 className="title-text">{title}</h2> : null}

        <div className="experience__wrap">
          {visibleItems.map((item, index) => {
            const start = formatDate(item.start);
            const finish = formatDate(item.finish);
            const projects = item.projects?.filter((project) => project.link) ?? [];

            return (
              <div
                className="experience__row"
                key={`${item.company}-${item.start}-${index}`}
              >
                <div className="experience__block experience__block--main">
                  {item.company ? (
                    <div className="experience__company">{item.company}</div>
                  ) : null}
                  {item.post ? (
                    <div className="experience__post">{item.post}</div>
                  ) : null}
                  {start || finish ? (
                    <div className="experience__time">
                      {start ? (
                        <span className="text-nowrap">{start} — </span>
                      ) : null}
                      {finish ? (
                        <span className="text-nowrap">{finish}</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="experience__block experience__block--duties">
                  {item.description ? (
                    <div className="experience__content">
                      <HtmlContent html={item.description} />
                    </div>
                  ) : null}

                  {projects.length ? (
                    <ul className="experience__links">
                      {projects.map((project, projectIndex) => {
                        const label = getProjectLabel(project);

                        if (!project.link || !label) return null;

                        return (
                          <li
                            className="experience__links-item"
                            key={`${project.link}-${projectIndex}`}
                          >
                            <a
                              href={project.link}
                              rel="nofollow noreferrer"
                              target="_blank"
                            >
                              {label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
