"use client";
import { useState } from "react";
import { ScreeningSubmission, SubmissionStatus, ClientStatus } from "@/types/database";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export function SubmissionCard({
  submission,
}: {
  submission: ScreeningSubmission & { clients?: { name: string; phone: string | null; city: string | null; source: string | null } | null };
}) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [expanded, setExpanded] = useState(false);

  const updateStatus = async (newStatus: SubmissionStatus) => {
    const { supabase } = await import("@/lib/supabase");
    const db = supabase as any;

    await db.from("screening_submissions").update({ status: newStatus }).eq("id", submission.id);

    if (submission.client_id) {
      const clientStatus: ClientStatus =
        newStatus === "approved"
          ? "vetted"
          : newStatus === "rejected"
          ? "blocked"
          : "lead";
      await db.from("clients").update({ status: clientStatus }).eq("id", submission.client_id);
    }
    setStatus(newStatus);
    toast.success(`Submission ${newStatus}`);
  };

  const client = submission.clients;
  const statusMap: Record<SubmissionStatus, ClientStatus> = {
    pending: "lead",
    approved: "vetted",
    rejected: "blocked",
  };

  return (
    <div
      className="rounded-xl p-5 border transition-colors"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "#1e1e1e" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-foreground">
              {client?.name ?? "Unknown"}
            </p>
            <StatusBadge status={statusMap[status]} />
          </div>
          <p className="text-sm text-muted-foreground">
            {client?.phone ?? "—"} · {client?.city ?? "—"} · {client?.source ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(submission.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatus("approved")}
                className="h-8 text-xs"
                style={{
                  backgroundColor: "rgba(6,78,59,0.4)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.3)",
                }}
              >
                Approve
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus("rejected")}
                className="h-8 text-xs"
                style={{
                  backgroundColor: "rgba(127,29,29,0.4)",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.3)",
                }}
              >
                Reject
              </Button>
            </>
          )}
          {status !== "pending" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateStatus("pending")}
              className="text-muted-foreground h-8 text-xs"
            >
              Reset
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-gold h-8 text-xs"
          >
            {expanded ? "Hide" : "View"} Answers
          </Button>
        </div>
      </div>
      {expanded && (
        <div
          className="mt-4 pt-4 space-y-2"
          style={{ borderTop: "1px solid #1e1e1e" }}
        >
          {Object.entries(submission.answers).map(([q, a]) => (
            <div key={q}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {q}
              </p>
              <p className="text-sm text-foreground mt-0.5">{a || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
