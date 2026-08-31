interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a JSON-LD structured-data script (server component). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
