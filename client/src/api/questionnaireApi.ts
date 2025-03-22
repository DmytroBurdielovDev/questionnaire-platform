import { api } from '.';
import { Questionnaire } from '../interfaces';

const DEFAULT_LIMIT = 6;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY = 'name';

export const getQuestionnaires = async (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sortBy = DEFAULT_SORT_BY) => {
  const { data } = await api.get(`/questionnaires?page=${page}&limit=${limit}&sortBy=${sortBy}`);
  return data;
};

export const getQuestionnaireById = async (id: number): Promise<Questionnaire> => {
  const { data } = await api.get<Questionnaire>(`/questionnaires/${id}`);
  return data;
};

export const createQuestionnaire = async (questionnaire: Partial<Questionnaire>): Promise<Questionnaire> => {
  const { data } = await api.post<Questionnaire>('/questionnaires', questionnaire);
  return data;
};

export const updateQuestionnaire = async (id: number, questionnaire: Partial<Questionnaire>): Promise<Questionnaire> => {
  const { data } = await api.put<Questionnaire>(`/questionnaires/${id}`, questionnaire);
  return data;
};

export const deleteQuestionnaire = async (id: number): Promise<void> => {
  await api.delete(`/questionnaires/${id}`);
};
