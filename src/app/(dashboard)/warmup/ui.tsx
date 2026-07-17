"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function WarmupControls({ status }: { status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: string) {
    setBusy(true);
    await fetch("/api/warmup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    router.refresh();
  }

  const btn = "rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50";
  if (status === "none") {
    return (
      <button disabled={busy} onClick={() => act("start")} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
        Start warm-up
      </button>
    );
  }
  if (status === "active") {
    return (
      <button disabled={busy} onClick={() => act("pause")} className={`${btn} border border-gray-300 hover:bg-gray-50`}>
        Pause
      </button>
    );
  }
  if (status === "paused") {
    return (
      <button disabled={busy} onClick={() => act("resume")} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
        Resume
      </button>
    );
  }
  return null;
}
