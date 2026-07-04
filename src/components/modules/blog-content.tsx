function renderParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose-portfolio space-y-5">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="font-display text-2xl font-semibold">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("- ")) {
          const items = block.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 text-muted-foreground">
              {items.map((item, i) => (
                <li key={i}>{renderParagraph(item.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-base leading-relaxed text-muted-foreground">
            {renderParagraph(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}
