import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionnaireById } from '../api/questionnaireApi';
import { Answer, Question } from '../interfaces';



const SurveyForm = () => {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<{ name: string; description: string; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (id) {
      getQuestionnaireById(Number(id)).then((data) => {
        setQuestionnaire(data);
        setAnswers(
          data.questions.map((q: Question) => ({
            questionId: q.id,
            response: q.type === 'multiple-choice' ? [] : '',
          }))
        );
      });
    }
  }, [id]);

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, response: value } : answer
      )
    );
  };

  const handleSubmit = async () => {
    console.log('Отправленные ответы:', answers);
    alert('Ваши ответы отправлены!');
  };

  if (!questionnaire) return <p>Loading...</p>;

  return (
    <div>
      <h2>{questionnaire.name}</h2>
      <p>{questionnaire.description}</p>
      <form onSubmit={(e) => e.preventDefault()}>
        {questionnaire.questions.map((question: Question) => (
          <div key={question.id}>
            <p>{question.text}</p>
            {question.type === 'text' && (
              <input
                type="text"
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}
            {question.type === 'single-choice' && question.options && (
              question.options.map((opt: string, index: number) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={opt}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  {opt}
                </label>
              ))
            )}
            {question.type === 'multiple-choice' && question.options && (
              question.options.map((opt: string, index: number) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={opt}
                    onChange={(event) => {
                        const currentAnswer = answers.find((answer) => answer.questionId === question.id)?.response;
                        const newResponse = Array.isArray(currentAnswer)
                          ? event.target.checked
                            ? [...currentAnswer, opt] 
                            : currentAnswer.filter((res) => res !== opt)
                          : [opt];
              
                        handleAnswerChange(question.id, newResponse);
                      }}
                  />
                  {opt}
                </label>
              ))
            )}
          </div>
        ))}
        <button onClick={handleSubmit}>Send response</button>
      </form>
    </div>
  );
};

export default SurveyForm;