import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Step 1: 기본정보 ─────────────────────────────────────────────────────────
export type CategoryType = 'ACADEMIC' | 'RESEARCH' | 'CAMPUS' | 'OTHER';

export interface Step1Data {
  title: string;
  description: string;
  category: CategoryType | '';
  targetAll: boolean;
  targetDepartments: string[];
  targetGrades: number[];
  maxResponses: number;
  deadline: string;
  estimatedMinutes: number;
}

// ── Step 2: 질문작성 ─────────────────────────────────────────────────────────
export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'SCALE'
  | 'MATRIX';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Step2Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  isRequired: boolean;
  // SINGLE_CHOICE / MULTIPLE_CHOICE
  options?: QuestionOption[];
  // SCALE
  scaleMin?: number;
  scaleMax?: number;
  scaleLabelMin?: string;
  scaleLabelMax?: string;
  // MATRIX
  matrixRows?: QuestionOption[];
  matrixColumns?: QuestionOption[];
}

export interface Step2Data {
  questions: Step2Question[];
}

// ── Step 3: 보상설정 ─────────────────────────────────────────────────────────
export type RewardType = 'POINT' | 'GIFTCARD' | 'CUSTOM';

export interface Step3Data {
  rewardType: RewardType;
  // POINT
  rewardAmount: number;        // 1인당 포인트
  // GIFTCARD
  giftcardName: string;        // 상품명
  giftcardWinners: number;     // 당첨자 수
  giftcardDescription: string; // 상품 설명
  // CUSTOM
  rewardDescription: string;   // 자유 기술
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function genId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function createDefaultQuestion(): Step2Question {
  return {
    id: genId(),
    type: 'SINGLE_CHOICE',
    title: '',
    isRequired: false,
    options: [{ id: genId(), text: '선택지 1' }],
  };
}

// ── Store ─────────────────────────────────────────────────────────────────────
interface SurveyCreateState {
  currentStep: number;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;

  setCurrentStep: (step: number) => void;
  setStep1: (data: Partial<Step1Data>) => void;
  setStep2: (data: Partial<Step2Data>) => void;
  setStep3: (data: Partial<Step3Data>) => void;

  // Step 2 question actions
  addQuestion: (question: Step2Question, afterIndex?: number) => void;
  updateQuestion: (id: string, updates: Partial<Step2Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  reorderQuestions: (questions: Step2Question[]) => void;

  reset: () => void;
}

const defaultStep1: Step1Data = {
  title: '',
  description: '',
  category: '',
  targetAll: true,
  targetDepartments: [],
  targetGrades: [],
  maxResponses: 100,
  deadline: '',
  estimatedMinutes: 5,
};

const defaultStep2: Step2Data = { questions: [] };

const defaultStep3: Step3Data = {
  rewardType: 'POINT',
  rewardAmount: 300,
  giftcardName: '',
  giftcardWinners: 1,
  giftcardDescription: '',
  rewardDescription: '',
};

export const useSurveyCreateStore = create<SurveyCreateState>()(
  persist(
    (set) => ({
      currentStep: 1,
      step1: defaultStep1,
      step2: defaultStep2,
      step3: defaultStep3,

      setCurrentStep: (step) => set({ currentStep: step }),
      setStep1: (data) => set((s) => ({ step1: { ...s.step1, ...data } })),
      setStep2: (data) => set((s) => ({ step2: { ...s.step2, ...data } })),
      setStep3: (data) => set((s) => ({ step3: { ...s.step3, ...data } })),

      addQuestion: (question, afterIndex) =>
        set((s) => {
          const next = [...s.step2.questions];
          const at = afterIndex !== undefined ? afterIndex + 1 : next.length;
          next.splice(at, 0, question);
          return { step2: { ...s.step2, questions: next } };
        }),

      updateQuestion: (id, updates) =>
        set((s) => ({
          step2: {
            ...s.step2,
            questions: s.step2.questions.map((q) =>
              q.id === id ? { ...q, ...updates } : q
            ),
          },
        })),

      deleteQuestion: (id) =>
        set((s) => ({
          step2: {
            ...s.step2,
            questions: s.step2.questions.filter((q) => q.id !== id),
          },
        })),

      duplicateQuestion: (id) =>
        set((s) => {
          const idx = s.step2.questions.findIndex((q) => q.id === id);
          if (idx === -1) return s;
          const copy: Step2Question = { ...s.step2.questions[idx], id: genId() };
          const next = [...s.step2.questions];
          next.splice(idx + 1, 0, copy);
          return { step2: { ...s.step2, questions: next } };
        }),

      reorderQuestions: (questions) =>
        set((s) => ({ step2: { ...s.step2, questions } })),

      reset: () =>
        set({ currentStep: 1, step1: defaultStep1, step2: defaultStep2, step3: defaultStep3 }),
    }),
    {
      name: 'survey-create-draft',
    }
  )
);
