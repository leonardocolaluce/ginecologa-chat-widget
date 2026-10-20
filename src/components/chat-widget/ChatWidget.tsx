import { useState } from "react";
import { ChatDrawer } from "./ChatDrawer";
import { FloatingChatButton } from "./FloatingChatButton";

export interface ChatWidgetProps {
  defaultOpen?: boolean;
  onOpenFullChat?: () => void;
}

/** Drop-in widget: floating button + right-side assistant panel. Demo UI only. */
export function ChatWidget({ defaultOpen = false, onOpenFullChat }: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      {!open && <FloatingChatButton open={open} onClick={() => setOpen(true)} />}
      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpenFullChat={onOpenFullChat ?? (() => console.log("onOpenFullChat"))}
      />
    </>
  );
}
