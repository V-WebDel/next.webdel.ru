import "./Contacts.scss";

export type ContactItem = {
  type?: string;
  numberLink?: string;
  numberPhone?: string;
  email?: string;
  telegram?: string;
};

type Props = {
  title?: string;
  subtitleContacts?: string;
  uptitleContacts?: string;
  subtitleForm?: string;
  items?: ContactItem[];
};

const CONTACT_ICONS: Record<string, string> = {
  phone: "smartphone",
  email: "email",
  telegram: "telegramm",
};

function getTelegramHref(value?: string) {
  if (!value) return undefined;

  const username = value.replace(/^@/, "");

  return `https://t.me/${username}`;
}

function getContactLink(item: ContactItem) {
  switch (item.type) {
    case "phone":
      return {
        href: item.numberLink ? `tel:${item.numberLink}` : undefined,
        label: item.numberPhone,
      };
    case "email":
      return {
        href: item.email ? `mailto:${item.email}` : undefined,
        label: item.email,
      };
    case "telegram":
      return {
        href: getTelegramHref(item.telegram),
        label: item.telegram,
      };
    default:
      return {
        href: undefined,
        label: undefined,
      };
  }
}

export default function Contacts({
  title = "Контакты",
  subtitleContacts,
  uptitleContacts,
  items = [],
}: Props) {
  const contactItems = items
    .map((item) => ({
      ...item,
      icon: CONTACT_ICONS[item.type || ""] || "contact",
      link: getContactLink(item),
    }))
    .filter((item) => item.link.href && item.link.label);

  return (
    <section className="section contacts">
      <div className="container">
        <h1 className="visually-hidden">{title}</h1>
        {uptitleContacts ? (
          <p className="title-text">{uptitleContacts}</p>
        ) : null}
        <div className="contacts__wrap">
          <address className="contacts__block contacts__block--list">
            {subtitleContacts ? (
              <h2 className="contacts__title">{subtitleContacts}</h2>
            ) : null}
            {contactItems.length ? (
              <ul className="contacts__list">
                {contactItems.map((item, index) => {
                  const iconHref = `/sprite.svg#${item.icon}`;

                  return (
                    <li
                      className={`contacts__item${
                        item.type === "phone" ? " contacts__item--phone" : ""
                      }`}
                      key={`${item.type}-${item.link.href}-${index}`}
                    >
                      <span>
                        <svg className="contacts__svg" aria-hidden="true">
                          <use href={iconHref} xlinkHref={iconHref} />
                        </svg>
                      </span>
                      <a className="contacts__link" href={item.link.href}>
                        {item.link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </address>
        </div>
      </div>
    </section>
  );
}
