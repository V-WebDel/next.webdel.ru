import type { Metadata } from "next";
import Experience from "@/components/Experience/Experience";
import Resume from "@/components/Resume/Resume";

import { wpFetch } from "@/lib/wp/api";
import type { WPImageMedia, WPPage, WPResumeAcf } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

const RESUME_PAGE_ID = 11;

export const revalidate = 60;

async function getResumePage() {
  return wpFetch<WPPage<WPResumeAcf>>(`/wp-json/wp/v2/pages/${RESUME_PAGE_ID}`);
}

async function getMedia(id?: number) {
  if (!id) return undefined;

  return wpFetch<WPImageMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getResumePage();
  const yoast = extractYoastMeta(page.yoast_head_json);

  return {
    title: yoast.title ?? page.title.rendered,
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

export default async function ResumePage() {
  const page = await getResumePage();
  const resume = page.acf?.resume;
  const experience = page.acf?.experience;
  const information = resume?.information;
  const foto = await getMedia(information?.foto);

  return (
    <main>
      <Resume
        title={page.title.rendered}
        information={{
          subtitle: information?.subtitle,
          show: information?.show,
          text: information?.text,
          imageUrl: foto?.source_url || "/images/resume/1.jpg",
          imageAlt: foto?.alt_text || "Моё фото",
        }}
        sections={[
          resume?.skills,
          resume?.tools,
        ].filter((section): section is NonNullable<typeof section> => Boolean(section))}
      />

      {experience?.show !== false ? (
        <Experience title={experience?.title} items={experience?.items} />
      ) : null}
    </main>
  );
}
