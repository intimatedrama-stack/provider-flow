import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Client, Post } from "@/types/database";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

export const dynamic = "force-dynamic";

const WAVES = [
  { label: "Wave 1 (8-10 AM)", ads: ["Ad 1", "Ad 5"] },
  { label: "Wave 2 (1-3 PM)", ads: ["Ad 2"] },
  { label: "Wave 3 (5-8 PM)", ads: ["Ad 3", "Ad 4"] },
  { label: "Wave 4 (10 PM-12 AM)", ads: ["Ad 1", "Ad 5"] },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: clientsRaw }, { data: postsRaw }] = await Promise.all([
    supabase.from("clients").select("*"),
    supabase.from("posts").select("*"),
  ]);
  const clients = clientsRaw as Client[] | null;
  const posts = postsRaw as Post[] | null;

  const totalRevenue = clients?.reduce((s, c) => s + (c.revenue ?? 0), 0) ?? 0;
  const totalClients = clients?.length ?? 0;
  const totalPosts = posts?.length ?? 0;

  const revenueByDay = Array.from({ length: 14 }, (_, i) => {
    const d = format(subDays(new Date(), 13 - i), "MMM d");
    const dayRevenue =
      clients
        ?.filter((c) => format(new Date(c.created_at), "MMM d") === d)
        .reduce((s, c) => s + (c.revenue ?? 0), 0) ?? 0;
    return { date: d, revenue: dayRevenue };
  });

  const adMessages = (posts ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.ad] = (acc[p.ad] ?? 0) + p.messages;
    return acc;
  }, {});
  const bestAd = Object.entries(adMessages).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  return (
    <div>
      <PageHeader title="Overview" subtitle="Your business at a glance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <KPICard label="Total Clients" value={totalClients} icon={Users} />
        <KPICard label="Posts Logged" value={totalPosts} icon={FileText} />
        <KPICard label="Best Ad" value={bestAd} icon={TrendingUp} sub="by messages" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "#1e1e1e" }}>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg text-foreground">Revenue - Last 14 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueByDay} />
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "var(--color-surface)", borderColor: "#1e1e1e" }}>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg text-foreground">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {WAVES.map((wave) => (
              <div key={wave.label} className="pl-3" style={{ borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
                <p className="text-xs text-gold uppercase tracking-wider mb-1">{wave.label}</p>
                {wave.ads.map((ad) => (
                  <p key={ad} className="text-sm text-muted-foreground">• {ad}</p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
