import LogoutButton from "./logout-button";
import getCurrentUser from "@/app/api/(graphql)/user/resolvers/get-current-user";
import { EditableField, EditableName } from "./editable-fields";
import {Injector, QueryResponseType} from "naystack/graphql";

export default async function ProfilePage() {
  return <Injector fetch={getCurrentUser.authCall} Component={ProfilePageClient}/>
}

function ProfilePageClient({data: user ,loading}:{data?:QueryResponseType<typeof getCurrentUser>, loading:boolean}){
  return (
    <div>
      {/* Membership Card Header */}
      <div className="mb-8 border-2 border-[var(--foreground)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-[3px] w-8 bg-[var(--accent)]" />
          <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
            SOGA Member
          </span>
        </div>
        <EditableName loading={loading} disabled={loading} name={user?.name || ""} />
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <EditableField loading={loading} disabled={loading} label="Email" value={user?.email || "—"} fieldKey="email" readonly />
        <EditableField loading={loading} disabled={loading} label="Phone" value={user?.phone || "—"} fieldKey="phone" />
      </div>

      {/* Logout */}
      <div className="mt-10 border-t-2 border-[var(--border)] pt-8">
        <LogoutButton />
        <p className="mt-3 font-[family-name:var(--font-body)] text-xs text-[var(--muted)]">
          You can leave Soga, but the Shipra Sun City sunset views never leave you.
        </p>
      </div>
    </div>
  );
}
