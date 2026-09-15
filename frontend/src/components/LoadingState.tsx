import { Loader2 } from "lucide-react";
import { AgentWorkflow, WorkflowChecklist } from "./AgentWorkflow";
import type { WorkflowStep, WorkflowStepStatus } from "../types";

interface LoadingStateProps {
  steps: WorkflowStep[];
  statuses: WorkflowStepStatus[];
}

export function LoadingState({ steps, statuses }: LoadingStateProps) {
  return (
    <div className="animate-in">
      <AgentWorkflow statuses={statuses} />
      <div className="mx-auto mb-4 flex max-w-3xl items-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
        Running the sequential agent workflow…
      </div>
      <WorkflowChecklist steps={steps} statuses={statuses} />
    </div>
  );
}
