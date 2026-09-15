export interface FunctionalRequirement {
  id: string;
  requirement: string;
}

export interface NonFunctionalRequirement {
  id: string;
  category: string;
  requirement: string;
}

export interface RequirementsResult {
  project_summary: string;
  stakeholders: string[];
  functional_requirements: FunctionalRequirement[];
  non_functional_requirements: NonFunctionalRequirement[];
  constraints: string[];
  assumptions: string[];
  open_questions: string[];
}

export interface ProjectCharacteristics {
  requirement_stability: string;
  expected_change: string;
  project_complexity: string;
  technical_risk: string;
  security_criticality: string;
  stakeholder_involvement: string;
}

export interface EvaluatedModel {
  model: string;
  suitability_score: number;
  advantages: string[];
  disadvantages: string[];
}

export interface WorkflowPhase {
  phase: string;
  description: string;
}

export interface SDLCAnalysis {
  project_characteristics: ProjectCharacteristics;
  evaluated_models: EvaluatedModel[];
  recommended_sdlc: string;
  confidence_score: number;
  justification: string;
  suggested_workflow: WorkflowPhase[];
}

export interface AnalyzeResponse {
  requirements: RequirementsResult;
  sdlc_analysis: SDLCAnalysis;
}

export type AppStage = "input" | "workflow" | "results";

export type WorkflowStepStatus = "pending" | "active" | "done";

export interface WorkflowStep {
  id: string;
  label: string;
}
