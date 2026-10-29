
export interface FloatingChatButtonProps {
  onClick: () => void;
  open: boolean;
}

export function FloatingChatButton({
  onClick,
  open,
}: FloatingChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        open ? "Chiudi assistente" : "Apri assistente"
      }
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary/85 text-primary-foreground shadow-soft transition hover:scale-105 hover:bg-primary"
    >
      <img
        src="/ginecologa-logo.png"
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 rounded-xl object-contain"
      />
    </button>
  );
}
