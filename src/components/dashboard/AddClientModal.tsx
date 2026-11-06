"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddClientModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    source: "",
    revenue: "0",
    notes: "",
    status: "lead",
  });

  const save = async () => {
    if (!form.name) return;
    const { supabase } = await import("@/lib/supabase");
    const db = supabase as any;
    const { error } = await db.from("clients").insert({
      name: form.name,
      phone: form.phone || null,
      city: form.city || null,
      source: form.source || null,
      revenue: parseFloat(form.revenue) || 0,
      notes: form.notes || null,
      status: form.status,
      last_contact: new Date().toISOString().split("T")[0],
      repeat: false,
    });
    if (!error) {
      toast.success("Client added");
      setOpen(false);
      setForm({ name: "", phone: "", city: "", source: "", revenue: "0", notes: "", status: "lead" });
      router.refresh();
    } else {
      toast.error("Failed to add client");
    }
  };

  const inputStyle = { backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: "#C9A84C", color: "#000" }}>
          + Add Client
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{ backgroundColor: "#111", borderColor: "#2a2a2a" }}
        className="text-foreground max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            New Client
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {(
            [
              ["Name *", "name", "text"],
              ["Phone", "phone", "tel"],
              ["City", "city", "text"],
              ["Source", "source", "text"],
            ] as const
          ).map(([label, key, type]) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground mb-1 block">
                {label}
              </label>
              <Input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Revenue ($)
            </label>
            <Input
              type="number"
              value={form.revenue}
              onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Status
            </label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger style={inputStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: "#111", borderColor: "#2a2a2a" }}>
                {["lead", "active", "vetted", "blocked"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Notes
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle}
              rows={3}
            />
          </div>
          <Button
            onClick={save}
            className="w-full mt-2"
            style={{ backgroundColor: "#C9A84C", color: "#000" }}
          >
            Save Client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
