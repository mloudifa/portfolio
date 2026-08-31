import { getDbShape } from "@/lib/db/repo";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AdminAccountPage() {
  const db = await getDbShape();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted">Your admin profile and security settings.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Admin user</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-foreground"><span className="text-subtle">Name:</span> {db.admin.name}</p>
          <p className="text-sm text-foreground"><span className="text-subtle">Email:</span> {db.admin.email}</p>
          <p className="text-sm text-foreground"><span className="text-subtle">Role:</span> {db.admin.role}</p>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
