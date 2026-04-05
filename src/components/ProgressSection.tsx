import Icon from "@/components/ui/icon";
import { TASK_BANK } from "@/data/taskBank";

interface ProgressData {
  total: number;
  correct: number;
  byTask: Record<number, { total: number; correct: number }>;
  variants: { correct: number; total: number; date: string }[];
}

interface ProgressSectionProps {
  progress: ProgressData;
  onReset: () => void;
}

export default function ProgressSection({ progress, onReset }: ProgressSectionProps) {
  const pct = progress.total === 0 ? 0 : Math.round((progress.correct / progress.total) * 100);

  const level =
    pct >= 80 ? { label: "Отлично! Вы готовы к ОГЭ", color: "#22c55e", bg: "bg-emerald-500", ring: "ring-emerald-200" } :
    pct >= 60 ? { label: "Хорошо, продолжайте", color: "#3b82f6", bg: "bg-blue-500", ring: "ring-blue-200" } :
    pct >= 40 ? { label: "Нужна практика", color: "#f59e0b", bg: "bg-amber-500", ring: "ring-amber-200" } :
    { label: "Начинаем!", color: "#94a3b8", bg: "bg-slate-400", ring: "ring-slate-200" };

  const circumference = 2 * Math.PI * 36;
  const strokeDash = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Main stats */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-6">
          {/* SVG ring */}
          <div className="relative flex-shrink-0">
            <svg width="90" height="90" className="-rotate-90">
              <circle cx="45" cy="45" r="36" fill="none" stroke="#f1f5f9" strokeWidth="7" />
              <circle
                cx="45" cy="45" r="36" fill="none"
                stroke={level.color} strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800">{pct}%</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="font-bold text-slate-800 text-base">{level.label}</p>
            <p className="text-sm text-slate-500 mt-1">Точность ответов</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{progress.total}</p>
                <p className="text-xs text-slate-400">решено</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{progress.correct}</p>
                <p className="text-xs text-slate-400">верно</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* By task */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">Статистика по заданиям</p>
        </div>
        <div className="divide-y divide-slate-50">
          {TASK_BANK.map((task) => {
            const s = progress.byTask[task.id];
            const taskPct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
            const barColor = taskPct === null ? "bg-slate-200" : taskPct >= 70 ? "bg-emerald-400" : taskPct >= 40 ? "bg-amber-400" : "bg-red-400";
            return (
              <div key={task.id} className="flex items-center px-5 py-2.5 gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {task.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${taskPct ?? 0}%` }} />
                    </div>
                    {taskPct !== null && (
                      <span className={`text-xs font-semibold ${taskPct >= 70 ? "text-emerald-500" : taskPct >= 40 ? "text-amber-500" : "text-red-400"}`}>
                        {taskPct}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{s?.correct ?? 0}/{s?.total ?? 0}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variant history */}
      {progress.variants.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">История вариантов</p>
          </div>
          <div className="divide-y divide-slate-50">
            {progress.variants.slice(-5).reverse().map((v, i) => {
              const vPct = Math.round((v.correct / v.total) * 100);
              return (
                <div key={i} className="flex items-center px-5 py-3 gap-3">
                  <Icon name="FileText" size={15} className="text-violet-400 flex-shrink-0" />
                  <span className="text-xs text-slate-500 flex-1">{v.date}</span>
                  <span className="text-sm font-bold text-slate-700">{v.correct}/{v.total}</span>
                  <span className={`text-xs font-bold ${vPct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{vPct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <Icon name="Lightbulb" size={16} />
          Рекомендации по подготовке
        </div>
        <ul className="space-y-2 text-sm text-indigo-900">
          {[
            "Занимайтесь каждый день по 20–30 минут — регулярность важнее длинных сессий.",
            "Сначала проработайте слабые задания (красные строки в статистике).",
            "После ошибки читайте решение — оно важнее правильного ответа.",
            "Тренируйтесь на полных вариантах минимум раз в неделю.",
            "Фокус на заданиях части 2 — они дают больше баллов.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
      >
        <Icon name="Trash2" size={14} />
        Сбросить весь прогресс
      </button>
    </div>
  );
}
