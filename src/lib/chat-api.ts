
export type WidgetMode = "patient" | "menopause";

export interface Citation {
  source: string;
  title: string;
  url?: string | null;
  pmid?: string | null;
  doc_id?: string | null;
  year?: string | null;
  journal?: string | null;
  doi?: string | null;
}

export interface GynSuggestion {
  name: string;
  address: string;
  city?: string | null;
  phone?: string | null;
  website?: string | null;
  emails?: string | null;
  rating?: number | null;
  reviews?: number | null;
  distance_km?: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  suggestions?: GynSuggestion[];
}

interface BackendChatResponse {
  answer: string;
  citations?: Citation[];
  suggestions?: GynSuggestion[];
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

export async function sendWidgetMessage(
  message: string,
  mode: WidgetMode,
  sessionId: string
): Promise<ChatMessage> {
  if (!API_BASE_URL) {
    throw new Error("URL del backend non configurato.");
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message.trim(),
      mode,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Errore del backend (${response.status}).`
    );
  }

  const data: BackendChatResponse = await response.json();

  if (typeof data.answer !== "string") {
    throw new Error("Risposta del backend non valida.");
  }

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: data.answer,
    citations: Array.isArray(data.citations)
      ? data.citations
      : [],
    suggestions: Array.isArray(data.suggestions)
      ? data.suggestions
      : [],
  };
}
