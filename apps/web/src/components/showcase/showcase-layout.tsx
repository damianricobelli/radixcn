import type { ComponentType, ReactNode } from "react";

type ShowcaseCanvasProps = {
  children: ReactNode;
};

export function ShowcaseCanvas({ children }: ShowcaseCanvasProps) {
  return (
    <div className="h-full overflow-auto rounded-lg border border-border bg-background shadow-xs">
      <div className="grid auto-cols-[minmax(304px,376px)] grid-flow-col gap-3 p-3 md:auto-cols-[minmax(328px,388px)]">
        {children}
      </div>
    </div>
  );
}

export function ShowcaseColumn({
  title,
  description,
  items,
}: ShowcaseColumnProps) {
  return (
    <section className="space-y-3">
      <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {title}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="rounded-md border bg-background px-2 py-1 text-xs font-medium tabular-nums">
            {items.length}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((Item) => (
          <Item key={Item.displayName ?? Item.name} />
        ))}
      </div>
    </section>
  );
}

type ShowcaseColumnProps = {
  title: string;
  description: string;
  items: Array<ComponentType>;
};
