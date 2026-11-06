import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
}

export function KPICard({ label, value, icon: Icon, sub }: KPICardProps) {
  return (
    <Card style={{ backgroundColor: "var(--color-surface)", borderColor: "#1e1e1e" }}
      className="hover:border-gold transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {label}
          </p>
          <Icon size={16} className="text-gold opacity-60" />
        </div>
        <p className="font-display text-3xl text-foreground">{value}</p>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
