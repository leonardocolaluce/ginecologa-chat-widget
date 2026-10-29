
import { createFileRoute } from "@tanstack/react-router";

import { ChatWidget } from "@/components/chat-widget/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Ginecologa.chat | Assistente",
      },
      {
        name: "description",
        content:
          "Assistente Ginecologa.chat per domande e approfondimenti sulla ginecologia.",
      },
      {
        property: "og:title",
        content: "Ginecologa.chat | Assistente",
      },
      {
        property: "og:description",
        content:
          "Assistente per domande e approfondimenti sulla ginecologia.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <ChatWidget />
    </div>
  );
}
