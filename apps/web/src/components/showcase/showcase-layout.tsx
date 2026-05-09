import type { ComponentType, ReactNode } from "react"

type ShowcaseCanvasProps = {
  children: ReactNode
}

export function ShowcaseCanvas({ children }: ShowcaseCanvasProps) {
  return (
    <div className="h-full overflow-auto rounded-lg border border-border bg-background p-3 shadow-xs md:p-4">
      <div className="grid auto-cols-[minmax(300px,384px)] grid-flow-col gap-4 pr-3 pb-3 md:auto-cols-[minmax(320px,384px)] md:pr-4 md:pb-4">
        {children}
      </div>
    </div>
  )
}

export function ShowcaseColumn({
  title,
  description,
  items,
}: ShowcaseColumnProps) {
  return (
    <section className="space-y-3">
      <div className="border-b border-border/80 px-1 pb-2">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">
        {items.map((Item) => (
          <Item key={Item.displayName ?? Item.name} />
        ))}
      </div>
    </section>
  )
}

type ShowcaseColumnProps = {
  title: string
  description: string
  items: Array<ComponentType>
}
