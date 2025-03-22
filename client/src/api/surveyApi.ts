import { api } from '.';
import { SurveyResponse } from '../interfaces';


export const submitSurveyResponse = async (response: SurveyResponse) => {
    try {
        const { data } = await api.post('/responses', response);
        return data;
    } catch (error) {
        console.error('Error submitting survey response:', error);
        throw error;
    }
};