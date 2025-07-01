import { type TechnologiesUsedProps } from "#/applications";

export function TechnologiesUsed({ technologies }: TechnologiesUsedProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {technologies.map((technology) => (
        <div
          key={technology}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-all"
        >
          {technology}
        </div>
      ))}
    </div>
  );
}
