import create from "zustand";
import { Answer, Exam, Examplay, Examsession, Question } from "../types/type";

interface ExamState {
  exam?: Exam;
  examsession?: Examsession;
  examplay?: Examplay;
  isBegin: boolean;
  setExam: (e: Exam) => void;
  setExamsession: (e: Examsession | undefined) => void;
  setExamplay: (e: Examplay) => void;
  setIsBegin: (e: boolean) => void;
  questionsMaps: QMap;
  answersMaps: AMap;
  setQuestionsMaps: (e: QMap) => void;
  setAnswersMaps: (e: AMap) => void;
}

type QMap = Record<string, Partial<Question>>;
type AMap = Record<string, Partial<Answer>>;

export const useExamStore = create<ExamState>((set) => ({
  exam: undefined,
  examsession: undefined,
  examplay: undefined,
  isBegin: false,
  setExam: (exam) => set((state) => ({ exam })),
  setIsBegin: (isBegin) => set((state) => ({ isBegin })),
  setExamsession: (examsession) => set((state) => ({ examsession })),
  setExamplay: (examplay) => set((state) => ({ examplay })),
  questionsMaps: {},
  setQuestionsMaps: (questionsMaps: QMap) => set({ questionsMaps }),
  answersMaps: {},
  setAnswersMaps: (answersMaps: AMap) => set({ answersMaps }),
}));
