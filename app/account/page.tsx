import LogoutButton from "./logout-button";
import getCurrentUser from "@/app/api/(graphql)/user/resolvers/get-current-user";
import { EditableField, EditableName } from "./editable-fields";

export default async function ProfilePage() {
  const user = await getCurrentUser.authCall();

  return (
    <div>
      {/* Membership Card Header */}
      <div className="mb-8 border-2 border-[var(--foreground)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-[3px] w-8 bg-[var(--accent)]" />
          <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
            Revolutionary Member
          </span>
        </div>
        <EditableName name={user?.name || ""} />
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <EditableField label="Email" value={user?.email || "—"} fieldKey="email" readonly />
        <EditableField label="Phone" value={user?.phone || "—"} fieldKey="phone" />
      </div>

      {/* Logout */}
      <div className="mt-10 border-t-2 border-[var(--border)] pt-8">
        <LogoutButton />
        <p className="mt-3 font-[family-name:var(--font-body)] text-xs text-[var(--muted)]">
          You can always come back. The movement never forgets.
        </p>
      </div>
    </div>
  );
}
