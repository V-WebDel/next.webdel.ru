import Link from "next/link";
import ButtonUp from "../ButtonUp/ButtonUp";

type FooterMessenger = {
  type?: string;
  telegram?: string;
  vk?: string;
  whatsapp?: string;
};

type Props = {
  logotype?: {
    name?: string;
    text?: string;
  };
  copyright?: string;
  messengers?: FooterMessenger[];
};

const labels: Record<string, string> = {
  telegram: "Ссылка на мой Телеграм",
  vk: "Ссылка на страницу ВКонтакте",
  whatsapp: "Ссылка на мой WhatsApp",
};

function getSocialLinks(messengers: FooterMessenger[] = []) {
  return messengers
    .map((item) => {
      const type = item.type?.toLowerCase() || "";
      const url = item[type as keyof FooterMessenger];

      if (!type || !url) return null;

      return {
        type,
        url,
        icon: type,
        label: labels[type] || "Ссылка на профиль",
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export default function Footer({ logotype, copyright, messengers }: Props) {
  const year = new Date().getFullYear();
  const socialLinks = getSocialLinks(messengers);
  const logoName = logotype?.name || "WebDel";
  const logoText = logotype?.text || "Создание сайтов";

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__wrap">
            <div className="footer__area footer__area_logo">
              <div className="logo footer__logo">
                <Link href="/" className="logo__link">
                  <span className="logo__name">{logoName}</span>
                  <span className="logo__description">{logoText}</span>
                </Link>
              </div>
            </div>

            {socialLinks.length > 0 ? (
              <div className="footer__area footer__area_social social">
                <ul className="social__list">
                  {socialLinks.map(({ type, url, icon, label }) => (
                    <li className="social__item" key={type}>
                      <a
                        href={url}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg aria-hidden="true">
                          <use href={`/sprite.svg#${icon}`} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="footer__area footer__area_copyright">
              <span className="footer__copyright">
                &copy; {year} {copyright || logoName}
              </span>
            </div>

            <div className="footer__area footer__area_links">
              <Link className="footer__link" href="/politica">
              Политика конфиденциальности
              </Link>
              <Link className="footer__link" href="/personal">
              Согласие на обработку персональных данных
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ButtonUp />
    </>
  );
}
