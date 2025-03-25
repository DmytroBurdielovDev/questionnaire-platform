import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  hasError?: boolean;
  errorMessage?: string;
}

const SortableOptionItem: React.FC<Props> = ({
  id,
  index,
  value,
  onChange,
  onDelete,
  hasError,
  errorMessage,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col bg-gray-700 p-2 rounded border border-gray-600"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          ☰
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 p-2 rounded bg-gray-800 text-white border ${
            hasError && errorMessage ? "border-red-500" : "border-gray-500"
          } focus:ring-2 focus:ring-blue-500 outline-none`}
          placeholder={`Option ${index + 1}`}
          id={`option-${id}`}
          name={`option-${id}`}
        />

        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-2 rounded text-sm"
        >
          ❌
        </button>
      </div>

      {hasError && errorMessage && (
        <p className="text-red-400 text-xs mt-1 ml-8">{errorMessage}</p>
      )}
    </div>
  );
};

export default SortableOptionItem;
