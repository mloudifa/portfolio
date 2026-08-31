import { getDbShape } from "@/lib/db/repo";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { EducationEditor } from "@/components/admin/EducationEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AdminProfilePage() {
  const db = await getDbShape();

  return (
    <div className="space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Site settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteSettingsForm site={db.site} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={db.profile} />
        </CardContent>
      </Card>

      <SkillsEditor skills={db.skills} />
      <ExperienceEditor experience={db.experience} />
      <EducationEditor education={db.education} />
      <BlogEditor posts={db.blog} />
    </div>
  );
}
