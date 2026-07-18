import { TEMPLATES } from "@/emails/registry";
import { ManualSendForm } from "./ui";

export const dynamic = "force-dynamic";

export default function SendPage() {
  const templates = Object.entries(TEMPLATES).map(([key, t]) => ({
    key,
    defaultSubject: t.defaultSubject,
    category: t.category,
    description: t.description,
  }));

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold">Send email</h1>
      <p className="mb-6 text-sm text-smoke">
        One-off manual send of any template. Goes through the same pipeline as automated
        sends: suppression check, logging, and unsubscribe headers all apply.
      </p>
      <ManualSendForm templates={templates} />
    </div>
  );
}
