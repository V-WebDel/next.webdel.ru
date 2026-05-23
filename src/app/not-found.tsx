import Layout from "@/components/Layout/Layout";
import NotFound from "@/components/NotFound/NotFound";
import Elements from "@/components/Elements/Elements";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="inner inner--top inner--full">
        <NotFound />
        <Elements />
      </div>
    </Layout>
  );
}
