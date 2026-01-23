import axios from "./axios";

export const getCities = async (
  countryName: string,
  page: number,
  searchQuery?: string
) => {
  const params: { page: number; query?: string } = { page };

  // If searchQuery is provided, use it; otherwise use countryName if provided
  if (searchQuery) {
    params.query = searchQuery;
  } else if (countryName) {
    params.query = countryName;
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
