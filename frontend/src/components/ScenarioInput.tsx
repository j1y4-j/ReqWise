import { GitBranch, Loader2, Sparkles } from "lucide-react";

const EXAMPLES = [
  {
    title: "Hostel management",
    text: "Build a university hostel management system where students can apply for rooms, administrators can allocate rooms, and students can submit maintenance complaints.",
  },
  {
    title: "Clinic appointments",
    text: "Build a clinic appointment system where patients can book visits, doctors can view daily schedules, and staff can send reminder notifications. Patient records must stay confidential.",
  },
  {
    title: "Campus lost-and-found",
    text: "Build a campus lost-and-found web app where students can report lost items, staff can log found items, and matches can be confirmed before pickup. The team has eight weeks and two student developers.",
  },
];

interface ScenarioInputProps {
  scenario: string;
  onScenarioChange: (value: string) => void;
  onAnalyze: () => void;
  error: string | null;
  disabled?: boolean;
}

export function ScenarioInput({
  scenario,
  onScenarioChange,
  onAnalyze,
  error,
  disabled = false,
}: ScenarioInputProps) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-10 text-center">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-cyan-400/30">
          <GitBranch className="h-7 w-7 text-cyan-300" strokeWidth={1.75} />
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-300/80">
          ReqWise
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          AI-Powered Requirements &amp; SDLC Advisor
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
          Describe a software idea. A Requirements Engineer agent structures it,
          then an SDLC Advisor agent recommends a development process.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl shadow-black/20 sm:p-6">
        <label htmlFor="scenario" className="mb-2 block text-sm font-medium text-slate-300">
          Project scenario
        </label>
        <textarea
          id="scenario"
          rows={8}
          value={scenario}
          disabled={disabled}
          onChange={(event) => onScenarioChange(event.target.value)}
          placeholder="Describe the product, users, and any constraints you already know..."
          className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none ring-cyan-400/0 transition focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.title}
              type="button"
              disabled={disabled}
              onClick={() => onScenarioChange(example.text)}
              className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200 disabled:opacity-50"
            >
              {example.title}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analyze Project
        </button>
      </div>
    </section>
  );
}
