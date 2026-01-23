import { City, Country, WorkMode } from "@/types/job";

export interface Job {
  id: string;
  slug: string;
  title: string;
  status: string;
  minExperience: number;
  maxExperience: number;
  companyName: string;
  skills: string[];
  location: string;
  applicants: number;
  city?: City;
  country?: Country;
  work_mode?: WorkMode[];
  relevant_assessments?:
    | { id: string; title: string; slug?: string; assessment_id?: string }[]
    | []
    | null;
  experience_range?: string;
  company_name?: string;
}

export const JOB_STATUS = {
  ACTIVE: "Active",
  IN_REVIEW: "In Review",
  IN_ACTIVE: "In-Active",
  DRAFT: "Draft",
} as const;
