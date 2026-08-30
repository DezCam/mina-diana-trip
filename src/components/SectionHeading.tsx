type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, description, id }: SectionHeadingProps) {
  return (
    <div id={id} className="scroll-mt-20">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-tulip">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-highland sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-ink/75">{description}</p> : null}
    </div>
  );
}
