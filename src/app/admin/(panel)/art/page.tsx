import { getArtItems } from "@/lib/db/repo";
import { ArtManager } from "@/components/admin/ArtManager";

export default async function AdminArtPage() {
  const art = await getArtItems();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Art</h2>
        <p className="mt-1 text-sm text-muted">
          Manage artwork shown in the homepage gallery section.
        </p>
      </div>
      <ArtManager art={art} />
    </div>
  );
}
