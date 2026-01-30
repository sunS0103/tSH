import axios from "./axios";

export const getCities = async (
  countryId: number | string,
  page: number,
  searchQuery?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = { page };

  if (countryId) {
    params.country_id = countryId;
  }

  if (searchQuery) {
    params.query = searchQuery;
  }

  const response = await axios.get("/seeder/city", { params });
  return response.data;
};

export const getCountries = async (page: number, query?: string) => {
  const response = await axios.get("/seeder/country", {
    params: { page, ...(query && { query }) },
  });
  return response.data;
};

export const getCityById = async (id: string) => {
  const response = await axios.get(`/seeder/city/${id}`);
  return response.data;
};

export const getCountryById = async (id: string) => {
  const response = await axios.get(`/seeder/country/${id}`);
  return response.data;
};

export const getWorkModes = async () => {
  const response = await axios.get("/seeder/workmode");
  return response.data;
};

export const getSkills = async () => {
  const response = await axios.get("/seeder/skills");
  return response.data;
};

export const getSkillCategories = async () => {
  const response = await axios.get("/seeder/category");
  return response.data;
};
