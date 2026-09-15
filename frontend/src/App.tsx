import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, GitBranch } from "lucide-react";
import { ScenarioInput } from "./components/ScenarioInput";
import { AgentWorkflow } from "./components/AgentWorkflow";
import { LoadingState } from "./components/LoadingState";
import { RequirementsResults } from "./components/RequirementsResults";
import { SDLCResults } from "./components/SDLCResults";
import { analyzeProject, ApiError } from "./services/api";
import type {
  AnalyzeResponse,
  AppStage,
  WorkflowStep,
  WorkflowStepStatus,
} from "./types";

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "received", label: "Scenario received" },
  { id: "req-analyzing", label: "Requirements Agent analyzing scenario" },
  { id: "functional", label: "Functional requirements extracted" },
  { id: "nfr", label: "Non-functional requirements identified" },
  { id: "handoff", label: "Passing structured output to SDLC Advisor" },
  { id: "models", label: "SDLC models evaluated" },
  { id: "recommendation", label: "Recommendation generated" },
];

function buildStatuses(elapsedMs: number, done: boolean): WorkflowStepStatus[] {
  if (done) return WORKFLOW_STEPS.map(() => "done");
  const activeIndex = Math.min(
    WORKFLOW_STEPS.length - 1,
    Math.floor(elapsedMs / 1400),
  );
  return WORKFLOW_STEPS.map((_, index) => {
    if (index < activeIndex) return "done";
    if (index === activeIndex) return "active";
    return "pending";
  });
}

export default function App() {
  const [scenario, setScenario] = useState("");
  const [stage, setStage] = useState<AppStage>("input");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (stage !== "workflow") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - started);
    }, 250);
    return () => window.clearInterval(timer);
  }, [stage]);

  const statuses = useMemo(
    () => buildStatuses(elapsedMs, stage === "results"),
    [elapsedMs, stage],
  );

  async function handleAnalyze() {
    const trimmed = scenario.trim();
    if (!trimmed) {
      setError("Enter a software project scenario, or choose one of the examples.");
      return;
    }

    setError(null);
    setResult(null);
    setElapsedMs(0);
    setStage("workflow");

    try {
      const data = await analyzeProject(trimmed);
      setResult(data);
      setStage("results");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong while analyzing the project.";
      setError(message);
      setStage("input");
    }
  }

  function handleReset() {
    setStage("input");
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.08),_transparent_45%)]" />
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-sm font-semibold tracking-tight">ReqWise</p>
              <p className="hidden text-xs text-slate-400 sm:block">
                From idea to requirements to the right development process.
              </p>
            </div>
          </div>
          {stage !== "input" ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              New scenario
            </button>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {stage === "input" ? (
          <ScenarioInput
            scenario={scenario}
            onScenarioChange={setScenario}
            onAnalyze={() => void handleAnalyze()}
            error={error}
          />
        ) : null}

        {stage === "workflow" ? (
          <LoadingState steps={WORKFLOW_STEPS} statuses={statuses} />
        ) : null}

        {stage === "results" && result ? (
          <div className="space-y-10">
            <AgentWorkflow statuses={statuses} />
            <div className="grid gap-10 lg:grid-cols-2">
              <RequirementsResults data={result.requirements} />
              <SDLCResults data={result.sdlc_analysis} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
