import type { Quiz } from "../../student/types";
import { STUDENT_QUIZZES } from "../../student/data/quiz-data";

export const CUSTOM_QUIZZES_STORAGE_KEY = "study_compass_custom_quizzes_v1";

/**
 * Retrieves all custom quizzes authored by administrators from localStorage.
 */
export function getCustomQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load custom quizzes from localStorage:", err);
    return [];
  }
}

/**
 * Returns all quizzes: built-in defaults merged with authored custom quizzes.
 */
export function getAllQuizzes(): Quiz[] {
  const custom = getCustomQuizzes();
  if (custom.length === 0) return STUDENT_QUIZZES;

  const customIds = new Set(custom.map((q) => q.id));
  const builtIns = STUDENT_QUIZZES.filter((q) => !customIds.has(q.id));
  return [...custom, ...builtIns];
}

/**
 * Saves or updates a custom quiz in localStorage and broadcasts an update event.
 */
export function saveCustomQuiz(quiz: Quiz): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomQuizzes();
    const index = existing.findIndex((q) => q.id === quiz.id);

    let updated: Quiz[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...quiz, isCustom: true };
    } else {
      updated = [{ ...quiz, isCustom: true }, ...existing];
    }

    localStorage.setItem(CUSTOM_QUIZZES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("quizzes-updated", { detail: { quizId: quiz.id } }));
  } catch (err) {
    console.error("Failed to save custom quiz to localStorage:", err);
  }
}

/**
 * Deletes a custom quiz by ID and broadcasts an update event.
 */
export function deleteCustomQuiz(quizId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const existing = getCustomQuizzes();
    const filtered = existing.filter((q) => q.id !== quizId);
    if (filtered.length === existing.length) return false;

    localStorage.setItem(CUSTOM_QUIZZES_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("quizzes-updated", { detail: { deletedId: quizId } }));
    return true;
  } catch (err) {
    console.error("Failed to delete custom quiz from localStorage:", err);
    return false;
  }
}
