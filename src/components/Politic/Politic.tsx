import "./Politic.scss";

type Props = {
  title?: string;
  content?: string;
};

export default function Politic({ title, content }: Props) {
  return (
    <section className="section politic">
      <div className="container">
        {title ? (
          <h1
            className="title-text"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        ) : null}
        {content ? (
          <div
            className="politic__wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : null}
      </div>
    </section>
  );
}
