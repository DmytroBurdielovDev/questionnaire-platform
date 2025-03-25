import React from "react";
import { Question, QuestionItemProps } from "../interfaces";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableOptionItem from "./SortableOptionItem";

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onEdit,
  onDelete,
  updateQuestionType,
  updateOptions,
  error,
}) => {
  const { id, text, type, options = [] } = question;
  const sensors = useSensors(useSensor(PointerSensor));

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    updateOptions(id, updated);
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const reordered = arrayMove(options, oldIndex, newIndex);
    updateOptions(id, reordered);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
      {/* Question text input */}
      <label htmlFor={`question-text-${id}`} className="sr-only">
        Question Text
      </label>
      <input
        id={`question-text-${id}`}
        name={`question-text-${id}`}
        type="text"
        value={text}
        onChange={(e) => onEdit({ ...question, text: e.target.value })}
        className={`w-full p-2 rounded bg-gray-700 text-white border ${error?.question ? "border-red-500 focus:ring-red-500" : "border-gray-500 focus:ring-blue-500"
          } focus:ring-2 outline-none mb-1`}
        placeholder="Enter question..."
        autoComplete="off"
      />
      {error?.question && (
        <p className="text-red-400 text-sm mt-1">{error.question}</p>
      )}

      {/* Question type select */}
      <select
        id={`question-type-${id}`}
        name={`question-type-${id}`}
        value={type}
        onChange={(e) => updateQuestionType(id, e.target.value as Question["type"])}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
      >
        <option value="text">Text</option>
        <option value="single-choice">Single Choice</option>
        <option value="multiple-choice">Multiple Choice</option>
      </select>

      {type !== "text" && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">Options:</p>

          <DndContext
            sensors={sensors}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) return;

              const oldIndex = Number(active.id);
              const newIndex = Number(over.id);

              if (!isNaN(oldIndex) && !isNaN(newIndex)) {
                handleReorder(oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={options.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {options.map((opt, index) => (
                  <SortableOptionItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    value={opt}
                    onChange={(val) => handleOptionChange(index, val)}
                    onDelete={() =>
                      updateOptions(id, options.filter((_, i) => i !== index))
                    }
                    hasError={!!error?.options?.[index]}
                    errorMessage={error?.options?.[index]}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {options.filter((o) => o.trim()).length < 2 && (
            <p className="text-red-400 text-sm mt-2">
              At least two options must be filled in.
            </p>
          )}

          <button
            onClick={() => updateOptions(id, [...options, ""])}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mt-4"
          >
            ➕ Add Option
          </button>
        </div>
      )}

      {/* Delete question button */}
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
