import { useState } from "react";
import Icon from "@/components/ui/icon";
import { TASK_BANK, TaskExample, TaskType } from "@/data/taskBank";

interface TrainerSectionProps {
  onAnswer: (taskId: number, correct: boolean) => void;
  stats: Record<number, { total: number; correct: number }>;
}

export default function TrainerSection({ onAnswer, stats }: TrainerSectionProps) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [currentExample, setCurrentExample] = useState<TaskExample | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  function generateTask(id: number) {
    const task = TASK_BANK.find((t) => t.id === id);
    if (!task) return;
    const idx = Math.floor(Math.random() * task.examples.length);
    setCurrentTask(task);
    setCurrentExample(task.examples[idx]);
    setUserAnswer("");
    setChecked(false);
    setIsCorrect(null);
    setShowAnswer(false);
  }

  function handleCheck() {
    if (!currentExample || !currentTask || !userAnswer.trim()) return;
    const correct =
      userAnswer.trim().toLowerCase().replace(/\s/g, "") ===
      currentExample.answer.toLowerCase().replace(/\s/g, "");
    setIsCorrect(correct);
    setChecked(true);
    setSessionTotal((n) => n + 1);
    if (correct) setSessionCorrect((n) => n + 1);
    onAnswer(currentTask.id, correct);
  }

  function handleNext() {
    generateTask(selectedId);
  }

  function handleShowAnswer() {
    setShowAnswer(true);
  }

  const part1 = TASK_BANK.filter((t) => t.part === 1);
  const part2 = TASK_BANK.filter((t) => t.part === 2);

  const taskStat = currentTask ? stats[currentTask.id] : null;
  const taskPct = taskStat && taskStat.total > 0
    ? Math.round((taskStat.correct / taskStat.total) * 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Session counter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-slate-500 text-sm">Выберите задание и нажмите «Сгенерировать»</p>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <Icon name="Zap" size={12} />
          {sessionCorrect} / {sessionTotal} в сессии
        </div>
      </div>

      {/* Task selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Часть 1</p>
          <div className="flex flex-wrap gap-1.5">
            {part1.map((t) => {
              const s = stats[t.id];
              const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  title={t.title}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedId === t.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  №{t.id}
                  {pct !== null && (
                    <span
                      className={`ml-1 ${pct >= 70 ? "text-emerald-300" : "text-red-300"} ${selectedId === t.id ? "" : pct >= 70 ? "!text-emerald-500" : "!text-red-400"}`}
                    >
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Часть 2</p>
          <div className="flex flex-wrap gap-1.5">
            {part2.map((t) => {
              const s = stats[t.id];
              const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  title={t.title}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedId === t.id
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  №{t.id}
                  {pct !== null && (
                    <span className={`ml-1 ${pct >= 70 ? "text-emerald-300" : "text-red-300"}`}>{pct}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-1">
          {currentTask && (
            <p className="text-xs text-slate-500 mb-3">
              <span className="font-medium text-slate-700">№{currentTask.id} · {currentTask.title}</span>
              {taskPct !== null && (
                <span className={`ml-2 font-semibold ${taskPct >= 70 ? "text-emerald-500" : "text-red-400"}`}>
                  ({taskPct}% верно)
                </span>
              )}
            </p>
          )}
          <button
            onClick={() => generateTask(selectedId)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name="Shuffle" size={15} />
              Сгенерировать задание №{selectedId}
            </span>
          </button>
        </div>
      </div>

      {/* Task card */}
      {currentExample && currentTask && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
              {currentTask.id}
            </span>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{currentTask.topic}</p>
              <p className="text-slate-800 font-medium leading-relaxed mt-1 whitespace-pre-line">
                {currentExample.question}
              </p>
            </div>
          </div>

          {/* Answer input */}
          {!checked && !showAnswer && (
            <div className="space-y-3">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  placeholder="Ваш ответ..."
                  className="flex-1 min-w-[160px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button onClick={handleCheck} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Проверить
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={handleShowAnswer} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  <Icon name="Eye" size={13} />
                  Показать ответ (не засчитывается)
                </button>
                <button onClick={handleNext} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors ml-auto">
                  <Icon name="SkipForward" size={13} />
                  Пропустить
                </button>
              </div>
            </div>
          )}

          {/* Show answer (no credit) */}
          {showAnswer && !checked && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ответ (не засчитывается)</p>
              <p className="font-mono text-sm font-bold text-slate-800">{currentExample.answer}</p>
              <div className="text-xs font-mono text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-200 pt-2 mt-2">
                {currentExample.solution}
              </div>
              <button onClick={handleNext} className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
                <Icon name="RefreshCw" size={14} />
                Следующее задание
              </button>
            </div>
          )}

          {/* Result */}
          {checked && (
            <div className={`rounded-xl p-4 space-y-3 border ${isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
              <div className={`flex items-center gap-2 font-semibold text-sm ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? (
                  <><Icon name="CheckCircle2" size={16} /> Верно! Отличная работа 🎯</>
                ) : (
                  <><Icon name="XCircle" size={16} /> Ошибка. Правильный ответ: <span className="font-mono font-bold">{currentExample.answer}</span></>
                )}
              </div>
              <div className="text-xs font-mono text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-200 pt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Решение:</p>
                {currentExample.solution}
              </div>
              <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
                <Icon name="RefreshCw" size={14} />
                Следующее задание
              </button>
            </div>
          )}
        </div>
      )}

      {!currentExample && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 flex flex-col items-center gap-3 text-slate-400">
          <Icon name="PlayCircle" size={36} />
          <p className="text-sm font-medium">Выберите номер задания и нажмите «Сгенерировать»</p>
        </div>
      )}
    </div>
  );
}
