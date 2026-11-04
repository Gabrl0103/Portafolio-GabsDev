import TypeTitle from "./fx/TypeTitle";

export default function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="sec-h rv">
      <span className="eyebrow">{eyebrow}</span>
      <TypeTitle text={title} />
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}
