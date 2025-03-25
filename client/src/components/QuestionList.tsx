import React, { useEffect, useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { QuestionListProps } from "../interfaces";
import QuestionItem from "./QuestionItem";
import SortableItem from "./SortableItem";

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  addQuestion,
  updateQuestionType,
  updateOptions,
  validationErrors,
}) => {
  const [localQuestions, setLocalQuestions] = useState(questions);

  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  return (
    <div className="mb-6">
      {localQuestions.length === 0 ? (
        <p className="text-gray-400">There are no questions</p>
      ) : (
          <SortableContext
            items={localQuestions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {localQuestions.map((q) => (
                <SortableItem key={q.id} id={q.id}>
                  <QuestionItem
                    question={q}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    updateQuestionType={updateQuestionType}
                    updateOptions={updateOptions}
                    error={validationErrors?.[q.id]}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
      )}

      {addQuestion && (
        <div className="mt-4">
          <button
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Add Question
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
