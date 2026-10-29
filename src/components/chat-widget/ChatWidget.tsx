
import { useState } from "react";

import { ChatDrawer } from "./ChatDrawer";
import { FloatingChatButton } from "./FloatingChatButton";

export type WidgetMode = "patient" | "menopause";

export interface ChatWidgetProps {
  defaultOpen?: boolean;
  mode?: WidgetMode;
  onOpenFullChat?: () => void;
}

const FULL_CHAT_URLS: Record<WidgetMode, string> = {
  patient:
    "https://urchin-app-l7pdb.ondigitalocean.app",
  menopause:
    "https://hammerhead-app-fjpxn.ondigitalocean.app",
};

export function ChatWidget({
  defaultOpen = false,
  mode = "patient",
  onOpenFullChat,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);

  function openFullChat() {
    if (onOpenFullChat) {
      onOpenFullChat();
      return;
    }

    window.location.assign(FULL_CHAT_URLS[mode]);
  }

  return (
    <>
      {!open && (
        <FloatingChatButton
          open={open}
          onClick={() => setOpen(true)}
        />
      )}

      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpenFullChat={openFullChat}
      />
    </>
  );
}
