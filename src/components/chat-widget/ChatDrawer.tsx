import { useState, type FormEvent } from "react";
import { AlertCircle, ExternalLink, HeartPulse, Send, User, X } from "lucide-react";

type Msg = { id: number; role: "user" | "assistant"; text: string; time: string };

const DEMO: Msg[] = [
  { id: 1, role: "user", text: "È normale avere cicli irregolari?", time: "13:41" },
  {
    id: 2,
    role: "assistant",
    text: "Sì, i cicli irregolari possono essere normali, soprattutto in alcune fasi della vita come l'adolescenza, il post-parto o la perimenopausa. Tuttavia, se l'irregolarità persiste o è accompagnata da altri sintomi, è consigliabile parlarne con un professionista sanitario.",
    time: "13:42",
  },
];

function Avatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/80 text-primary-foreground">
      <HeartPulse className="h-5 w-5" />
    </div>
  );
}

export interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenFullChat?: () => void;
}

export function ChatDrawer({ open, onClose, onOpenFullChat }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Msg[]>(DEMO);
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const time = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [
      ...m,
      { id: Date.now(), role: "user", text: t, time },
      { id: Date.now() + 1, role: "assistant", text: "Grazie per la domanda. Questa è una risposta dimostrativa: a breve l'assistente sarà collegato.", time },
    ]);
    setText("");
  };

  return (
    <aside
      aria-hidden={!open}
      className={`fixed right-2 top-2 bottom-2 z-50 flex w-[min(370px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-[110%]"
      }`}
    >
      <header className="flex items-start gap-3 border-b border-border px-5 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/85 text-primary-foreground">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-bold text-primary">Assistente</h2>
          <p className="text-sm text-muted-foreground">Fai una domanda sulla salute ginecologica</p>
        </div>
        <button onClick={onClose} aria-label="Chiudi" className="rounded-md p-1 text-primary hover:bg-blush-soft">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex items-end justify-end gap-2">
              <span className="text-xs text-muted-foreground">{m.time}</span>
              <div className="max-w-[75%] rounded-2xl bg-blush px-4 py-2.5 text-sm text-foreground">{m.text}</div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2">
              <Avatar />
              <div className="max-w-[82%]">
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">{m.text}</div>
                <span className="mt-1 block pl-2 text-xs text-muted-foreground">{m.time}</span>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="space-y-3 px-4 pb-4">
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi il tuo messaggio..."
            className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button type="submit" aria-label="Invia" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90">
            <Send className="h-5 w-5" />
          </button>
        </form>
        <button
          type="button"
          onClick={onOpenFullChat}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/60 text-sm font-medium text-primary hover:bg-blush-soft"
        >
          <ExternalLink className="h-4 w-4" /> Apri la chat completa
        </button>
        <div className="flex gap-3 rounded-xl bg-warn-bg p-3 text-xs leading-relaxed text-warn-fg">
          <AlertCircle className="h-5 w-5 shrink-0 text-warn-icon" />
          <p>
            Le informazioni fornite sono solo suggerimenti informativi e non sostituiscono il parere del medico. In caso di
            dubbi, consulta sempre un professionista sanitario.
          </p>
        </div>
      </div>
    </aside>
  );
}
