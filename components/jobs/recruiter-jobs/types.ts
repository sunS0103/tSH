export interface Job {
  id: string;
  title: string;
  status: string;
  minExperience: number;
  maxExperience: number;
  companyName: string;
  skills: string[];
  location: string;
  applicants: number;
}

export const JOB_STATUS = {
  ACTIVE: "Active",
  IN_REVIEW: "In Review",
  IN_ACTIVE: "In-Active",
  DRAFT: "Draft",
} as const;

