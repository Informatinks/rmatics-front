import { PackageStatus } from './sent-packages/package-status/package-status.component';

export interface ContestApi {
  id: number;
  name: string;
  summary: string;
  problems: ContestProblemApi[];
}

export interface Contest {
  id: number;
  name: string;
  summary: string;
  problems: ContestProblem[];
}

export interface SubmissionApi {
  id: number;
  user: {
    id: number,
    firstname: string,
    lastname: string,
  };
  problem: {
    id: number,
    name: string,
  };
  ejudge_status: string;
  create_time: number;
  ejudge_language_id: number;
  ejudge_test_num: number;
  ejudge_score: number;
}

export interface Submission {
  id: number;
  date: number;
  lang: string;
  tests: number;
  score: number;
  href: string;
  status: PackageStatus;
}

export interface ContestProblemApi {
  id: number;
  name: string;
  rank: number;
}

export interface ContestProblem {
  letter: string;
  text: string;
  id: number;
  rank: number;
}

export interface SampleTestApi {
  input: string;
  correct: string;
}

export interface ProblemApi {
  id: number;
  name: string;
  content: string;
  timelimit: number;
  memorylimit: number;
  description: string;
  sample_tests_json: SampleTestApi;
  output_only: boolean;
}

export interface Problem {
  id: number;
  name: string;
  content: string;
  timeLimit: number;
  memoryLimit: number;
  description: string;
  input: string[];
  correct: string[];
  outputOnly: boolean;
}
