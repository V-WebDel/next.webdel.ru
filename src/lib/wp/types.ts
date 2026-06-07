export type WPYoastHead = {
  title?: string;
  description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Array<{ url?: string }>;
};

export type WPImageMedia = {
  id: number;
  source_url?: string;
  alt_text?: string;
};

export type WPHomeAcf = {
  top?: {
    title?: string;
    hello?: string;
    profession?: string;
    specialty?: {
      first?: string;
      second?: string;
      developer?: string;
    };
    text?: string;
  };
  advantages?: {
    title?: string;
    show?: boolean;
    items?: Array<{
      image?: number;
      name?: string;
      text?: string;
    }>;
  };
  infographic?: {
    title?: string;
    show?: boolean;
    items?: Array<{
      svg?: string;
      subtitle?: string;
      text?: string;
    }>;
  };
  examples?: {
    title?: string;
    show?: boolean;
    text?: string;
    btn?: string;
    link?: string;
  };
  logotype?: {
    name?: string;
    text?: string;
  };
  copyright_footer?: {
    text?: string;
  };
  messengers_footer?: {
    items?: Array<{
      type?: string;
      telegram?: string;
      vk?: string;
      whatsapp?: string;
    }>;
  };
};

export type WPContactsAcf = {
  contacts?: {
    title?: string;
    show?: boolean;
    "subtitle-contacts"?: string;
    "subtitle-form"?: string;
    items?: Array<{
      type?: "phone" | "email" | "telegram" | string;
      "number-link"?: string;
      "number-phone"?: string;
      email?: string;
      telegram?: string;
    }>;
  };
};

export type WPResumeAcf = {
  resume?: {
    information?: {
      subtitle?: string;
      show?: boolean;
      foto?: number;
      text?: string;
    };
    skills?: {
      subtitle?: string;
      show?: boolean;
      text?: string;
    };
    tools?: {
      subtitle?: string;
      show?: boolean;
      text?: string;
    };
  };
  experience?: {
    title?: string;
    show?: boolean;
    items?: Array<{
      company?: string;
      post?: string;
      start?: string;
      finish?: string;
      description?: string;
      projects?: Array<{
        link?: string;
        name?: string;
      }> | null;
    }>;
  };
};

export type WPPortfolio = {
  id: number;
  date?: string;
  slug: string;
  link: string;
  title: { rendered: string };
  featured_media?: number;
  url_sites?: number[];
  class_list?: string[];
  acf?: {
    in_top?: boolean;
    project?: {
      group?: {
        mobile?: number;
        desktop?: number;
      };
    };
  };
  yoast_head_json?: WPYoastHead;
};

export type WPTerm = {
  id: number;
  count?: number;
  name: string;
  slug: string;
  taxonomy?: string;
};

export type WPPage<TAcf = WPHomeAcf> = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  acf?: TAcf;
  yoast_head_json?: WPYoastHead;
};
