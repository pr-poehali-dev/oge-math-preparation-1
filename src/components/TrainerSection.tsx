import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { TASK_BANK, TaskType, TaskVariant, getRandomVariant } from "@/data/taskBank";

interface TrainerSectionProps {
  onAnswer: (taskId: number, correct: boolean) => void;
  stats: Record<number, { total: number; correct: number }>;
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/[;|]/g, ",");
}

function checkAnswer(userRaw: string, correct: string): boolean {
  const u = normalizeAnswer(userRaw);
  const c = normalizeAnswer(correct);
  if (u === c) return true;
  // Проверяем множество ответов (3,-3,-5 vs -5,-3,3)
  const uSet = u.split(",").sort().join(",");
  const cSet = c.split(",").sort().join(",");
  return uSet === cSet;
}

export default function TrainerSection({ onAnswer, stats }: TrainerSectionProps) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [currentVariant, setCurrentVariant] = useState<TaskVariant | null>(null);
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  function loadTask(id: number, vidx?: number) {
    const task = TASK_BANK.find((t) => t.id === id);
    if (!task) return;
    const idx = vidx !== undefined ? vidx % task.variants.length : Math.floor(Math.random() * task.variants.length);
    setCurrentTask(task);
    setCurrentVariant(task.variants[idx]);
    setVariantIndex(idx);
    setUserAnswer("");
    setChecked(false);
    setIsCorrect(null);
    setShowAnswer(false);
  }

  // Автозагрузка при выборе
  useEffect(() => {
    loadTask(selectedId);
  }, [selectedId]);

  function handleCheck() {
    if (!currentVariant || !currentTask || userAnswer.trim() === "") return;
    if (currentTask.inputType === "proof") return;
    const correct = checkAnswer(userAnswer, currentVariant.answer);
    setIsCorrect(correct);
    setChecked(true);
    setSessionTotal((n) => n + 1);
    if (correct) setSessionCorrect((n) => n + 1);
    onAnswer(currentTask.id, correct);
  }

  function handleChoiceSelect(choice: string) {
    if (checked) return;
    setUserAnswer(choice);
  }

  function handleShowAnswer() {
    setShowAnswer(true);
  }

  function handleNextVariant() {
    if (!currentTask) return;
    const nextIdx = (variantIndex + 1) % currentTask.variants.length;
    loadTask(currentTask.id, nextIdx);
  }

  function handleNext() {
    const nextId = Math.min(selectedId + 1, 25);
    setSelectedId(nextId);
  }

  function handlePrev() {
    const prevId = Math.max(selectedId - 1, 1);
    setSelectedId(prevId);
  }

  const part1 = TASK_BANK.filter((t) => t.part === 1);
  const part2 = TASK_BANK.filter((t) => t.part === 2);

  const taskStat = currentTask ? stats[currentTask.id] : null;
  const taskPct = taskStat && taskStat.total > 0
    ? Math.round((taskStat.correct / taskStat.total) * 100) : null;

  return (
    <div className="space-y-5">
      {/* Session counter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-slate-500 text-sm">Выберите задание 1–25</p>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <Icon name="Zap" size={12} />
          {sessionCorrect} / {sessionTotal} в сессии
        </div>
      </div>

      {/* Task selector grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Часть 1 (задания 1–19)</p>
          <div className="flex flex-wrap gap-1.5">
            {part1.map((t) => {
              const s = stats[t.id];
              const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
              const isActive = selectedId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  title={t.title}
                  className={`relative flex flex-col items-center px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-w-[36px] ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                      : pct !== null
                        ? pct >= 70
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400"
                          : "bg-red-50 text-red-600 border-red-200 hover:border-red-400"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <span>{t.id}</span>
                  {pct !== null && (
                    <span className={`text-[9px] font-medium leading-none mt-0.5 ${isActive ? "text-indigo-200" : pct >= 70 ? "text-emerald-500" : "text-red-400"}`}>
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Часть 2 (задания 20–25)</p>
          <div className="flex flex-wrap gap-1.5">
            {part2.map((t) => {
              const s = stats[t.id];
              const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
              const isActive = selectedId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  title={t.title}
                  className={`relative flex flex-col items-center px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-w-[36px] ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105"
                      : pct !== null
                        ? pct >= 70
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <span>{t.id}</span>
                  {pct !== null && (
                    <span className={`text-[9px] font-medium leading-none mt-0.5 ${isActive ? "text-purple-200" : ""}`}>
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task card */}
      {currentVariant && currentTask && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className={`px-5 py-3 border-b border-slate-100 flex items-center gap-3 ${currentTask.part === 2 ? "bg-purple-50" : "bg-indigo-50"}`}>
            <span className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center text-white ${currentTask.part === 2 ? "bg-purple-600" : "bg-indigo-600"}`}>
              {currentTask.id}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wider ${currentTask.part === 2 ? "text-purple-600" : "text-indigo-600"}`}>
                {currentTask.title}
              </p>
              <p className="text-xs text-slate-500">{currentTask.topic}</p>
            </div>
            {taskPct !== null && (
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${taskPct >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                {taskPct}% верно
              </span>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Variant indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Вариант {variantIndex + 1} из {currentTask.variants.length}
              </span>
              <button
                onClick={handleNextVariant}
                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              >
                <Icon name="RefreshCw" size={12} />
                Другой вариант
              </button>
            </div>

            {/* Question */}
            <div
              className="text-slate-800 leading-relaxed text-[14px]"
              dangerouslySetInnerHTML={{ __html: currentVariant.question }}
            />

            {/* CSS Visuals (если есть) */}
            {currentVariant.visual && (
              <div dangerouslySetInnerHTML={{ __html: currentVariant.visual }} />
            )}

            {/* Input */}
            {currentTask.inputType === "proof" ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
                  <Icon name="Info" size={13} className="inline mr-1" />
                  Это задание на доказательство. Ознакомьтесь с условием и нажмите «Показать решение».
                </div>
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Icon name="Eye" size={14} />
                  Показать доказательство
                </button>
              </div>
            ) : currentTask.inputType === "choice" ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Выберите ответ:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(currentVariant.choices ?? []).map((choice) => {
                    const isSelected = userAnswer === choice;
                    const isRight = checked && choice === currentVariant.answer;
                    const isWrong = checked && isSelected && choice !== currentVariant.answer;
                    return (
                      <button
                        key={choice}
                        onClick={() => handleChoiceSelect(choice)}
                        disabled={checked}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                          isRight
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold"
                            : isWrong
                            ? "bg-red-50 border-red-400 text-red-700"
                            : isSelected
                            ? "bg-indigo-50 border-indigo-400 text-indigo-800"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300"
                        }`}
                      >
                        {isRight && "✓ "}{isWrong && "✗ "}{choice}
                      </button>
                    );
                  })}
                </div>
                {!checked && userAnswer && (
                  <button onClick={handleCheck} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors mt-2">
                    Проверить
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentVariant.answerHint && (
                  <p className="text-xs text-slate-400">{currentVariant.answerHint}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !checked && handleCheck()}
                    disabled={checked}
                    placeholder="Ваш ответ..."
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 disabled:bg-slate-50 transition-all"
                  />
                  {!checked && !showAnswer ? (
                    <button onClick={handleCheck} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                      Проверить
                    </button>
                  ) : null}
                </div>
                {!checked && !showAnswer && (
                  <div className="flex gap-3">
                    <button onClick={handleShowAnswer} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                      <Icon name="Eye" size={12} />
                      Показать ответ (не засчитывается)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Show answer without credit */}
            {showAnswer && !checked && currentTask.inputType !== "proof" && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Icon name="BookOpen" size={14} />
                  Правильный ответ: <span className="font-mono text-slate-900 ml-1">{currentVariant.answer}</span>
                </div>
                <div
                  className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3"
                  dangerouslySetInnerHTML={{ __html: currentVariant.solution }}
                />
              </div>
            )}

            {/* Proof solution */}
            {showAnswer && currentTask.inputType === "proof" && (
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4 space-y-2">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Полное доказательство:</p>
                <div
                  className="text-sm text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentVariant.solution }}
                />
              </div>
            )}

            {/* Check result */}
            {checked && (
              <div className={`rounded-xl p-4 border space-y-3 ${isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                <div className={`flex items-center gap-2 font-semibold text-sm ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                  {isCorrect ? (
                    <><Icon name="CheckCircle2" size={15} /> Верно! Отличная работа 🎯</>
                  ) : (
                    <><Icon name="XCircle" size={15} /> Ошибка. Правильный ответ: <span className="font-mono">{currentVariant.answer}</span></>
                  )}
                </div>
                <div
                  className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3"
                  dangerouslySetInnerHTML={{ __html: currentVariant.solution }}
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-1 flex-wrap">
              <button onClick={handlePrev} disabled={selectedId === 1} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
                <Icon name="ChevronLeft" size={13} /> Пред.
              </button>
              <button onClick={handleNextVariant} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-indigo-200 text-xs text-indigo-600 hover:bg-indigo-50 transition-all">
                <Icon name="RefreshCw" size={13} /> Другой вариант
              </button>
              {(checked || showAnswer) && (
                <button onClick={handleNext} disabled={selectedId === 25} className="ml-auto flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 transition-all">
                  Следующее <Icon name="ChevronRight" size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick jump */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 mb-2">Быстрый переход к заданию:</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={25}
            placeholder="1–25"
            className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:border-indigo-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = parseInt((e.target as HTMLInputElement).value);
                if (v >= 1 && v <= 25) setSelectedId(v);
              }
            }}
          />
          <span className="text-xs text-slate-400 self-center">Нажмите Enter</span>
        </div>
      </div>
    </div>
  );
}
