"use client";

import { useState } from "react";

interface TemplateOption {
  key: string;
  defaultSubject: string;
  category: string;
  description: string;
}

const inputCls =
  "w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelCls = "mb-1 block text-xs font-medium text-smoke";

/** Which var fields matter per template category/key. */
function fieldsFor(key: string, category: string): string[] {
  if (key === "warmup-ping") return ["note"];
  if (key === "lead-magnet-delivery") return ["firstName", "resourceName", "downloadUrl"];
  if (key === "receipt") return ["firstName", "invoiceNumber", "amount", "service"];
  if (category === "transactional") return ["firstName"];
  return ["firstName", "lastName", "company"];
}

const FIELD_META: Record<string, { label: string; placeholder: string }> = {
  firstName: { label: "First name", placeholder: "Sara" },
  lastName: { label: "Last name", placeholder: "Bekele" },
  company: { label: "Company", placeholder: "Sara's Boutique" },
  note: { label: "Message body", placeholder: "Checking in on this week's schedule." },
  resourceName: { label: "Resource name", placeholder: "SME Marketing Playbook" },
  downloadUrl: { label: "Download URL", placeholder: "https://awajet.com/downloads/playbook.pdf" },
  invoiceNumber: { label: "Invoice #", placeholder: "INV-0042" },
  amount: { label: "Amount", placeholder: "ETB 15,000.00" },
  service: { label: "Service", placeholder: "Social media management — July" },
};

export function ManualSendForm({ templates }: { templates: TemplateOption[] }) {
  const [templateKey, setTemplateKey] = useState(templates[0]?.key ?? "");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(templates[0]?.defaultSubject ?? "");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const selected = templates.find((t) => t.key === templateKey);
  const varFields = selected ? fieldsFor(selected.key, selected.category) : [];

  function pickTemplate(key: string) {
    const t = templates.find((t) => t.key === key)!;
    setTemplateKey(key);
    setSubject(t.defaultSubject);
    setResult(null);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/send/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, templateKey, subject, vars }),
      });
      const data = await res.json();
      setResult(
        res.ok
          ? { ok: true, text: `Sent to ${to} (Resend ID: ${data.resendId ?? "n/a"})` }
          : { ok: false, text: data.error ?? "Send failed." }
      );
    } catch (err) {
      setResult({ ok: false, text: (err as Error).message });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={send} className="max-w-2xl space-y-5">
      <div className="rounded-lg border border-charcoal/10 bg-white p-5">
        <label className={labelCls}>Template</label>
        <select value={templateKey} onChange={(e) => pickTemplate(e.target.value)} className={inputCls}>
          {templates.map((t) => (
            <option key={t.key} value={t.key}>
              {t.key} · {t.category}
            </option>
          ))}
        </select>
        {selected && <p className="mt-2 text-xs text-smoke">{selected.description}</p>}
      </div>

      <div className="rounded-lg border border-charcoal/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>To *</label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Subject ({"{{firstName}}"} and {"{{company}}"} supported)</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>
          {varFields.map((f) => (
            <div key={f} className={f === "note" || f === "downloadUrl" ? "sm:col-span-2" : ""}>
              <label className={labelCls}>{FIELD_META[f].label}</label>
              <input
                value={vars[f] ?? ""}
                onChange={(e) => setVars({ ...vars, [f]: e.target.value })}
                placeholder={FIELD_META[f].placeholder}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={busy || !to}
          className="rounded-md bg-gold px-5 py-2 text-sm font-semibold text-navy hover:bg-amber disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send email"}
        </button>
        {result && (
          <span className={`text-sm ${result.ok ? "text-amber" : "text-red-600"}`}>
            {result.text}
          </span>
        )}
      </div>
    </form>
  );
}
