import { CreateRoomButton } from "@/components/home/CreateRoomButton";
import { RecentRooms } from "@/components/home/RecentRooms";
import { SiteShell } from "@/components/legal/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] overflow-hidden"
      >
        <div className="absolute left-[-20%] top-8 h-64 w-64 rounded-full bg-[var(--brand)]/15 blur-3xl" />
        <div className="absolute right-[-10%] top-24 h-56 w-56 rounded-full bg-[var(--accent)]/15 blur-3xl" />
      </div>

      <header className="animate-rise relative z-10 space-y-5">
        <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--brand-deep)] sm:text-6xl">
          Warikan
        </p>
        <p className="max-w-sm text-base leading-relaxed text-[var(--ink-muted)]">
          URLをシェアするだけで、みんなでリアルタイム割り勘。ログイン不要。
        </p>
        <div className="animate-rise-delay-1 pt-2">
          <CreateRoomButton />
        </div>
      </header>

      <div className="relative z-10 mt-14">
        <RecentRooms />
      </div>
    </SiteShell>
  );
}
