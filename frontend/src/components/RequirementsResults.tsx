import type { ReactNode } from "react";
import { CircleHelp, Flag, Shield, Users } from "lucide-react";
import type { RequirementsResult } from "../types";

interface RequirementsResultsProps {
  data: RequirementsResult;
}

export function RequirementsResults({ data }: RequirementsResultsProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
          Agent 1 output
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">
          Requirements Analysis
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-sm font-medium text-slate-300">Project summary</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          {data.project_summary}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard
          icon={<Users className="h-4 w-4" />}
          title="Stakeholders"
          items={data.stakeholders}
        />
        <ListCard
          icon={<Flag className="h-4 w-4" />}
          title="Constraints"
          items={data.constraints}
        />
        <ListCard
          icon={<Shield className="h-4 w-4" />}
          title="Assumptions"
          items={data.assumptions}
        />
        <ListCard
          icon={<CircleHelp className="h-4 w-4" />}
          title="Open questions"
          items={data.open_questions}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          Functional requirements
        </h3>
        <div className="grid gap-3">
          {data.functional_requirements.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <span className="inline-flex rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-xs text-cyan-300">
                {item.id}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {item.requirement}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          Non-functional requirements
        </h3>
        <div className="grid gap-3">
          {data.non_functional_requirements.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-md bg-indigo-500/10 px-2 py-0.5 font-mono text-xs text-indigo-300">
                  {item.id}
                </span>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                  {item.category}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {item.requirement}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListCard({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
        <span className="text-cyan-300">{icon}</span>
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">None identified.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={`${title}-${item}`} className="text-sm leading-relaxed text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
