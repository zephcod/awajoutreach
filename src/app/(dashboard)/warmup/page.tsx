import { getWarmupState, targetForDay } from "@/lib/warmup";
import { env } from "@/lib/env";
import { WarmupControls } from "./ui";

export const dynamic = "force-dynamic";

export default async function WarmupPage() {
  const state = await getWarmupState();
  const max = env.warmupMaxDaily();
  const schedule: { day: number; volume: number }[] = [];
  for (let d = 1; d <= 45; d++) {
    const v = targetForDay(d);
    schedule.push({ day: d, volume: v });
    if (v >= max) break;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Domain warm-up</h1>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
        {state ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-xl font-semibold capitalize">{state.status}</p>
              <p className="mt-1 text-sm text-gray-500">
                Day {state.day} · sent {state.sentToday}/{state.targetVolume} today · started{" "}
                {new Date(state.startedAt).toLocaleDateString()}
              </p>
            </div>
            <WarmupControls status={state.status} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Warm-up not started. While active, it caps total daily outreach volume and grows
              it gradually to protect your domain reputation.
            </p>
            <WarmupControls status="none" />
          </div>
        )}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Ramp schedule</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-end gap-1">
          {schedule.map((s) => (
            <div key={s.day} className="flex flex-col items-center" title={`Day ${s.day}: ${s.volume} emails`}>
              <div
                className={`w-4 rounded-t ${state && s.day <= state.day ? "bg-green-500" : "bg-gray-200"}`}
                style={{ height: `${Math.max(8, (s.volume / max) * 120)}px` }}
              />
              {s.day % 5 === 0 && <span className="mt-1 text-[10px] text-gray-400">{s.day}</span>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Start: {env.warmupStartVolume()}/day · growth ×{env.warmupGrowthRate()}/day · cap: {max}/day.
          Adjust via WARMUP_* env vars.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
        <p className="font-semibold">Warm-up best practices</p>
        <p className="mt-2">
          During the first two weeks, send mostly to inboxes that will open and reply (your own
          accounts, partners, existing clients). Keep bounce rate under 3%. Verify SPF, DKIM and
          DMARC before day one — see the README deliverability guide.
        </p>
      </div>
    </div>
  );
}
