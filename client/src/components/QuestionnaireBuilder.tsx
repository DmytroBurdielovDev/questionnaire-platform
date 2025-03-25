import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  createQuestionnaire,
  getQuestionnaireById,
  updateQuestionnaire,
} from "../api/questionnaireApi";

import QuestionnaireForm from "./QuestionnaireForm";
import QuestionList from "./QuestionList";
import ToastNotification from "./ToastNotification";
import { Question } from "../interfaces";

const QuestionnaireBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<number, { question?: string; options?: string[] }>>({});
  const [nameError, setNameError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<number, { question?: string; options?: string[] }>>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      getQuestionnaireById(Number(id)).then((data) => {
        setName(data.name);
        setDescription(data.description);
        setQuestions(data.questions || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleEdit = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  const handleDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      type: "text",
      options: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestionType = (id: number, type: Question["type"]) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, type, options: type === "text" ? [] : q.options || [] }
          : q
      )
    );
  };

  const updateOptions = (id: number, options: string[]) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options } : q))
    );
  };

  const validate = () => {
    const newErrors: Record<number, { question?: string; options?: string[] }> = {};
  
    if (questions.length === 0) {
      alert("⚠️ You must add at least one question before saving.");
      return false;
    }
  
    questions.forEach((q) => {
      const questionError: { question?: string; options?: string[] } = {};
  
      if (!q.text.trim()) {
        questionError.question = "Question text is required.";
      }
  
      if (q.type === "single-choice" || q.type === "multiple-choice") {
        const trimmedOptions = q.options?.map((opt) => opt.trim()) || [];
        const filledOptions = trimmedOptions.filter((opt) => opt !== "");
        const optionErrors = trimmedOptions.map((opt) => (opt === "" ? "Required" : ""));
  
        if (filledOptions.length < 2) {
          questionError.options = optionErrors;
        } else if (optionErrors.some(Boolean)) {
          questionError.options = optionErrors;
        }
      }
  
      if (Object.keys(questionError).length > 0) {
        newErrors[q.id] = questionError;
      }
    });
  
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async () => {
    if (!validate()) {
      alert("⚠️ Please fix validation errors.");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await updateQuestionnaire(Number(id), { name, description, questions });
      } else {
        await createQuestionnaire({ name, description, questions });
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("❌ Failed to save questionnaire:", error);
      alert("❌ Failed to save. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(questions, oldIndex, newIndex);
    setQuestions(reordered);
  };

  if (loading) {
    return <p className="text-center text-gray-400 mt-10">Loading questionnaire...</p>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen w-screen bg-gray-900 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {id ? "Edit Questionnaire" : "Create New Questionnaire"}
        </h2>

        <QuestionnaireForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          nameError={nameError}
        />

        <h3 className="text-lg text-white font-semibold mb-2">Added Questions</h3>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <QuestionList
              questions={questions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              addQuestion={addQuestion}
              updateQuestionType={updateQuestionType}
              updateOptions={updateOptions}
              validationErrors={errors}
            />
          </SortableContext>
        </DndContext>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 active:scale-95"
          >
            {saving ? "Saving..." : "💾 Save Questionnaire"}
          </button>
        </div>

        {showToast && (
          <ToastNotification
            message="✅ Questionnaire saved!"
            duration={1500}
            onClose={() => setShowToast(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default QuestionnaireBuilder;
