import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { TASK_BANK } from "@/data/taskBank";

const TOTAL_TIME = 235 * 60;

interface VariantTask {
  taskId: number;
  question: string;
  answer: string;
  solution: string;
  inputType: string;
  choices?: string[];
  userAnswer: string;
  checked: boolean;
  isCorrect: boolean | null;
}

interface VariantsSectionProps {
  onVariantFinished: (correct: number, total: number) => void;
}

function generateVariant(): VariantTask[] {
  return TASK_BANK.map((task) => {
    const idx = Math.floor(Math.random() * task.variants.length);
    const v = task.variants[idx];
    return {
      taskId: task.id,
      question: v.question,
      answer: v.answer,
      solution: v.solution,
      inputType: task.inputType,
      choices: v.choices,
      userAnswer: "",
      checked: false,
      isCorrect: null,
    };
  });
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, ".").replace(/[;|]/g, ",");
}
function checkAnswer(user: string, correct: string): boolean {
  const u = normalizeAnswer(user);
  const c = normalizeAnswer(correct);
  if (u === c) return true;
  const uSet = u.split(",").sort().join(",");
  const cSet = c.split(",").sort().join(",");
  return uSet === cSet;
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

type Phase = "idle" | "active" | "finished";

export default function VariantsSection({ onVariantFinished }: VariantsSectionProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [tasks, setTasks] = useState<VariantTask[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(timerRef.current!); finishVariant(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function startVariant() {
    setTasks(generateVariant());
    setCurrent(0);
    setTimeLeft(TOTAL_TIME);
    setPhase("active");
  }

  function finishVariant() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("finished");
    const correct = tasks.filter((t) => t.isCorrect).length;
    onVariantFinished(correct, tasks.length);
  }

  function handleCheck() {
    const task = tasks[current];
    if (!task || task.checked || (task.inputType !== "proof" && !task.userAnswer.trim())) return;
    const isProof = task.inputType === "proof";
    const correct = isProof ? false : checkAnswer(task.userAnswer, task.answer);
    setTasks((prev) => prev.map((t, i) => i === current ? { ...t, checked: true, isCorrect: isProof ? null : correct } : t));
  }

  function handleAnswerChange(val: string) {
    if (tasks[current]?.checked) return;
    setTasks((prev) => prev.map((t, i) => i === current ? { ...t, userAnswer: val } : t));
  }

  function handleChoiceSelect(choice: string) {
    if (tasks[current]?.checked) return;
    setTasks((prev) => prev.map((t, i) => i === current ? { ...t, userAnswer: choice } : t));
  }

  const answered = tasks.filter((t) => t.checked).length;
  const correctCount = tasks.filter((t) => t.isCorrect === true).length;
  const timeUrgent = timeLeft < 600;
  const timePercent = Math.round(((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100);

  // IDLE
  if (phase === "idle") return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-violet-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Полный вариант ОГЭ</h3>
            <p className="text-sm text-slate-500">25 заданий · 3 ч 55 мин</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: "ListChecks", label: "25 заданий", sub: "все типы ОГЭ 2026" },
            { icon: "Timer", label: "235 минут", sub: "реальное время" },
            { icon: "BarChart2", label: "Оценка", sub: "по результату" },
            { icon: "TrendingUp", label: "Статистика", sub: "влияет на прогресс" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3">
              <Icon name={item.icon as string} size={15} className="text-violet-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-700 text-xs">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
          <Icon name="Info" size={13} className="inline mr-1" />
          Задания генерируются случайным образом из базы вариантов. Таймер отсчитывает реальное время ОГЭ.
        </div>
        <button onClick={startVariant} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-colors">
          Начать вариант
        </button>
      </div>
    </div>
  );

  // FINISHED
  if (phase === "finished") {
    const pct = Math.round((correctCount / tasks.length) * 100);
    const grade = pct >= 90 ? "5" : pct >= 70 ? "4" : pct >= 50 ? "3" : "2";
    const gradeColor = grade === "5" ? "text-emerald-600" : grade === "4" ? "text-blue-600" : grade === "3" ? "text-amber-600" : "text-red-600";
    const part1c = tasks.filter((t, i) => i < 19 && t.isCorrect).length;
    const part2c = tasks.filter((t, i) => i >= 19 && t.isCorrect).length;

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center space-y-3">
          <div className="text-5xl font-black text-slate-800">{pct}%</div>
          <div className={`text-3xl font-bold ${gradeColor}`}>Оценка: {grade}</div>
          <p className="text-slate-500 text-sm">Правильных: {correctCount} из {tasks.length}</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Часть 1 (1–19)</p>
            <p className="text-2xl font-bold text-slate-800">{part1c} / 19</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Часть 2 (20–25)</p>
            <p className="text-2xl font-bold text-slate-800">{part2c} / 6</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center px-4 py-2 gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span className="text-xs text-slate-500 flex-1 truncate">{TASK_BANK[i]?.topic}</span>
              <span className={`text-xs font-bold ${t.isCorrect ? "text-emerald-500" : t.checked ? "text-red-400" : "text-slate-400"}`}>
                {t.isCorrect ? "✓" : t.checked ? "✗" : "—"}
              </span>
              <span className="text-xs text-slate-400 font-mono">{t.answer}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("idle")} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-colors">
          Пройти ещё один вариант
        </button>
      </div>
    );
  }

  // ACTIVE
  const task = tasks[current];
  if (!task) return null;

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-4">
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm ${timeUrgent ? "text-red-500" : "text-slate-700"}`}>
          <Icon name={timeUrgent ? "AlarmClock" : "Timer"} size={15} />
          {formatTime(timeLeft)}
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${timePercent}%` }} />
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">{answered}/{tasks.length}</span>
      </div>

      {/* Navigation bubbles */}
      <div className="flex flex-wrap gap-1.5">
        {tasks.map((t, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-7 h-7 rounded-md text-xs font-bold border transition-all ${
              i === current ? "bg-violet-600 text-white border-violet-600" :
              t.isCorrect ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
              t.checked ? "bg-red-100 text-red-600 border-red-200" :
              "bg-slate-50 text-slate-500 border-slate-200 hover:border-violet-300"
            }`}
          >{i + 1}</button>
        ))}
      </div>

      {/* Task */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-500 uppercase tracking-wider">
          <Icon name="FileText" size={13} />
          Задание №{current + 1} · {TASK_BANK[current]?.topic}
        </div>
        <div className="text-slate-800 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: task.question }} />

        {/* Input */}
        {task.inputType === "proof" ? (
          <div className="space-y-2">
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
              <Icon name="Info" size={13} className="inline mr-1" />
              Задание на доказательство
            </div>
            {!task.checked ? (
              <button onClick={handleCheck} className="px-5 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl">Показать решение</button>
            ) : (
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4 text-sm text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: task.solution }} />
            )}
          </div>
        ) : task.inputType === "choice" ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {(task.choices ?? []).map((choice) => {
                const isSelected = task.userAnswer === choice;
                const isRight = task.checked && choice === task.answer;
                const isWrong = task.checked && isSelected && choice !== task.answer;
                return (
                  <button key={choice} onClick={() => handleChoiceSelect(choice)} disabled={task.checked}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                      isRight ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold" :
                      isWrong ? "bg-red-50 border-red-400 text-red-700" :
                      isSelected ? "bg-indigo-50 border-indigo-400 text-indigo-800" :
                      "bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-300"
                    }`}
                  >{isRight && "✓ "}{isWrong && "✗ "}{choice}</button>
                );
              })}
            </div>
            {!task.checked && task.userAnswer && (
              <button onClick={handleCheck} className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl mt-1">Проверить</button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <input type="text" value={task.userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !task.checked && handleCheck()}
              disabled={task.checked}
              placeholder="Ваш ответ..."
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 disabled:bg-slate-50 transition-all"
            />
            {!task.checked && (
              <button onClick={handleCheck} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">Проверить</button>
            )}
          </div>
        )}

        {task.checked && task.inputType !== "proof" && (
          <div className={`rounded-xl p-3 border text-sm ${task.isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {task.isCorrect ? <><Icon name="CheckCircle2" size={14} />Верно!</> : <><Icon name="XCircle" size={14} />Ошибка. Ответ: <span className="font-mono">{task.answer}</span></>}
            </div>
            <div className="text-xs text-slate-600 whitespace-pre-line opacity-80 border-t border-slate-200 pt-2"
              dangerouslySetInnerHTML={{ __html: task.solution }} />
          </div>
        )}
      </div>

      {/* Arrows */}
      <div className="flex justify-between gap-3">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all">
          <Icon name="ChevronLeft" size={15} /> Назад
        </button>
        {current === tasks.length - 1 ? (
          <button onClick={finishVariant} className="flex items-center gap-1.5 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-colors">
            <Icon name="Flag" size={15} /> Завершить тест
          </button>
        ) : (
          <button onClick={() => setCurrent((c) => Math.min(tasks.length - 1, c + 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
            Вперёд <Icon name="ChevronRight" size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
