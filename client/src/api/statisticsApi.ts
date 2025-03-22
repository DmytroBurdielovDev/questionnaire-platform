import { api } from '.';

const BASE_URL = "/statistics";

export const fetchCompletionStats = async (questionnaireId: number, period: "day" | "week" | "month" = "day" ) => {
  const response = await api.get(`${BASE_URL}/${questionnaireId}/completions`, {
    params: { period },
  });
  return response.data; 
};

export const fetchAnswerStats = async (questionnaireId: number) => {
  const response = await api.get(`${BASE_URL}/${questionnaireId}/answer-stats`);
  return response.data; 
};

export const fetchAverageTime = async (questionnaireId: number) => {
  const response = await api.get(`${BASE_URL}/${questionnaireId}/average-duration`);
  return response.data; 
};
