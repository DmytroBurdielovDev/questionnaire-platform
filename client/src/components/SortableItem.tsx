import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface Props {
  id: number;
  children: React.ReactNode;
}

const SortableItem: React.FC<Props> = ({ id, children }) => {
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
      className="relative bg-gray-700 p-4 rounded-lg border border-gray-600 flex items-start gap-4"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing transition select-none mt-1"
      >
        {/* Larger SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 4H4v2h6V4zm0 14H4v2h6v-2zm0-7H4v2h6v-2zm10-7h-6v2h6V4zm0 14h-6v2h6v-2zm0-7h-6v2h6v-2z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SortableItem;