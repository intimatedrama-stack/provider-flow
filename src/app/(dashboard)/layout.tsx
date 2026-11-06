import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen">{children}</main>
    </div>
  );
}
