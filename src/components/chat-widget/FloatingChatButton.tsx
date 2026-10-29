import { MessageCircleMore } from "lucide-react";

export function FloatingChatButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Chiudi assistente" : "Apri assistente"}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary/85 text-primary-foreground shadow-soft transition hover:scale-105 hover:bg-primary"
    >
      <MessageCircleMore className="h-8 w-8" />
    </button>
  );
}
