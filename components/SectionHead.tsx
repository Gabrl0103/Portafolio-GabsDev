import TypeTitle from "./fx/TypeTitle";

export default function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="rv flex flex-col items-center gap-4 text-center">
      <span className="text-base font-semibold tracking-[-.01em] text-acc">{eyebrow}</span>
      <TypeTitle text={title} />
      {sub && <p className="m-0 max-w-[50ch] text-[17px] leading-[1.55] tracking-[-.011em] text-soft">{sub}</p>}
    </div>
  );
}
