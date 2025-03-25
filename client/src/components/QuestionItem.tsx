import React from 'react';
import { Question } from '../interfaces';

interface Props {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
  updateQuestionType: (id: number, type: Question['type']) => void;
  updateOptions: (id: number, newOptions: string[]) => void;
}

const QuestionItem: React.FC<Props> = ({
  question,
  onEdit,
  onDelete,
  updateQuestionType,
  updateOptions
}) => {
  const { id, text, type, options = [] } = question;

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
      {/* Question text input */}
      <label htmlFor={`question-text-${id}`} className="sr-only">Question Text</label>
      <input
        id={`question-text-${id}`}
        name={`question-text-${id}`}
        type="text"
        value={text}
        onChange={(e) => onEdit({ ...question, text: e.target.value })}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
        placeholder="Enter question..."
        autoComplete="off"
      />

      {/* Select question type */}
      <label htmlFor={`question-type-${id}`} className="sr-only">Question Type</label>
      <select
        id={`question-type-${id}`}
        name={`question-type-${id}`}
        value={type}
        onChange={(e) => updateQuestionType(id, e.target.value as Question['type'])}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
      >
        <option value="text">Text</option>
        <option value="single-choice">Single Choice</option>
        <option value="multiple-choice">Multiple Choice</option>
      </select>

      {/* Options for choice questions */}
      {type !== 'text' && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">Options:</p>
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <label htmlFor={`question-${id}-option-${index}`} className="sr-only">
                Option {index + 1}
              </label>
              <input
                id={`question-${id}-option-${index}`}
                name={`question-${id}-option-${index}`}
                type="text"
                value={opt}
                onChange={(e) => {
                  const updated = [...options];
                  updated[index] = e.target.value;
                  updateOptions(id, updated);
                }}
                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Option ${index + 1}`}
                autoComplete="off"
              />
              <button
                onClick={() => {
                  const updated = options.filter((_, i) => i !== index);
                  updateOptions(id, updated);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-2 rounded text-sm"
              >
                ❌
              </button>
            </div>
          ))}

          <button
            onClick={() => updateOptions(id, [...options, ''])}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mt-2"
          >
            ➕ Add Option
          </button>
        </div>
      )}

      {/* Delete question */}
      <button
        onClick={() => onDelete(id)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm mt-2"
      >
        🗑️ Delete Question
      </button>
    </div>
  );
};

export default QuestionItem;
