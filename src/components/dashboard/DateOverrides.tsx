"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AvailabilityOverride } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

export function DateOverrides({
  initial,
}: {
  initial: AvailabilityOverride[];
}) {
  const [overrides, setOverrides] =
    useState<AvailabilityOverride[]>(initial);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [available, setAvailable] = useState(false);

  const add = async () => {
    if (!date) return;
    // Cast to any to bypass typed client RLS inference (Insert resolves to never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data, error } = await db
      .from("availability_overrides")
      .upsert(
        { date, is_available: available, note: note || null },
        { onConflict: "date" }
      )
      .select()
      .single();

    if (!error && data) {
      setOverrides((o) => [
        ...o.filter((x) => x.date !== date),
        data as AvailabilityOverride,
      ]);
      setDate("");
      setNote("");
      toast.success("Override saved");
    }
  };

  const remove = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("availability_overrides")
      .delete()
      .eq("id", id);
    setOverrides((o) => o.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Note (optional)
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Traveling"
            className="w-44"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAvailable(!available)}
            className="w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold"
            style={{
              borderColor: available ? "#C9A84C" : "#333",
              backgroundColor: available ? "#C9A84C" : "transparent",
              color: available ? "#000" : "transparent",
            }}
          >
            ✓
          </button>
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <Button
          onClick={add}
          style={{ backgroundColor: "#C9A84C", color: "#000" }}
        >
          Add Override
        </Button>
      </div>

      <div className="space-y-2">
        {overrides
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                borderColor: o.is_available
                  ? "rgba(52,211,153,0.3)"
                  : "rgba(239,68,68,0.3)",
                backgroundColor: o.is_available
                  ? "rgba(6,78,59,0.1)"
                  : "rgba(127,29,29,0.1)",
              }}
            >
              <div>
                <span className="text-sm text-foreground">
                  {format(
                    new Date(o.date + "T12:00:00"),
                    "EEEE, MMM d yyyy"
                  )}
                </span>
                {o.note && (
                  <span className="text-xs text-muted-foreground ml-2">
                    — {o.note}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: o.is_available ? "#34d399" : "#f87171",
                  }}
                >
                  {o.is_available ? "Available" : "Blocked"}
                </span>
                <button
                  onClick={() => remove(o.id)}
                  className="text-muted-foreground hover:text-red-400 text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
