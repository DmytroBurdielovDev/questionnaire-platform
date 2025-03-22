import React, { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent 
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
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
}) => {
  const [localQuestions, setLocalQuestions] = React.useState(questions);

  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localQuestions.findIndex((q) => q.id === active.id);
    const newIndex = localQuestions.findIndex((q) => q.id === over.id);
    const newOrder = arrayMove(localQuestions, oldIndex, newIndex);
    setLocalQuestions(newOrder);
    // propagate new order to parent
    if (onEdit) {
      newOrder.forEach((q) => onEdit(q));
    }
  };

  return (
    <div className="mb-6">
     {localQuestions.length === 0 ? (
        <p className="text-gray-400">There are no questions</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localQuestions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {localQuestions.map((q) => (
                <SortableItem key={q.id} id={q.id}>
                  <QuestionItem
                    question={q}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    updateQuestionType={updateQuestionType!}
                    updateOptions={updateOptions!}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
