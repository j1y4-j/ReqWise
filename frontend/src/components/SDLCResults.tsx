import { Award } from "lucide-react";
import type { SDLCAnalysis } from "../types";

interface SDLCResultsProps {
  data: SDLCAnalysis;
}

const CHARACTERISTIC_LABELS: Record<string, string> = {
  requirement_stability: "Requirement stability",
  expected_change: "Expected change",
  project_complexity: "Project complexity",
  technical_risk: "Technical risk",
  security_criticality: "Security criticality",
  stakeholder_involvement: "Stakeholder involvement",
};

export function SDLCResults({ data }: SDLCResultsProps) {
  const characteristics = Object.entries(data.project_characteristics);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
          Agent 2 output
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">
          SDLC Recommendation
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 p-6">
        <p className="flex items-center gap-2 text-sm font-medium text-amber-200">
          <Award className="h-4 w-4" />
          Recommended SDLC
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          {data.recommended_sdlc}
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Confidence: {data.confidence_score}%
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-400"
            style={{ width: `${clampScore(data.confidence_score)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-sm font-medium text-slate-300">Project characteristics</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {characteristics.map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                {CHARACTERISTIC_LABELS[key] ?? key}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-200">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          SDLC model comparison
        </h3>
        <div className="grid gap-4">
          {data.evaluated_models.map((model) => (
            <article
              key={model.model}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-medium text-slate-100">{model.model}</h4>
                <span className="font-mono text-sm text-cyan-300">
                  {model.suitability_score}/100
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                  style={{ width: `${clampScore(model.suitability_score)}%` }}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-300/80">
                    Advantages
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {model.advantages.map((item) => (
                      <li key={item} className="text-sm text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-rose-300/80">
                    Disadvantages
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {model.disadvantages.map((item) => (
                      <li key={item} className="text-sm text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-sm font-medium text-slate-300">Justification</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
          {data.justification}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          Suggested development workflow
        </h3>
        <ol className="space-y-3">
          {data.suggested_workflow.map((phase, index) => (
            <li
              key={`${phase.phase}-${index}`}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <p className="text-sm font-medium text-cyan-200">
                {index + 1}. {phase.phase}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                {phase.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}
