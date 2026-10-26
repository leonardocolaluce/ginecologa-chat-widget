
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
} from "lucide-react";

import { ChatWidget } from "@/components/chat-widget/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Ginecologa.chat – Assistente laterale (demo)",
      },
      {
        name: "description",
        content:
          "Anteprima del widget assistente laterale per la dashboard Ginecologa.chat.",
      },
      {
        property: "og:title",
        content: "Ginecologa.chat – Assistente laterale",
      },
      {
        property: "og:description",
        content:
          "Widget chat laterale dedicato alle domande e agli approfondimenti di ginecologia.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Index,
});

const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function Index() {
  const cells = [
    ...Array(3).fill(null),
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-background px-8 py-5 lg:px-24">
        <div className="flex items-center gap-4">
          <img
            src="/ginecologa-logo.png"
            alt="Logo Ginecologa.chat"
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl object-contain"
          />

          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">
              Ginecologa.chat
            </h1>
            <p className="text-sm text-muted-foreground">
              Ciao, benvenuta!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm">Utente Anonima</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </header>

      <main className="px-8 py-6 lg:px-16">
        <div className="mb-6 flex justify-center">
          <button className="flex items-center gap-2 rounded-full border-2 border-brand-green px-8 py-3 font-semibold text-brand-green">
            <Settings className="h-5 w-5" />
            Aggiorna informazioni ciclo
          </button>
        </div>

        <section className="grid items-center gap-10 rounded-[2.5rem] bg-blush/70 p-10 lg:grid-cols-2">
          <p className="font-serif text-3xl font-bold leading-snug">
            Uno spazio personale e anonimo.
            <br />
            Pensato da una donna, per le donne.
          </p>

          <div className="rounded-2xl bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <ChevronLeft className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">
                Ottobre 2026
              </span>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
              {DAYS.map((d) => (
                <span key={d} className="text-muted-foreground">
                  {d}
                </span>
              ))}

              {cells.map((d, i) => (
                <span
                  key={i}
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
                    d === 20 ? "border-2 border-warn-icon" : ""
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ChatWidget />
    </div>
  );
}
