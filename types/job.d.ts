// Root response
export interface RecruiterJob {
  id: string;
  slug: string;
  title: string;
  description: string;
  company_name: string;
  contract_to_hire: boolean;
  client_name: string | null;
  conversion_time: string | null;
  status: "in_review" | "published" | "draft" | string;

  city: City;
  country: Country;

  job_serving_location: string;
  employment_gaps: boolean;
  region: string;
  required_notice_period: string;

  experience_min_years: number;
  experience_max_years: number;
  experience_range?: string;

  compensation: Compensation;

  work_modes: WorkMode[];

  skills: JobSkill[];
  primary_skills?: JobSkill[];

  custom_fields: CustomField[];

  mandate_assessment: { id: string; title: string }[] | [] | null;

  recruiter: Recruiter;

  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/* ---------- Nested Types ---------- */

export interface City {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface Compensation {
  min_amount: number;
  max_amount: number;
  currency: string;
  period: string; // e.g. LPA
}

export type WorkMode = "Remote" | "Hybrid" | "Onsite" | string;

export interface JobSkill {
  skill_id: number;
  is_required: boolean;
  skill: Skill;
}

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
}

export interface SkillCategory {
  id: number;
  name: string;
}

export interface CustomField {
  title: string;
  type: "text" | "number" | "select" | string;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  company_name: string;
  platform_role: string;
}
