import { requireSession } from "@/lib/auth/session";
import { SettingsView } from "./settings-view";

export const dynamic = "force-dynamic";

export default async function CoachSettingsPage() {
  const { user } = await requireSession();
  return <SettingsView name={user.name ?? ""} username={user.username ?? ""} email={user.email ?? ""} />;
}
