import axios from "./axios";

export const getContact = async (email: string) => {
  const response = await axios.get(`/brevo/contacts/${encodeURIComponent(email)}`);
  return response.data;
};

export const getImports = async ({ data }: { data: any }) => {
  const response = await axios.post("/brevo/contacts/import", data);
  return response.data;
};
