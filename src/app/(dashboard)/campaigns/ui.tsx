"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputCls =
  "w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-gold focus:outline-none";
const btnCls =
  "rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-amber disabled:opacity-50";
const btnGhost =
  "rounded-md border border-charcoal/20 px-3 py-1.5 text-sm text-charcoal hover:bg-mist disabled:opacity-50";

export function CampaignForm({ sequences }: { sequences: { id: string; name: string }[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        type: form.get("type"),
        sequenceId: form.get("sequenceId"),
        dailyLimit: Number(form.get("dailyLimit") || 50),
      }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-charcoal/10 bg-white p-5">
      <h2 className="mb-3 font-semibold">New campaign</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <input name="name" placeholder="Name *" required className={inputCls} />
        <select name="type" className={inputCls}>
          <option value="cold">Cold outreach</option>
          <option value="lead_magnet">Lead magnet</option>
          <option value="nurture">Nurture</option>
        </select>
        <select name="sequenceId" required className={inputCls}>
          <option value="">Sequence… *</option>
          {sequences.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input name="dailyLimit" type="number" defaultValue={50} min={1} className={inputCls} />
      </div>
      <button disabled={busy} className={`${btnCls} mt-3`}>Create</button>
    </form>
  );
}

export function CampaignControls({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [tag, setTag] = useState("");
  const [msg, setMsg] = useState("");

  async function patch(payload: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const data = await res.json();
    if (typeof data.enrolled === "number" && payload.enroll) {
      setMsg(`Enrolled ${data.enrolled} contact(s).`);
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {status !== "active" && (
        <button disabled={busy} onClick={() => patch({ status: "active" })} className={btnGhost}>
          Activate
        </button>
      )}
      {status === "active" && (
        <button disabled={busy} onClick={() => patch({ status: "paused" })} className={btnGhost}>
          Pause
        </button>
      )}
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Enroll contacts by tag…"
        className="rounded-md border border-charcoal/20 px-3 py-1.5 text-sm focus:border-gold focus:outline-none"
      />
      <button
        disabled={busy || !tag}
        onClick={() => patch({ enroll: { tag } })}
        className={btnGhost}
      >
        Enroll
      </button>
      {msg && <span className="text-sm text-smoke">{msg}</span>}
    </div>
  );
}
