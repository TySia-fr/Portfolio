export function TechList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="border border-line px-2 py-0.5 font-mono text-[0.6875rem] text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
