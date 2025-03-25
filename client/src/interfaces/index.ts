import { ReactNode } from "react";

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'single-choice' | 'multiple-choice';
  options?: string[];
}

export interface Props {
  id: number;
  children: React.ReactNode;
}

export interface CompletionStat {
  date: string;
  count: number;
}

export interface AnswerStat {
  [questionId: number]: {
    questionText: string;
    options: {
      label: string;
      count: number;
    }[];
  };
}

export interface CompletionStat {
  date: string;
  count: number;
}

export interface CompletionEntry {
  date: string;
  count: number;
}

export interface AnswerOptionStat {
  label: string;
  count: number;
}

export interface QuestionAnswerStat {
  questionText: string;
  options: AnswerOptionStat[];
}

export interface AverageTimeStat {
  averageTime: number; // in seconds
}

export interface PieChartAnswer {
  label: string;
  count: number;
}

export interface QuestionPieData {
  questionId: number;
  questionText: string;
  options: PieChartAnswer[];
}

export interface SurveyResponse {
  questionnaireId: number;
  answers: { questionId: number; response: string | string[] }[];
  duration: number | null;
}

export interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export interface SortableItemProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  index: number;
  hasError: boolean;
  errorMessage?: string;
}

export interface Questionnaire {
  questionCount: ReactNode;
  completionsCount: number;
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

export interface QuestionItemProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
  updateQuestionType: (id: number, type: Question['type']) => void;
  updateOptions: (id: number, newOptions: string[]) => void;
  showValidation?: boolean;
  error?: {
    question?: string;
    options?: string[];
  };
}

export interface QuestionnaireFormProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  nameError?: string | null;
  descError?: string | null;
  }

export interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
  addQuestion: () => void;
  updateQuestionType: (id: number, type: Question['type']) => void;
  updateOptions: (id: number, newOptions: string[]) => void;
  onReorder?: (newOrder: Question[]) => void;
  validationErrors?: Record<number, { question?: string; options?: string[] }>;
}

export interface Answer {
  questionId: number;
  response: string | string[];
}