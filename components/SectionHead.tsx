import RevealTitle from "./fx/RevealTitle";

export default function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="rv flex flex-col items-start gap-2 text-left">
      <span className="text-base font-semibold tracking-[-.01em] text-acc">{eyebrow}</span>
      <RevealTitle text={title} />
      {sub && <p className="m-0 max-w-[52ch] text-[17px] leading-[1.55] tracking-[-.011em] text-soft">{sub}</p>}
    </div>
  );
}
