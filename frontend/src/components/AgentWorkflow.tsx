import { ArrowDown, Check, Circle, Loader2 } from "lucide-react";
import type { WorkflowStep, WorkflowStepStatus } from "../types";

interface AgentWorkflowProps {
  statuses: WorkflowStepStatus[];
}

interface WorkflowChecklistProps {
  steps: WorkflowStep[];
  statuses: WorkflowStepStatus[];
}

export function AgentWorkflow({ statuses }: AgentWorkflowProps) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-300/80">
          Sequential agents
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Two-agent pipeline
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Requirements are extracted first. The SDLC advisor only sees that structured output.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <PipelineCard
          title="Requirements Engineer"
          subtitle="Agent 1"
          active={statuses.slice(0, 4).some((status) => status === "active")}
          done={statuses[3] === "done"}
        />
        <ArrowDown className="mx-auto h-5 w-5 text-slate-500 sm:-rotate-90" />
        <PipelineCard
          title="Structured Requirements"
          subtitle="JSON handoff"
          active={statuses[4] === "active"}
          done={statuses[4] === "done"}
        />
        <ArrowDown className="mx-auto h-5 w-5 text-slate-500 sm:-rotate-90" />
        <PipelineCard
          title="SDLC Advisor"
          subtitle="Agent 2"
          active={statuses.slice(5).some((status) => status === "active")}
          done={statuses[statuses.length - 1] === "done"}
        />
      </div>
    </section>
  );
}

function PipelineCard({
  title,
  subtitle,
  active,
  done,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 text-center transition ${
        done
          ? "border-emerald-500/30 bg-emerald-500/10"
          : active
            ? "border-cyan-400/40 bg-cyan-400/10 shadow-lg shadow-cyan-950/30"
            : "border-slate-800 bg-slate-900/70"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-slate-400">{subtitle}</p>
      <p className="mt-1 text-sm font-medium text-slate-100">{title}</p>
    </div>
  );
}

export function WorkflowChecklist({
  steps,
  statuses,
}: WorkflowChecklistProps) {
  return (
    <ol className="mx-auto mt-2 w-full max-w-3xl space-y-2">
      {steps.map((step, index) => {
        const status = statuses[index] ?? "pending";
        return (
          <li
            key={step.id}
            className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3"
          >
            <StatusIcon status={status} />
            <span
              className={`text-sm ${
                status === "pending" ? "text-slate-500" : "text-slate-200"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StatusIcon({ status }: { status: WorkflowStepStatus }) {
  if (status === "done") {
    return (
      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "active") {
    return <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-cyan-300" />;
  }
  return <Circle className="mt-0.5 h-5 w-5 text-slate-600" />;
}
