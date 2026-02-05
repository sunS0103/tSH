import axios from "../axios"

export const getRequestAssessment = async () => {
    const response = await axios.get("/recruiter/request-assessment");
    return response.data;
};
