interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Server component that drops a JSON-LD script into a page for SEO. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
