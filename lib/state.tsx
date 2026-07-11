"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const STORAGE_KEY = "aceley:v1:state";

export type ThemePreference = "auto" | "light" | "dark";

export type Answers = {
  name: string;
  country: string;
  age: string;
  school: string;
  schoolCountry: string;
  major: string;
  source: string;
  subject: string;
  level: string;
  exam: string;
  examDate: string;
  hoursPerDay: string;
  weakTopics: string[];
};

export type SavedExplanation = {
  id: string;
  topic: string;
  style: string;
  preview: string;
  savedAt: string;
};

export type SavedQuiz = {
  id: string;
  title: string;
  score: string;
  date: string;
};

export type AskHistoryItem = {
  id: string;
  question: string;
  subject: string;
  answeredAt: string;
  verified: boolean;
};

export type Plan = {
  id: string;
  subject: string;
  examDate: string;
  totalDays: number;
  completedDays: number;
  createdAt: string;
  confidence?: string;
  hoursPerDay?: string;
};

export type StudySession = {
  id: string;
  minutes: number;
  preset: string;
  audio: string;
  endedAt: string;
};

export type AppState = {
  onboarded: boolean;
  answers: Answers;
  themePreference: ThemePreference;
  streak: number;
  hoursStudied: number;
  joinedSpaces: string[];
  savedExplanations: SavedExplanation[];
  savedQuizzes: SavedQuiz[];
  askHistory: AskHistoryItem[];
  plans: Plan[];
  studySessions: StudySession[];
  strongTopics: string[];
};

type AddPlanInput = {
  subject: string;
  examDate: string;
  totalDays?: number;
  completedDays?: number;
  confidence?: string;
  hoursPerDay?: string;
};

type RecordQuizInput = {
  id?: string;
  title: string;
  score: string;
  date?: string;
};

type RecordSessionInput = {
  minutes: number;
  preset: string;
  audio: string;
  endedAt?: string;
};

type AppStateContextValue = AppState & {
  hydrated: boolean;
  updateAnswers: (patch: Partial<Answers>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  toggleSpace: (id: string) => void;
  saveExplanation: (item: Omit<SavedExplanation, "id" | "savedAt"> & Partial<Pick<SavedExplanation, "id" | "savedAt">>) => void;
  removeSavedExplanation: (id: string) => void;
  recordQuiz: (item: RecordQuizInput) => void;
  addPlan: (item: AddPlanInput) => Plan;
  recordSession: (item: RecordSessionInput) => void;
  addStrongTopic: (topic: string) => void;
  addAskHistory: (item: Omit<AskHistoryItem, "id" | "answeredAt"> & Partial<Pick<AskHistoryItem, "id" | "answeredAt">>) => AskHistoryItem;
  setThemePreference: (preference: ThemePreference) => void;
  clearAllData: () => void;
};

export const defaultAnswers: Answers = {
  name: "",
  country: "",
  age: "",
  school: "",
  schoolCountry: "",
  major: "",
  source: "",
  subject: "Biology",
  level: "High school",
  exam: "",
  examDate: "",
  hoursPerDay: "",
  weakTopics: [],
};

export const defaultState: AppState = {
  onboarded: false,
  answers: defaultAnswers,
  themePreference: "auto",
  streak: 0,
  hoursStudied: 0,
  joinedSpaces: [],
  savedExplanations: [],
  savedQuizzes: [],
  askHistory: [],
  plans: [],
  studySessions: [],
  strongTopics: [],
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function makeId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function arrayOr<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function numberOr(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringOr(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function mergeState(value: unknown): AppState {
  if (!isObject(value)) {
    return defaultState;
  }

  const storedAnswers = isObject(value.answers) ? value.answers : {};
  const theme = value.themePreference;

  return {
    onboarded: typeof value.onboarded === "boolean" ? value.onboarded : defaultState.onboarded,
    answers: {
      ...defaultAnswers,
      name: stringOr(storedAnswers.name),
      country: stringOr(storedAnswers.country),
      age: stringOr(storedAnswers.age),
      school: stringOr(storedAnswers.school),
      schoolCountry: stringOr(storedAnswers.schoolCountry),
      major: stringOr(storedAnswers.major),
      source: stringOr(storedAnswers.source),
      subject: stringOr(storedAnswers.subject, defaultAnswers.subject),
      level: stringOr(storedAnswers.level, defaultAnswers.level),
      exam: stringOr(storedAnswers.exam),
      examDate: stringOr(storedAnswers.examDate),
      hoursPerDay: stringOr(storedAnswers.hoursPerDay),
      weakTopics: arrayOr<string>(storedAnswers.weakTopics, []),
    },
    themePreference: theme === "light" || theme === "dark" || theme === "auto" ? theme : "auto",
    streak: numberOr(value.streak, defaultState.streak),
    hoursStudied: numberOr(value.hoursStudied, defaultState.hoursStudied),
    joinedSpaces: arrayOr<string>(value.joinedSpaces, []),
    savedExplanations: arrayOr<SavedExplanation>(value.savedExplanations, []),
    savedQuizzes: arrayOr<SavedQuiz>(value.savedQuizzes, []),
    askHistory: arrayOr<AskHistoryItem>(value.askHistory, []),
    plans: arrayOr<Plan>(value.plans, []),
    studySessions: arrayOr<StudySession>(value.studySessions, []),
    strongTopics: arrayOr<string>(value.strongTopics, []),
  };
}

function applyTheme() {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = "light";
  root.classList.remove("dark");
  root.style.colorScheme = "light";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    let nextState = defaultState;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      nextState = raw ? mergeState(JSON.parse(raw)) : defaultState;
    } catch {
      nextState = defaultState;
    }

    queueMicrotask(() => {
      if (!active) {
        return;
      }

      setState(nextState);
      setHydrated(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    applyTheme();
  }, [hydrated, state.themePreference]);

  const updateAnswers = useCallback((patch: Partial<Answers>) => {
    setState((current) => ({
      ...current,
      answers: {
        ...current.answers,
        ...patch,
      },
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((current) => ({ ...current, onboarded: true }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState((current) => ({ ...current, onboarded: false }));
  }, []);

  const toggleSpace = useCallback((id: string) => {
    setState((current) => {
      const joined = current.joinedSpaces.includes(id)
        ? current.joinedSpaces.filter((spaceId) => spaceId !== id)
        : [...current.joinedSpaces, id];

      return { ...current, joinedSpaces: joined };
    });
  }, []);

  const saveExplanation = useCallback<AppStateContextValue["saveExplanation"]>((item) => {
    setState((current) => {
      const id = item.id ?? makeId("explain");
      const savedAt = item.savedAt ?? new Date().toISOString();
      const next = {
        id,
        topic: item.topic,
        style: item.style,
        preview: item.preview,
        savedAt,
      };

      return {
        ...current,
        savedExplanations: [
          next,
          ...current.savedExplanations.filter((saved) => saved.id !== id),
        ],
      };
    });
  }, []);

  const removeSavedExplanation = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      savedExplanations: current.savedExplanations.filter((item) => item.id !== id),
    }));
  }, []);

  const recordQuiz = useCallback((item: RecordQuizInput) => {
    setState((current) => {
      const id = item.id ?? makeId("quiz");
      if (current.savedQuizzes.some((quiz) => quiz.id === id)) {
        return current;
      }

      return {
        ...current,
        savedQuizzes: [
          { id, title: item.title, score: item.score, date: item.date ?? new Date().toISOString() },
          ...current.savedQuizzes,
        ],
      };
    });
  }, []);

  const addPlan = useCallback((item: AddPlanInput) => {
    const createdAt = new Date().toISOString();
    const plan: Plan = {
      id: makeId("plan"),
      subject: item.subject,
      examDate: item.examDate,
      totalDays: item.totalDays ?? 14,
      completedDays: item.completedDays ?? 0,
      createdAt,
      confidence: item.confidence,
      hoursPerDay: item.hoursPerDay,
    };

    setState((current) => ({
      ...current,
      answers: {
        ...current.answers,
        subject: item.subject || current.answers.subject,
        examDate: item.examDate || current.answers.examDate,
        hoursPerDay: item.hoursPerDay || current.answers.hoursPerDay,
      },
      plans: [plan, ...current.plans],
    }));

    return plan;
  }, []);

  const recordSession = useCallback((item: RecordSessionInput) => {
    setState((current) => ({
      ...current,
      hoursStudied: Math.round((current.hoursStudied + item.minutes / 60) * 10) / 10,
      studySessions: [
        {
          id: makeId("session"),
          minutes: item.minutes,
          preset: item.preset,
          audio: item.audio,
          endedAt: item.endedAt ?? new Date().toISOString(),
        },
        ...current.studySessions,
      ],
    }));
  }, []);

  const addStrongTopic = useCallback((topic: string) => {
    const cleaned = topic.trim();
    if (!cleaned) {
      return;
    }

    setState((current) => ({
      ...current,
      strongTopics: current.strongTopics.includes(cleaned)
        ? current.strongTopics
        : [cleaned, ...current.strongTopics],
    }));
  }, []);

  const addAskHistory = useCallback<AppStateContextValue["addAskHistory"]>((item) => {
    const saved: AskHistoryItem = {
      id: item.id ?? makeId("ask"),
      question: item.question,
      subject: item.subject,
      answeredAt: item.answeredAt ?? new Date().toISOString(),
      verified: item.verified,
    };

    setState((current) => ({
      ...current,
      askHistory: [saved, ...current.askHistory.filter((history) => history.id !== saved.id)].slice(0, 30),
    }));

    return saved;
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setState((current) => ({ ...current, themePreference: preference }));
  }, []);

  const clearAllData = useCallback(() => {
    window.localStorage.clear();
    setState(defaultState);
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      ...state,
      hydrated,
      updateAnswers,
      completeOnboarding,
      resetOnboarding,
      toggleSpace,
      saveExplanation,
      removeSavedExplanation,
      recordQuiz,
      addPlan,
      recordSession,
      addStrongTopic,
      addAskHistory,
      setThemePreference,
      clearAllData,
    }),
    [
      state,
      hydrated,
      updateAnswers,
      completeOnboarding,
      resetOnboarding,
      toggleSpace,
      saveExplanation,
      removeSavedExplanation,
      recordQuiz,
      addPlan,
      recordSession,
      addStrongTopic,
      addAskHistory,
      setThemePreference,
      clearAllData,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return value;
}

export function daysUntil(date: string) {
  if (!date) {
    return null;
  }

  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target.getTime() - start.getTime();

  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function planProgress(plan: Plan) {
  if (!plan.totalDays) {
    return 0;
  }

  return Math.round((plan.completedDays / plan.totalDays) * 100);
}
