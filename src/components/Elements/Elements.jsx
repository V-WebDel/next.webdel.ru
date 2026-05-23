import "./Elements.scss";

export default function Elements() {
  return (
    <>
      <span className="inner__circle inner__circle--1"></span>
      <span className="inner__circle inner__circle--2"></span>
      <div className="inner__group inner__group--1">
        <span className="inner__elem inner__elem--1"></span>
        <span className="inner__elem inner__elem--2"></span>
        <span className="inner__elem inner__elem--3"></span>
        <span className="inner__elem inner__elem--4"></span>
        <span className="inner__elem inner__elem--5"></span>
        <span className="inner__elem inner__elem--6"></span>
      </div>
      <div className="inner__group inner__group--2">
        <span className="inner__elem inner__elem--1"></span>
        <span className="inner__elem inner__elem--2"></span>
        <span className="inner__elem inner__elem--3"></span>
        <span className="inner__elem inner__elem--4"></span>
        <span className="inner__elem inner__elem--5"></span>
        <span className="inner__elem inner__elem--6"></span>
      </div>
      <div className="inner__elem-z inner__elem-z--1"></div>
      <div className="inner__elem-z inner__elem-z--2"></div>
      <div className="inner__elem-z inner__elem-z--3"></div>
      <div className="inner__elem-z inner__elem-z--4"></div>
      <div className="inner__elem-z inner__elem-z--5"></div>
      <div className="inner__elem-z inner__elem-z--6"></div>
    </>
  );
}