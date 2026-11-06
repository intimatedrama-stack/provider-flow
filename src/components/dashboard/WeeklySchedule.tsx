"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AvailabilitySchedule } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklySchedule({
  initial,
}: {
  initial: AvailabilitySchedule[];
}) {
  const [rows, setRows] = useState<AvailabilitySchedule[]>(
    DAYS.map(
      (_, i) =>
        initial.find((r) => r.day_of_week === i) ?? {
          id: "",
          day_of_week: i,
          start_time: "10:00",
          end_time: "22:00",
          is_available: false,
        }
    )
  );

  const toggle = (i: number) =>
    setRows((r) =>
      r.map((row, idx) =>
        idx === i ? { ...row, is_available: !row.is_available } : row
      )
    );

  const setTime = (
    i: number,
    field: "start_time" | "end_time",
    val: string
  ) =>
    setRows((r) =>
      r.map((row, idx) =>
        idx === i ? { ...row, [field]: val } : row
      )
    );

  const save = async () => {
    // Delete all existing, re-insert (cast to any to bypass typed client RLS inference)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    await db
      .from("availability_schedule")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    const inserts = rows
      .filter((r) => r.is_available)
      .map(({ day_of_week, start_time, end_time, is_available }) => ({
        day_of_week,
        start_time,
        end_time,
        is_available,
      }));

    if (inserts.length) {
      await db.from("availability_schedule").insert(inserts);
    }
    toast.success("Schedule saved");
  };

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-lg border transition-colors"
          style={{
            borderColor: row.is_available
              ? "rgba(201,168,76,0.3)"
              : "#1e1e1e",
            backgroundColor: row.is_available
              ? "rgba(201,168,76,0.05)"
              : "var(--color-surface)",
          }}
        >
          <button
            onClick={() => toggle(i)}
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors text-xs font-bold"
            style={{
              borderColor: row.is_available ? "#C9A84C" : "#333",
              backgroundColor: row.is_available ? "#C9A84C" : "transparent",
              color: row.is_available ? "#000" : "transparent",
            }}
          >
            ✓
          </button>
          <span className="text-sm w-10 text-muted-foreground">
            {DAYS[i]}
          </span>
          <Input
            type="time"
            value={row.start_time}
            onChange={(e) => setTime(i, "start_time", e.target.value)}
            className="w-32 text-sm"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
            disabled={!row.is_available}
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="time"
            value={row.end_time}
            onChange={(e) => setTime(i, "end_time", e.target.value)}
            className="w-32 text-sm"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
            disabled={!row.is_available}
          />
        </div>
      ))}
      <Button
        onClick={save}
        className="mt-4"
        style={{ backgroundColor: "#C9A84C", color: "#000" }}
      >
        Save Schedule
      </Button>
    </div>
  );
}
