import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import TheorySection from "@/components/TheorySection";
import TrainerSection from "@/components/TrainerSection";
import VariantsSection from "@/components/VariantsSection";
import ProgressSection from "@/components/ProgressSection";

// ──────────────────────────────────────────────
// STORAGE TYPES
// ──────────────────────────────────────────────

interface ProgressData {
  total: number;
  correct: number;
  byTask: Record<number, { total: number; correct: number }>;
  variants: { correct: number; total: number; date: string }[];
}

const EMPTY_PROGRESS: ProgressData = {
  total: 0,
  correct: 0,
  byTask: {},
  variants: [],
};

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem("oge2026_progress");
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch (e) {
    void e;
  }
  return { ...EMPTY_PROGRESS, byTask: {}, variants: [] };
}

function saveProgress(p: ProgressData) {
  localStorage.setItem("oge2026_progress", JSON.stringify(p));
}

// ──────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────

const TABS = [
  { id: "theory", label: "Теория", shortLabel: "Теория", icon: "BookOpen" },
  { id: "trainer", label: "Тренажёр", shortLabel: "Тренажёр", icon: "PenLine" },
  { id: "variants", label: "Варианты", shortLabel: "Варианты", icon: "FileText" },
  { id: "progress", label: "Мой прогресс", shortLabel: "Прогресс", icon: "TrendingUp" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

export default function Index() {
  const [tab, setTab] = useState<TabId>("theory");
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function handleTrainerAnswer(taskId: number, correct: boolean) {
    setProgress((p) => {
      const prev = p.byTask[taskId] ?? { total: 0, correct: 0 };
      return {
        ...p,
        total: p.total + 1,
        correct: p.correct + (correct ? 1 : 0),
        byTask: {
          ...p.byTask,
          [taskId]: {
            total: prev.total + 1,
            correct: prev.correct + (correct ? 1 : 0),
          },
        },
      };
    });
  }

  function handleVariantFinished(correct: number, total: number) {
    const now = new Date();
    const date = now.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    setProgress((p) => ({
      ...p,
      total: p.total + total,
      correct: p.correct + correct,
      variants: [...p.variants, { correct, total, date }],
    }));
  }

  function handleReset() {
    const empty: ProgressData = { ...EMPTY_PROGRESS, byTask: {}, variants: [] };
    setProgress(empty);
    saveProgress(empty);
  }

  const overallPct = progress.total === 0 ? 0 : Math.round((progress.correct / progress.total) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon name="GraduationCap" size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-900 text-[15px] leading-tight">ОГЭ Математика 2026</h1>
            <p className="text-xs text-slate-400">25 типов заданий · Вся теория · ФИПИ</p>
          </div>
          {progress.total > 0 && (
            <button
              onClick={() => setTab("progress")}
              className="flex-shrink-0 flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 transition-colors"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-200 relative">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500"
                  style={{ height: `${overallPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700">{overallPct}%</span>
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 sticky top-[56px] z-20">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                  tab === t.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon name={t.icon as string} size={15} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden text-[10px] leading-tight text-center">{t.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === "theory" && <TheorySection />}
        {tab === "trainer" && (
          <TrainerSection
            onAnswer={handleTrainerAnswer}
            stats={progress.byTask}
          />
        )}
        {tab === "variants" && (
          <VariantsSection onVariantFinished={handleVariantFinished} />
        )}
        {tab === "progress" && (
          <ProgressSection progress={progress} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        ОГЭ Математика 2026 · Задания соответствуют программе ФИПИ
      </footer>
    </div>
  );
}
