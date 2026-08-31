import { getDbShape } from "@/lib/db/repo";
import { MessagesInbox } from "@/components/admin/MessagesInbox";

export default async function AdminMessagesPage() {
  const db = await getDbShape();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Messages ({db.messages.length})</h2>
        <p className="mt-1 text-sm text-muted">Contact form submissions sent from the site.</p>
      </div>
      <MessagesInbox messages={[...db.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))} />
    </div>
  );
}
