import axios from "../axios";

export interface TalentPoolQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: "score" | "experience" | "recently_assessed";
  sortDirection?: "asc" | "desc";
  query?: string;
  favorite_only?: boolean;
  years_of_experience_min?: number;
  years_of_experience_max?: number;
  location?: string | string[];
  technology?: string | string[];
}

export interface SkillAssessed {
  skill_id: string;
  skill_name: string;
  score_percentage: number;
  count: number;
}

export interface AssessmentTaken {
  assessment_id: string;
  assessment_title: string;
  assessment_slug?: string;
  completed_at: string;
  score_percentage: number;
  skills_assessed: {
    skill_id: string;
    skill_name: string;
    count: number;
  }[];
}

export interface Candidate {
  candidate_id: string;
  user_id: string;
  expertise: string | null;
  years_of_experience: number | null;
  city: string | null;
  location: string | null;
  skills_assessed: SkillAssessed[];
  talent_report_url: string | null;
  score: number;
  notice_period: string | null;
  is_favorite: boolean;
  is_top_pick: boolean;
  assessments_taken: AssessmentTaken[];
  candidate_name: string;
  candidate_email: string;
  company: string | null;
  availability: string | null;
  about: string | null;
}

export interface TalentPoolPagination {
  pageSize: number;
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface TalentPoolMeta {
  query: string;
  pagination: TalentPoolPagination;
  sorting: {
    sortBy: string;
    sortDirection: "asc" | "desc";
  };
}

export interface TalentPoolResponse {
  success: boolean;
  message: string;
  data: Candidate[];
  meta: TalentPoolMeta;
}

export const getRecruiterTalentPool = async (
  params?: TalentPoolQueryParams
): Promise<TalentPoolResponse> => {
  const response = await axios.get("/recruiter/talent-pool", {
    params,
  });
  return response.data;
};

export interface FavoriteTalentRequest {
  candidate_id: string;
}

export interface FavoriteTalentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const addFavoriteTalent = async (
  candidateId: string
): Promise<FavoriteTalentResponse> => {
  const response = await axios.post("/recruiter/talent-pool/favorite", {
    candidate_id: candidateId,
  });
  return response.data;
};

export const removeFavoriteTalent = async (
  candidateId: string
): Promise<FavoriteTalentResponse> => {
  const response = await axios.delete(
    `/recruiter/talent-pool/favorite/${candidateId}`
  );
  return response.data;
};

export interface FilterLocation {
  id: number;
  title: string;
  value: number;
  search_text: string;
}

export interface FilterTechnology {
  id: string;
  title: string;
  value: string;
}

export interface FilterSkill {
  id: number;
  title: string;
  value: string;
}

export interface TalentPoolFiltersResponse {
  success: boolean;
  message: string;
  data: {
    location: FilterLocation[];
    technology: FilterTechnology[];
    skill_assessed: FilterSkill[];
  };
}

export const getTalentPoolFilters = async (): Promise<TalentPoolFiltersResponse> => {
  const response = await axios.get("/recruiter/talent-pool/filters");
  return response.data;
};

export interface LocationSearchResponse {
  success: boolean;
  message: string;
  data: {
    location: FilterLocation[];
    technology: FilterTechnology[];
    skill_assessed: FilterSkill[];
  };
}

export const searchTalentPoolLocations = async (
  location_search: string
): Promise<FilterLocation[]> => {
  const response = await axios.get("/recruiter/talent-pool/filters", {
    params: { location_search },
  });
  // Extract only location data from the response
  return response.data?.data?.location || [];
};
