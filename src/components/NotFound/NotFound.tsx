import "./NotFound.scss";

export default function NotFound() {
  return (
    <section className="section--full error">
      <div className="error__wrap">
        <h2 className="error__title">Ошибка 404</h2>
        <p className="error__text">Извините, такой страницы не существует</p>
      </div>
    </section>
  );
}
