import { ClientStatus } from "@/types/database";

const styles: Record<ClientStatus, string> = {
  lead: "bg-yellow-900/20 text-yellow-400 border-yellow-800/40",
  active: "bg-white/10 text-white border-white/20",
  vetted: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
  blocked: "bg-red-900/30 text-red-400 border-red-800",
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}
