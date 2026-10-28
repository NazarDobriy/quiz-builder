export type QuestionType = 'boolean' | 'input' | 'checkbox';

export type OptionInput = {
  text: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  text: string;
  type: QuestionType;
  correctAnswer?: string;
  options?: OptionInput[];
};

export type QuizInput = {
  title: string;
  questions: QuestionInput[];
};

export type Question = QuestionInput & {
  id: number;
  position: number;
  options?: (OptionInput & {
    id: number;
  })[];
};

export type Quiz = {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
};

export type QuizSummary = {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
};
