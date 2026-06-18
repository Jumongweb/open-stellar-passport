import { motion } from "framer-motion";
import { Cpu } from "./icons";

export type PassportState = "empty" | "proving" | "proven" | "verified";

interface Props {
  state: PassportState;
  agentId?: string;
  spendCap?: string;
  nullifier?: string;
  registryRoot?: string;
  ledger?: number;
}

const fmtCap = (raw?: string) => {
  if (!raw) return "•••• XLM";
  return `${(Number(BigInt(raw)) / 1e7).toLocaleString(undefined, { maximumFractionDigits: 2 })} XLM`;
};

/** Build a passport-style machine-readable zone from the on-chain data. */
function mrz(agentId?: string, nullifier?: string) {
  const fill = (s: string, n: number) => (s + "<".repeat(n)).slice(0, n);
  const agt = agentId ? agentId.padStart(10, "0") : "<<<<<<<<<<";
  const nf = (nullifier ? BigInt(nullifier).toString(16).toUpperCase() : "").padEnd(24, "<").slice(0, 24);
  return [
    fill(`P<STELLAR<AGENT<${agt}`, 36),
    fill(`${nf}<7ZK<BN254<<<<`, 36),
  ];
}

/** Concentric guilloché security pattern (pure SVG). */
function Guilloche() {
  const rings = Array.from({ length: 13 }, (_, i) => i);
  return (
    <svg className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.13]" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="gx" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#7c5cff" />
        </radialGradient>
      </defs>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy="100"
          rx={30 + i * 5}
          ry={62 + i * 5}
          fill="none"
          stroke="url(#gx)"
          strokeWidth="0.5"
          transform={`rotate(${i * 14} 100 100)`}
        />
      ))}
    </svg>
  );
}

export function PassportCard({ state, agentId, spendCap, nullifier, ledger }: Props) {
  const sealed = state === "verified";
  const [m1, m2] = mrz(agentId, nullifier);

  return (
    <motion.div
      data-testid="passport"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="relative aspect-[1.585/1.06] w-full select-none overflow-hidden rounded-[1.4rem] border border-white/10"
      style={{
        background:
          "linear-gradient(155deg, #15131f 0%, #0e0d17 38%, #0b1018 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 70px -30px rgba(0,0,0,.9)",
      }}
    >
      <Guilloche />
      {/* holographic foil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 210deg at 70% 20%, rgba(124,92,255,.0), rgba(34,211,238,.35), rgba(124,92,255,.4), rgba(34,211,238,.0) 60%)",
        }}
      />
      <div className="animate-sheen absolute inset-0" />

      <div className="relative flex h-full flex-col p-5">
        {/* issuer row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-soft/90">Stellar</div>
            <div className="mt-0.5 text-[13px] font-semibold tracking-tight text-fg/95">ZK Credential</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-faint">P&lt;AGT</span>
            {/* EMV chip */}
            <div className="relative h-7 w-9 rounded-[5px] bg-gradient-to-br from-amber/80 to-amber/40 ring-1 ring-amber/30">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px p-[3px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="rounded-[1px] bg-ink-900/40" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* body: portrait + data */}
        <div className="mt-4 flex flex-1 gap-4">
          {/* redacted portrait */}
          <div className="relative h-[88px] w-[68px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-ink-950">
            <svg viewBox="0 0 68 88" className="absolute inset-0 h-full w-full text-ink-700">
              <rect width="68" height="88" fill="currentColor" opacity="0.5" />
              <circle cx="34" cy="34" r="15" fill="#0a0a0f" />
              <path d="M12 84c2-16 12-24 22-24s20 8 22 24" fill="#0a0a0f" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-violet-soft/70">redacted</span>
            </div>
            <div className="absolute bottom-1 right-1 font-mono text-[7px] uppercase tracking-wider text-cyan/60">zk</div>
          </div>

          {/* data fields */}
          <div className="grid flex-1 grid-cols-2 content-start gap-x-3 gap-y-2.5">
            <Field k="Type" v="Agent / x402" />
            <Field k="Agent No." v={agentId ? agentId : "—"} mono />
            <Field k="Spend cap" v={fmtCap(spendCap)} accent />
            <Field k="Holder" v="████ hidden" />
          </div>
        </div>

        {/* MRZ machine-readable zone */}
        <div className="mt-3 rounded-md bg-ink-950/70 px-2.5 py-1.5 ring-1 ring-white/5">
          <div className="font-mono text-[9.5px] leading-[1.5] tracking-[0.12em] text-fg/70">
            <div className="truncate">{m1}</div>
            <div className="truncate">{m2}</div>
          </div>
        </div>

        {/* status footer */}
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            <Cpu width={11} height={11} className="text-faint" />
            {sealed ? `sealed · ledger ${ledger ?? "—"}` : state === "proving" ? "proving…" : "testnet · not sealed"}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              sealed ? "bg-verified shadow-[0_0_8px_var(--color-verified)]" : state === "proven" ? "bg-cyan" : "bg-faint"
            }`}
          />
        </div>
      </div>

      {/* VERIFIED ink stamp */}
      {sealed && (
        <motion.div
          initial={{ opacity: 0, scale: 1.4, rotate: -24 }}
          animate={{ opacity: 1, scale: 1, rotate: -14 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="pointer-events-none absolute right-4 top-1/2 grid h-24 w-24 -translate-y-1/2 place-items-center rounded-full border-2 border-verified/70 text-verified"
          style={{ boxShadow: "0 0 0 1px rgba(52,211,153,.2) inset" }}
        >
          <div className="text-center leading-tight">
            <div className="font-mono text-[8px] uppercase tracking-[0.2em] opacity-80">verified</div>
            <div className="font-mono text-[13px] font-bold uppercase tracking-tight">on-chain</div>
            <div className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-80">BN254 · Soroban</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Field({ k, v, mono, accent }: { k: string; v: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">{k}</div>
      <div
        className={`truncate text-[12.5px] ${mono ? "font-mono" : "font-medium"} ${
          accent ? "text-cyan" : "text-fg/90"
        }`}
      >
        {v}
      </div>
    </div>
  );
}
