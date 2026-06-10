type SectionIntroProps = {
  eyebrow: string;
  title: string;
  children: string;
};

export const SectionIntro = ({ eyebrow, title, children }: SectionIntroProps) => {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-normal text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{children}</p>
    </div>
  );
};
