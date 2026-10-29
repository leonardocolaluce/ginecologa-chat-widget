
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  BookOpen,
  ExternalLink,
  MapPin,
  Phone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import {
  sendWidgetMessage,
  type ChatMessage,
  type WidgetMode,
} from "@/lib/chat-api";

export interface ChatDrawerProps {
  open: boolean;
  mode: WidgetMode;
  onClose: () => void;
  onOpenFullChat?: () => void;
}

function safeUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  try {
    const value = url.trim();
    const candidate = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    const parsed = new URL(candidate);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

function AssistantAvatar() {
  return (
    <img
      src="/ginecologa-logo.png"
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 rounded-lg object-contain"
    />
  );
}

export function ChatDrawer({
  open,
  mode,
  onClose,
  onOpenFullChat,
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState(
    () => crypto.randomUUID()
  );

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, loading, open, error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = text.trim();

    if (!question || busyRef.current) return;

    busyRef.current = true;
    setLoading(true);
    setError(null);
    setText("");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((previous) => [...previous, userMessage]);

    try {
      const reply = await sendWidgetMessage(
        question,
        mode,
        sessionId
      );

      setMessages((previous) => [...previous, reply]);
    } catch (err) {
      console.error("Errore assistente:", err);

      setError(
        "Non è stato possibile ottenere una risposta. Riprova."
      );
    } finally {
      busyRef.current = false;
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function newConversation() {
    if (loading) return;

    setMessages([]);
    setText("");
    setError(null);
    setSessionId(crypto.randomUUID());
    inputRef.current?.focus();
  }

  return (
    <aside
      role="dialog"
      aria-label="Assistente Ginecologa.chat"
      aria-hidden={!open}
      inert={!open}
      className={`fixed bottom-2 right-2 top-2 z-50 flex w-[min(370px,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-transform duration-300 ${
        open
          ? "translate-x-0"
          : "pointer-events-none translate-x-[110%]"
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

        <div className="min-w-0 flex-1">
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

      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {mode === "menopause"
            ? "Modalità Menopausa"
            : "Modalità Paziente"}
        </span>

        <button
          type="button"
          onClick={newConversation}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Nuova chat
        </button>
      </div>

      <div
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
        aria-live="polite"
      >
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="flex justify-end"
            >
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-blush px-4 py-2.5 text-sm text-foreground">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex gap-2">
              <AssistantAvatar />

              <div className="min-w-0 max-w-[85%] space-y-3">
                <div className="whitespace-pre-wrap break-words rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
                  {message.content}
                </div>

                {message.citations &&
                  message.citations.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-3 text-xs">
                      <p className="mb-2 flex items-center gap-1.5 font-semibold text-foreground">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Fonti scientifiche
                      </p>

                      <ul className="space-y-2">
                        {message.citations.map((citation, index) => {
                          const url = safeUrl(citation.url);

                          return (
                            <li key={`${message.id}-cite-${index}`}>
                              {url ? (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="break-words text-primary underline"
                                >
                                  {citation.title}
                                </a>
                              ) : (
                                <span>{citation.title}</span>
                              )}

                              {(citation.journal || citation.year) && (
                                <p className="mt-1 text-muted-foreground">
                                  {[
                                    citation.journal,
                                    citation.year,
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                {message.suggestions &&
                  message.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Professioniste individuate
                      </p>

                      {message.suggestions.map((doctor, index) => {
                        const website = safeUrl(doctor.website);
                        const phone = doctor.phone?.trim();
                        const tel = phone
                          ? phone.replace(/[^\d+]/g, "")
                          : "";

                        return (
                          <article
                            key={`${message.id}-doctor-${index}`}
                            className="rounded-xl border border-border bg-card p-3 text-xs"
                          >
                            <p className="font-semibold text-foreground">
                              {doctor.name}
                            </p>

                            {(doctor.address || doctor.city) && (
                              <p className="mt-2 flex items-start gap-1.5 text-muted-foreground">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>
                                  {doctor.address}
                                  {doctor.city &&
                                  !doctor.address
                                    .toLowerCase()
                                    .includes(doctor.city.toLowerCase())
                                    ? `, ${doctor.city}`
                                    : ""}
                                </span>
                              </p>
                            )}

                            {phone && tel && (
                              <a
                                href={`tel:${tel}`}
                                className="mt-2 flex items-center gap-1.5 text-primary underline"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                {phone}
                              </a>
                            )}

                            {website && (
                              <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 flex items-center gap-1.5 text-primary underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Sito web
                              </a>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AssistantAvatar />
            <span>Sto preparando la risposta...</span>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-card px-3 py-2 text-xs text-destructive"
          >
            {error}
          </p>
        )}

        <div ref={endRef} />
      </div>

      <div className="space-y-3 border-t border-border px-4 pb-4 pt-3">
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="widget-message" className="sr-only">
            Scrivi il tuo messaggio
          </label>

          <input
            id="widget-message"
            ref={inputRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={loading}
            placeholder="Scrivi il tuo messaggio..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !text.trim()}
            aria-label="Invia messaggio"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
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
