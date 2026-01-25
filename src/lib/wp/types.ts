export type WPPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  acf?: Record<string, any>;
  yoast_head_json?: any;
};
