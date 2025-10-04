import axios from "axios";

export const baseURLl = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: baseURLl,
});

export const generateResume = async (description) => {
  const response = await axiosInstance.post("/api/v1/resume/generate", {
    userDescription: description,
  });

  return response.data;
};
