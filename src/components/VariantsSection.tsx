import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { TASK_BANK, TaskExample } from "@/data/taskBank";

const TOTAL_TIME = 235 * 60; // 3h55m in seconds

interface VariantTask {
  taskId: number;
  example: TaskExample;
  userAnswer: string;
  checked: boolean;
  isCorrect: boolean | null;
}

interface VariantsSectionProps {
  onVariantFinished: (correct: number, total: number) => void;
}

function generateVariant(): VariantTask[] {
  return TASK_BANK.map((task) => {
    const idx = Math.floor(Math.random() * task.examples.length);
    return {
      taskId: task.id,
      example: task.examples[idx],
      userAnswer: "",
      checked: false,
      isCorrect: null,
    };
  });
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
          if (t <= 1) {
            clearInterval(timerRef.current!);
            finishVariant();
            return 0;
          }
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
    if (!task || !task.userAnswer.trim() || task.checked) return;
    const correct =
      task.userAnswer.trim().toLowerCase().replace(/\s/g, "") ===
      task.example.answer.toLowerCase().replace(/\s/g, "");
    setTasks((prev) =>
      prev.map((t, i) =>
        i === current ? { ...t, checked: true, isCorrect: correct } : t
      )
    );
  }

  function handleAnswerChange(val: string) {
    if (tasks[current]?.checked) return;
    setTasks((prev) =>
      prev.map((t, i) => (i === current ? { ...t, userAnswer: val } : t))
    );
  }

  const answered = tasks.filter((t) => t.checked).length;
  const correctCount = tasks.filter((t) => t.isCorrect).length;
  const timePercent = Math.round(((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100);
  const timeUrgent = timeLeft < 600;

  // IDLE
  if (phase === "idle") {
    return (
      <div className="space-y-6">
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
              { icon: "Timer", label: "235 минут", sub: "реальное время экзамена" },
              { icon: "BarChart2", label: "Баллы", sub: "часть 1 + часть 2" },
              { icon: "TrendingUp", label: "Статистика", sub: "влияет на прогресс" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3">
                <Icon name={item.icon as string} size={16} className="text-violet-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 text-xs">{item.label}</p>
                  <p className="text-slate-400 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
            <Icon name="Info" size={13} className="inline mr-1" />
            Задания генерируются случайно из базы. Таймер отсчитывает реальное время ОГЭ.
          </div>
          <button onClick={startVariant} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-colors">
            Начать вариант
          </button>
        </div>
      </div>
    );
  }

  // FINISHED
  if (phase === "finished") {
    const part1Correct = tasks.filter((t, i) => i < 19 && t.isCorrect).length;
    const part2Correct = tasks.filter((t, i) => i >= 19 && t.isCorrect).length;
    const pct = Math.round((correctCount / tasks.length) * 100);
    const grade = pct >= 90 ? "5" : pct >= 70 ? "4" : pct >= 50 ? "3" : "2";
    const gradeColor = grade === "5" ? "text-emerald-600" : grade === "4" ? "text-blue-600" : grade === "3" ? "text-amber-600" : "text-red-600";

    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
          <div className="text-5xl font-black">{pct}%</div>
          <div className={`text-3xl font-bold ${gradeColor}`}>Оценка: {grade}</div>
          <p className="text-slate-500 text-sm">Правильных ответов: {correctCount} из {tasks.length}</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Часть 1 (1-19)</p>
            <p className="text-2xl font-bold text-slate-800">{part1Correct} / 19</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Часть 2 (20-25)</p>
            <p className="text-2xl font-bold text-slate-800">{part2Correct} / 6</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center px-4 py-2.5 gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-xs text-slate-600 flex-1 truncate">{TASK_BANK[i].topic}</span>
              <span className={`text-xs font-semibold ${t.isCorrect ? "text-emerald-500" : t.checked ? "text-red-400" : "text-slate-400"}`}>
                {t.isCorrect ? "✓" : t.checked ? "✗" : "—"}
              </span>
              <span className="text-xs text-slate-400 font-mono">{t.example.answer}</span>
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

  return (
    <div className="space-y-4">
      {/* Timer & progress */}
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
        <span className="text-xs text-slate-400 font-medium">{answered}/{tasks.length} отвечено</span>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-1.5">
        {tasks.map((t, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-7 h-7 rounded-md text-xs font-bold transition-all border ${
              i === current
                ? "bg-violet-600 text-white border-violet-600"
                : t.isCorrect
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : t.checked
                ? "bg-red-100 text-red-600 border-red-200"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-violet-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Task */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-500 uppercase tracking-wider">
          <Icon name="FileText" size={13} />
          Задание №{current + 1} · {TASK_BANK[current]?.topic}
        </div>
        <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">{task.example.question}</p>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={task.userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !task.checked && handleCheck()}
            disabled={task.checked}
            placeholder="Ваш ответ..."
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 disabled:bg-slate-50 transition-all"
          />
          {!task.checked ? (
            <button onClick={handleCheck} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Проверить
            </button>
          ) : current < tasks.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              <Icon name="ChevronRight" size={15} />
              Далее
            </button>
          ) : null}
        </div>

        {task.checked && (
          <div className={`rounded-xl p-3 border text-sm ${task.isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"}`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {task.isCorrect ? <><Icon name="CheckCircle2" size={14} /> Верно!</> : <><Icon name="XCircle" size={14} /> Ошибка. Ответ: <span className="font-mono">{task.example.answer}</span></>}
            </div>
            <p className="text-xs font-mono text-slate-600 whitespace-pre-line opacity-80">{task.example.solution}</p>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all"
        >
          <Icon name="ChevronLeft" size={15} />
          Назад
        </button>
        {current === tasks.length - 1 ? (
          <button onClick={finishVariant} className="flex items-center gap-1.5 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-colors">
            <Icon name="Flag" size={15} />
            Завершить тест
          </button>
        ) : (
          <button onClick={() => setCurrent((c) => Math.min(tasks.length - 1, c + 1))} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
            Вперёд
            <Icon name="ChevronRight" size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
