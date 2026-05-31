import type { Metadata } from "next";
import Contacts from "@/components/Contacts/Contacts";

import { wpFetch } from "@/lib/wp/api";
import type { WPContactsAcf, WPPage } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

const CONTACTS_PAGE_ID = 13;

export const revalidate = 60;

async function getContactsPage() {
  return wpFetch<WPPage<WPContactsAcf>>(
    `/wp-json/wp/v2/pages/${CONTACTS_PAGE_ID}`
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactsPage();
  const yoast = extractYoastMeta(page.yoast_head_json);

  return {
    title: yoast.title ?? "Контактная информация - WebDel",
    description: yoast.description,
    alternates: yoast.canonical ? { canonical: yoast.canonical } : undefined,
    openGraph: yoast.og
      ? {
          title: yoast.og.title,
          description: yoast.og.description,
          images: yoast.og.image ? [yoast.og.image] : undefined,
        }
      : undefined,
  };
}

export default async function ContactsPage() {
  const page = await getContactsPage();
  const contacts = page.acf?.contacts;

  return (
    <main>
      {contacts?.show !== false ? (
        <Contacts
          title={contacts?.title}
          uptitleContacts={contacts?.["title"]}
          subtitleContacts={contacts?.["subtitle-contacts"]}
          subtitleForm={contacts?.["subtitle-form"]}
          items={contacts?.items?.map((item) => ({
            type: item.type,
            numberLink: item["number-link"],
            numberPhone: item["number-phone"],
            email: item.email,
            telegram: item.telegram,
          }))}
        />
      ) : null}
    </main>
  );
}
