
import {
  AlertCircle,
  ExternalLink,
  Send,
  X,
} from "lucide-react";

export interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenFullChat?: () => void;
}

export function ChatDrawer({
  open,
  onClose,
  onOpenFullChat,
}: ChatDrawerProps) {
  return (
    <aside
      aria-hidden={!open}
      aria-label="Assistente Ginecologa.chat"
      className={`fixed right-2 top-2 bottom-2 z-50 flex w-[min(370px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-transform duration-300 ${
        open
          ? "translate-x-0"
          : "translate-x-[110%] pointer-events-none"
      }`}
    >
      <header className="flex items-start gap-3 border-b border-border px-5 py-4">
        <img
          src="/ginecologa-logo.png"
          alt="Ginecologa.chat"
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-xl object-contain"
        />

        <div className="flex-1">
          <h2 className="font-serif text-2xl font-bold text-primary">
            Assistente
          </h2>

          <p className="text-sm text-muted-foreground">
            Fai le tue domande sulla ginecologia
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi assistente"
          className="rounded-md p-1 text-primary hover:bg-blush-soft"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div
        className="flex-1 overflow-y-auto px-4 py-5"
        aria-live="polite"
      />

      <div className="space-y-3 px-4 pb-4">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-2"
        >
          <label
            htmlFor="widget-message"
            className="sr-only"
          >
            Scrivi il tuo messaggio
          </label>

          <input
            id="widget-message"
            type="text"
            disabled
            placeholder="Scrivi il tuo messaggio..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled
            aria-label="Invia messaggio"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <button
          type="button"
          onClick={onOpenFullChat}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/60 text-sm font-medium text-primary hover:bg-blush-soft"
        >
          <ExternalLink className="h-4 w-4" />
          Apri la chat completa
        </button>

        <div className="flex gap-3 rounded-xl bg-warn-bg p-3 text-xs leading-relaxed text-warn-fg">
          <AlertCircle className="h-5 w-5 shrink-0 text-warn-icon" />

          <p>
            Le informazioni fornite sono solo suggerimenti informativi
            e non sostituiscono il parere del medico. In caso di
            dubbi, consulta sempre un professionista sanitario.
          </p>
        </div>
      </div>
    </aside>
  );
}
