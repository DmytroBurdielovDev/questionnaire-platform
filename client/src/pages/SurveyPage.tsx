import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionnaireById } from '../api/questionnaireApi';
import { Questionnaire } from '../interfaces';
import { submitSurveyResponse } from '../api/surveyApi';

const SurveyPage = () => {
  const { id } = useParams();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; response: string | string[] }[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ [questionId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const localKey = `survey-progress-${id}`;

  const fetchQuestionnaire = async () => {
    try {
      setLoading(true);
      setStartTime(new Date());
      setError(null);
      const data = await getQuestionnaireById(Number(id));
      setQuestionnaire(data);

      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) {
          setAnswers(parsed.answers);
        }
      }
    } catch (err) {
      console.error('Failed to fetch questionnaire:', err);
      setError('Failed to load the survey. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuestionnaire();
  }, [id]);

  const persistAnswers = (newAnswers: typeof answers) => {
    setAnswers(newAnswers);
    localStorage.setItem(localKey, JSON.stringify({ answers: newAnswers }));
  };

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    const updated = answers.some((a) => a.questionId === questionId)
      ? answers.map((a) =>
          a.questionId === questionId ? { ...a, response: value } : a
        )
      : [...answers, { questionId, response: value }];

    persistAnswers(updated);

    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleCheckboxChange = (questionId: number, option: string) => {
    const existing = answers.find((a) => a.questionId === questionId);
    let newOptions: string[] = [];

    if (existing && Array.isArray(existing.response)) {
      newOptions = existing.response.includes(option)
        ? existing.response.filter((r) => r !== option)
        : [...existing.response, option];
    } else {
      newOptions = [option];
    }

    handleAnswerChange(questionId, newOptions);
  };

  const handleSubmit = () => {
    const errors: { [questionId: number]: string } = {};

    questionnaire?.questions.forEach((q) => {
      const answer = answers.find((a) => a.questionId === q.id)?.response;
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        errors[q.id] = 'This question is required.';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setShowSummary(true);
  };

  const confirmSubmission = async () => {
    try {
      const now = Date.now();
      const calculatedDuration = startTime ? Math.floor((now - startTime.getTime()) / 1000) : null;
  

      await submitSurveyResponse({
        questionnaireId: Number(id),
        answers,
        duration: calculatedDuration,
      });

      setEndTime(new Date());
      setSubmitted(true);
      setAnswers([]);
      localStorage.removeItem(localKey);
    } catch {
      alert('❌ Failed to submit the survey. Please try again later.');
    }
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min}m ${sec}s`;
  };

  const answeredCount = questionnaire
    ? questionnaire.questions.filter((q) => {
        const a = answers.find((a) => a.questionId === q.id)?.response;
        return a && (typeof a === 'string' ? a.trim() !== '' : a.length > 0);
      }).length
    : 0;

  if (loading) return <p className="text-center text-gray-400 mt-10">Loading survey...</p>;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
        <button
          onClick={fetchQuestionnaire}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          🔁 Try Again
        </button>
      </div>
    );
  }

  if (!questionnaire) return <p className="text-center text-red-500 mt-10">Survey not found.</p>;

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen w-screen bg-gray-900">
        <div className="bg-gray-800 px-8 py-6 rounded-lg shadow-lg border border-gray-700 text-center">
          <p className="text-green-400 text-3xl font-bold mb-4">✅ Thank you for your response!</p>
          {startTime && endTime && (
            <p className="text-gray-300 text-lg mb-4">⏱️ Completed in {formatDuration(startTime, endTime)}</p>
          )}
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            🔙 Back to Questionnaire List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">{questionnaire.name}</h1>
        <p className="text-gray-300 mb-6 text-center">{questionnaire.description}</p>

        <p className="text-sm text-gray-400 mb-4 text-center">
          📝 Answered {answeredCount} of {questionnaire.questions.length} questions
        </p>

        {showSummary ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center mb-4">🧾 Review your answers</h2>
            {questionnaire.questions.map((q) => {
              const answer = answers.find((a) => a.questionId === q.id)?.response;
              return (
                <div key={q.id} className="bg-gray-700 p-4 rounded border border-gray-600">
                  <p className="text-white font-medium mb-1">{q.text}</p>
                  <p className="text-gray-300">
                    {Array.isArray(answer) ? answer.join(', ') : answer || 'No answer'}
                  </p>
                </div>
              );
            })}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition"
              >
                🔙 Edit Answers
              </button>
              <button
                onClick={confirmSubmission}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                ✅ Confirm & Submit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-6">
            {questionnaire.questions.map((question) => (
              <div
                key={question.id}
                className="w-full bg-gray-700 p-4 rounded-lg border border-gray-600"
              >
                <p className="text-white font-medium mb-2">{question.text}</p>

                {question.type === 'text' && (
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 transition"
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    value={
                      answers.find((a) => a.questionId === question.id)?.response as string || ''
                    }
                  />
                )}

                {question.type === 'single-choice' && (
                  <div className="flex flex-col gap-2">
                    {question.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={opt}
                          checked={answers.find((a) => a.questionId === question.id)?.response === opt}
                          onChange={() => handleAnswerChange(question.id, opt)}
                          className="w-5 h-5"
                        />
                        <span className="text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'multiple-choice' && (
                  <div className="flex flex-col gap-2">
                    {question.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 bg-gray-700 rounded-md hover:bg-gray-600">
                        <input
                          type="checkbox"
                          checked={(answers.find((a) => a.questionId === question.id)?.response as string[])?.includes(opt)}
                          onChange={() => handleCheckboxChange(question.id, opt)}
                          className="w-5 h-5"
                        />
                        <span className="text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {validationErrors[question.id] && (
                  <p className="text-red-400 text-sm mt-2">{validationErrors[question.id]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md text-lg transition"
            >
              ✅ Submit Survey
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;