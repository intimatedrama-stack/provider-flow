import { supabase } from "@/lib/supabase";
import { AvailabilityView } from "@/components/public/AvailabilityView";
import { ScreeningForm } from "@/components/public/ScreeningForm";
import { ScreeningQuestion } from "@/types/database";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function PublicPage() {
  const { data } = await (supabase as any)
    .from("screening_questions")
    .select("*")
    .order("display_order");

  const questions = (data ?? []) as ScreeningQuestion[];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid #1e1e1e" }}
      >
        <p className="text-gold font-display text-lg tracking-widest text-center">
          ◆ PROVIDER FLOW
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="font-display text-5xl text-foreground mb-4 leading-tight">
            Availability &<br />Booking
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Check my availability below and submit your information to
            get in touch.
          </p>
        </div>

        {/* Availability */}
        <section className="mb-14">
          <h2 className="font-display text-2xl text-foreground mb-6">
            My Availability
          </h2>
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid #1e1e1e",
            }}
          >
            <Suspense
              fallback={
                <p className="text-muted-foreground text-sm text-center py-8">
                  Loading schedule…
                </p>
              }
            >
              <AvailabilityView />
            </Suspense>
            <div
              className="flex items-center gap-6 mt-4 pt-4"
              style={{ borderTop: "1px solid #1e1e1e" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                <span className="text-xs text-muted-foreground">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#333" }}
                />
                <span className="text-xs text-muted-foreground">
                  Unavailable
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Fill out the form below and I&apos;ll review your information
            shortly.
          </p>
          <div
            className="rounded-2xl p-8 max-w-lg"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid #1e1e1e",
            }}
          >
            <ScreeningForm questions={questions} />
          </div>
        </section>
      </div>
    </div>
  );
}
