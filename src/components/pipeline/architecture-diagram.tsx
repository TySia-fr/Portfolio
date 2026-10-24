import { infrastructure } from "@/content/infrastructure";

/**
 * Request path from the browser to the container, as an ordered list. The two
 * last hops are grouped inside a dashed box: they run on the same server.
 */
export function ArchitectureDiagram() {
  const offHost = infrastructure.nodes.filter((node) => !("onHost" in node));
  const onHost = infrastructure.nodes.filter((node) => "onHost" in node);

  return (
    <figure className="m-0">
      <ol className="grid items-stretch gap-3 font-mono text-[0.8125rem] lg:grid-cols-[1fr_1fr_2.2fr]">
        {offHost.map((node) => (
          <Node key={node.id} name={node.name} facts={node.facts} arrow />
        ))}
        <li className="relative border border-dashed border-muted/50 p-3 pt-8">
          <span className="absolute top-2.5 left-3 text-[0.6875rem] tracking-[0.14em] text-muted uppercase">
            {infrastructure.host}
          </span>
          <ol className="grid gap-3 sm:grid-cols-2">
            {onHost.map((node, index) => (
              <Node
                key={node.id}
                name={node.name}
                facts={node.facts}
                arrow={index === 0}
              />
            ))}
          </ol>
        </li>
      </ol>
      <figcaption className="mt-4 font-mono text-xs text-muted">
        {infrastructure.caption}
      </figcaption>
    </figure>
  );
}

function Node({
  name,
  facts,
  arrow,
}: {
  name: string;
  facts: readonly string[];
  arrow: boolean;
}) {
  return (
    <li className="arch-node relative border border-line bg-surface p-4">
      <p className="font-medium text-text">{name}</p>
      <ul className="mt-2 grid gap-1 font-sans text-sm text-muted">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      {arrow ? (
        <span aria-hidden="true" className="arch-arrow">
          →
        </span>
      ) : null}
    </li>
  );
}
