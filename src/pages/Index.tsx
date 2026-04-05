import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────

const THEORY_BLOCKS = [
  {
    id: "numbers",
    icon: "Hash",
    title: "Числа и вычисления",
    short: "Натуральные, целые, рациональные, иррациональные числа. Степени, корни, проценты.",
    content: [
      { sub: "Степени и корни", body: "aⁿ · aᵐ = aⁿ⁺ᵐ\naⁿ / aᵐ = aⁿ⁻ᵐ\n(aⁿ)ᵐ = aⁿᵐ\n√(a·b) = √a · √b\na⁻ⁿ = 1/aⁿ    a^(1/n) = ⁿ√a" },
      { sub: "Проценты", body: "P% от числа N = N · P / 100\nЧисло N увеличено на P%: N · (1 + P/100)\nЧисло N уменьшено на P%: N · (1 − P/100)" },
      { sub: "Дроби", body: "a/b + c/d = (ad + bc) / bd\na/b · c/d = ac / bd\na/b ÷ c/d = a/b · d/c = ad / bc" },
    ],
  },
  {
    id: "algebra",
    icon: "FunctionSquare",
    title: "Алгебра",
    short: "Уравнения, неравенства, функции, прогрессии.",
    content: [
      { sub: "Квадратные уравнения", body: "ax² + bx + c = 0\nD = b² − 4ac\nx₁,₂ = (−b ± √D) / 2a\nD > 0 → два корня, D = 0 → один, D < 0 → нет" },
      { sub: "Линейные неравенства", body: "ax + b > 0  →  x > −b/a (при a > 0)\nПри умножении на отрицательное число знак меняется!\nМножество решений: интервал на числовой оси" },
      { sub: "Функции", body: "Линейная: y = kx + b  (k — наклон, b — сдвиг)\nКвадратичная: y = ax² + bx + c  (парабола)\nВершина параболы: x = −b / 2a\nОбратная пропорциональность: y = k/x" },
      { sub: "Прогрессии", body: "АП: aₙ = a₁ + (n−1)d    Sₙ = n(a₁+aₙ)/2\nГП: bₙ = b₁ · qⁿ⁻¹      Sₙ = b₁(qⁿ−1)/(q−1)" },
    ],
  },
  {
    id: "geometry",
    icon: "Triangle",
    title: "Геометрия",
    short: "Треугольники, окружности, площади, теорема Пифагора.",
    content: [
      { sub: "Треугольники", body: "Теорема Пифагора: a² + b² = c²\nПлощадь: S = ½ · a · h\nТеорема косинусов: c² = a² + b² − 2ab·cosC\nСумма углов треугольника = 180°" },
      { sub: "Окружность", body: "Длина: C = 2πr\nПлощадь круга: S = πr²\nДлина дуги: l = πrα/180°\nПлощадь сектора: S = πr²α/360°" },
      { sub: "Четырёхугольники", body: "Прямоугольник: S = a·b, d = √(a²+b²)\nПараллелограмм: S = a·h\nТрапеция: S = ½(a+b)·h\nРомб: S = ½d₁d₂" },
    ],
  },
  {
    id: "probability",
    icon: "BarChart2",
    title: "Вероятность и статистика",
    short: "Классическая вероятность, среднее, медиана, мода.",
    content: [
      { sub: "Вероятность", body: "P(A) = m / n\nm — число благоприятных исходов\nn — общее число равновозможных исходов\n0 ≤ P(A) ≤ 1    P(A) + P(Ā) = 1" },
      { sub: "Статистика", body: "Среднее: x̄ = (x₁+x₂+…+xₙ) / n\nМедиана: середина упорядоченного ряда\nМода: наиболее частое значение\nРазмах: R = xₘₐₓ − xₘᵢₙ" },
    ],
  },
];

// ──────────────────────────────────────────────
// TASKS
// ──────────────────────────────────────────────

type Task = {
  id: string;
  num: string;
  topic: string;
  generate: () => { question: string; answer: number; solution: string };
};

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

const TASKS: Task[] = [
  {
    id: "t8",
    num: "№8",
    topic: "Степени и корни",
    generate: () => {
      const base = randInt(2, 6);
      const exp = randInt(2, 4);
      const val = Math.pow(base, exp);
      return {
        question: `Найдите значение выражения: ⁿ√(${val}), где n = ${exp}`,
        answer: base,
        solution: `ⁿ√(${val}) — число, которое в степени ${exp} даёт ${val}.\n${base}^${exp} = ${val}\nОтвет: ${base}`,
      };
    },
  },
  {
    id: "t10",
    num: "№10",
    topic: "Вероятность",
    generate: () => {
      const total = randInt(10, 30);
      const fav = randInt(1, total - 1);
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const g = gcd(fav, total);
      const answerDec = Math.round((fav / total) * 100) / 100;
      return {
        question: `В урне ${total} шаров, из них ${fav} красных. Один шар достают случайно. Какова вероятность, что он красный?`,
        answer: answerDec,
        solution: `P(A) = m / n = ${fav} / ${total} = ${fav / g}/${total / g} ≈ ${answerDec}\nm = ${fav} (красные), n = ${total} (все шары).`,
      };
    },
  },
  {
    id: "t14",
    num: "№14",
    topic: "Прогрессия",
    generate: () => {
      const a1 = randInt(1, 10);
      const d = randInt(1, 5);
      const n = randInt(5, 10);
      const an = a1 + (n - 1) * d;
      return {
        question: `Найдите ${n}-й член арифметической прогрессии, если a₁ = ${a1}, d = ${d}.`,
        answer: an,
        solution: `aₙ = a₁ + (n−1)·d\na${n} = ${a1} + (${n}−1)·${d} = ${a1} + ${(n - 1) * d} = ${an}`,
      };
    },
  },
  {
    id: "t15",
    num: "№15",
    topic: "Геометрия",
    generate: () => {
      const a = randInt(3, 12);
      const b = randInt(3, 12);
      const c = Math.round(Math.sqrt(a * a + b * b) * 100) / 100;
      return {
        question: `В прямоугольном треугольнике катеты равны ${a} и ${b}. Найдите гипотенузу (до сотых).`,
        answer: c,
        solution: `c² = a² + b² = ${a}² + ${b}² = ${a * a + b * b}\nc = √${a * a + b * b} ≈ ${c}`,
      };
    },
  },
  {
    id: "t19",
    num: "№19",
    topic: "Площадь фигуры",
    generate: () => {
      const a = randInt(3, 15);
      const b = randInt(3, 15);
      return {
        question: `Найдите площадь прямоугольника со сторонами ${a} см и ${b} см.`,
        answer: a * b,
        solution: `S = a · b = ${a} · ${b} = ${a * b} см²`,
      };
    },
  },
];

// ──────────────────────────────────────────────
// PART 2
// ──────────────────────────────────────────────

const PART2 = [
  {
    title: "Проценты — задача №2 части",
    condition: "В банк положили 50 000 рублей под 8% годовых с ежегодным начислением. Какая сумма будет на счёте через 2 года?",
    steps: [
      "После 1-го года: 50 000 · 1,08 = 54 000 руб.",
      "После 2-го года: 54 000 · 1,08 = 58 320 руб.",
      "Формула: S = P · (1 + r)ⁿ = 50 000 · (1,08)² = 50 000 · 1,1664 = 58 320 руб.",
    ],
    answer: "Ответ: 58 320 рублей.",
  },
  {
    title: "Площадь трапеции — геометрия",
    condition: "В трапеции основания равны 6 см и 10 см, высота — 4 см. Найдите площадь трапеции.",
    steps: [
      "Формула: S = ½ · (a + b) · h",
      "Подставляем: S = ½ · (6 + 10) · 4",
      "S = ½ · 16 · 4 = 32 см²",
    ],
    answer: "Ответ: S = 32 см².",
  },
  {
    title: "Вероятность сложного события",
    condition: "Из колоды 36 карт достают одну. Найдите вероятность того, что это туз или червовая масть.",
    steps: [
      "Тузов: 4. Червей: 9. Туз червей посчитан дважды — вычитаем 1.",
      "Благоприятных исходов: 4 + 9 − 1 = 12",
      "P = 12 / 36 = 1/3 ≈ 0,33",
    ],
    answer: "Ответ: P = 1/3 ≈ 0,33.",
  },
];

// ──────────────────────────────────────────────
// STORAGE
// ──────────────────────────────────────────────

type Progress = { total: number; correct: number };

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem("oge_progress");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    void e;
  }
  return { total: 0, correct: 0 };
}

function saveProgress(p: Progress) {
  localStorage.setItem("oge_progress", JSON.stringify(p));
}

// ──────────────────────────────────────────────
// THEORY SECTION
// ──────────────────────────────────────────────

function TheorySection() {
  const [open, setOpen] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-slate-500 text-sm mb-6">
        Краткие конспекты по ключевым темам ОГЭ. Нажмите на блок, чтобы раскрыть.
      </p>
      {THEORY_BLOCKS.map((block) => (
        <div key={block.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <button
            className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
            onClick={() => { setOpen(open === block.id ? null : block.id); setOpenSub(null); }}
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Icon name={block.icon} size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800">{block.title}</div>
              <div className="text-sm text-slate-500 mt-0.5 truncate">{block.short}</div>
            </div>
            <Icon name="ChevronDown" size={18} className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${open === block.id ? "rotate-180" : ""}`} />
          </button>

          {open === block.id && (
            <div className="px-6 pb-5 space-y-2">
              {block.content.map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-50 transition-colors text-sm font-medium text-slate-700"
                    onClick={() => setOpenSub(openSub === i ? null : i)}
                  >
                    {item.sub}
                    <Icon name="ChevronRight" size={15} className={`text-slate-400 transition-transform ${openSub === i ? "rotate-90" : ""}`} />
                  </button>
                  {openSub === i && (
                    <div className="px-4 py-3 bg-slate-50 font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed border-t border-slate-100">
                      {item.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// TESTS SECTION
// ──────────────────────────────────────────────

type TaskState = {
  task: Task;
  generated: ReturnType<Task["generate"]>;
  userAnswer: string;
  checked: boolean;
  isCorrect: boolean | null;
};

function TestsSection({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const [selectedTask, setSelectedTask] = useState<Task>(TASKS[0]);
  const [state, setState] = useState<TaskState>(() => {
    const t = TASKS[0];
    return { task: t, generated: t.generate(), userAnswer: "", checked: false, isCorrect: null };
  });
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  function loadTask(task: Task) {
    setSelectedTask(task);
    setState({ task, generated: task.generate(), userAnswer: "", checked: false, isCorrect: null });
  }

  function handleCheck() {
    if (!state.userAnswer.trim()) return;
    const userNum = parseFloat(state.userAnswer.replace(",", "."));
    const correct = Math.abs(userNum - state.generated.answer) < 0.01;
    setState((s) => ({ ...s, checked: true, isCorrect: correct }));
    setSessionTotal((n) => n + 1);
    if (correct) setSessionCorrect((n) => n + 1);
    onAnswer(correct);
  }

  function handleNext() {
    setState((s) => ({ ...s, generated: s.task.generate(), userAnswer: "", checked: false, isCorrect: null }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-slate-500 text-sm">Выберите номер задания и решите пример.</p>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <Icon name="Zap" size={12} />
          {sessionCorrect} / {sessionTotal} в этой сессии
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => loadTask(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              selectedTask.id === t.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {t.num} · {t.topic}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 uppercase tracking-wider">
          <Icon name="BookOpen" size={13} />
          Задание {state.task.num} · {state.task.topic}
        </div>
        <p className="text-slate-800 font-medium leading-relaxed text-[15px]">{state.generated.question}</p>

        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            value={state.userAnswer}
            onChange={(e) => setState((s) => ({ ...s, userAnswer: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && !state.checked && handleCheck()}
            placeholder="Введите ответ..."
            disabled={state.checked}
            className="flex-1 min-w-[160px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 disabled:bg-slate-50 transition-all"
          />
          {!state.checked ? (
            <button onClick={handleCheck} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
              Проверить
            </button>
          ) : (
            <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              <Icon name="RefreshCw" size={14} />
              Следующее
            </button>
          )}
        </div>

        {state.checked && (
          <div className={`rounded-xl p-4 space-y-2 border ${state.isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"}`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              {state.isCorrect ? (
                <><Icon name="CheckCircle2" size={15} /> Верно! Отличная работа</>
              ) : (
                <><Icon name="XCircle" size={15} /> Неверно. Правильный ответ: <strong>{state.generated.answer}</strong></>
              )}
            </div>
            <div className="text-xs font-mono whitespace-pre-line leading-relaxed opacity-80">
              {state.generated.solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// SOLUTIONS SECTION
// ──────────────────────────────────────────────

function SolutionsSection() {
  const [shown, setShown] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <p className="text-slate-500 text-sm">Задачи второй части ОГЭ с пошаговым разбором.</p>
      {PART2.map((p, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            <Icon name="Layers" size={13} />
            {p.title}
          </div>
          <p className="text-slate-800 font-medium leading-relaxed text-[15px]">{p.condition}</p>
          <button
            onClick={() => setShown(shown === i ? null : i)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
          >
            <Icon name={shown === i ? "EyeOff" : "Eye"} size={14} />
            {shown === i ? "Скрыть решение" : "Показать решение"}
          </button>
          {shown === i && (
            <div className="space-y-3">
              <div className="space-y-2">
                {p.steps.map((step, j) => (
                  <div key={j} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                      {j + 1}
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-800">
                {p.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// PROGRESS SECTION
// ──────────────────────────────────────────────

function ProgressSection({ progress, onReset }: { progress: Progress; onReset: () => void }) {
  const pct = progress.total === 0 ? 0 : Math.round((progress.correct / progress.total) * 100);
  const level =
    pct >= 80 ? { label: "Отлично!", color: "#22c55e", bg: "bg-emerald-500" } :
    pct >= 60 ? { label: "Хорошо", color: "#3b82f6", bg: "bg-blue-500" } :
    pct >= 40 ? { label: "Практикуйтесь", color: "#f59e0b", bg: "bg-amber-500" } :
    { label: "Начинаем!", color: "#94a3b8", bg: "bg-slate-400" };

  return (
    <div className="space-y-6">
      <p className="text-slate-500 text-sm">Статистика за все сессии — сохраняется в браузере.</p>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "ClipboardList", val: progress.total, label: "Решено", color: "text-indigo-400" },
          { icon: "CheckCircle2", val: progress.correct, label: "Правильно", color: "text-emerald-400" },
          { icon: "TrendingUp", val: `${pct}%`, label: "Точность", color: "text-amber-400" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center text-center">
            <Icon name={s.icon} size={20} className={`${s.color} mb-2`} />
            <div className="text-2xl font-bold text-slate-800">{s.val}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Общий прогресс</span>
          <span className="text-sm font-bold" style={{ color: level.color }}>{level.label}</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${level.bg}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">
          {pct >= 80 ? "Вы готовы к экзамену! Продолжайте в том же духе." :
           pct >= 60 ? "Хороший результат. Ещё немного практики — и отлично!" :
           "Решайте больше заданий каждый день, результат улучшится."}
        </p>
      </div>

      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <Icon name="Lightbulb" size={16} />
          Рекомендации по подготовке
        </div>
        <ul className="space-y-2.5 text-sm text-indigo-900">
          {[
            "Занимайтесь каждый день по 20–30 минут — регулярность важнее марафонов.",
            "Сначала разберите теорию блока, потом переходите к практике.",
            "После ошибки изучите пояснение — оно важнее самого ответа.",
            "Начинайте с заданий №1–8, затем переходите ко второй части.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-indigo-400 mt-0.5 flex-shrink-0 font-bold">→</span>
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
        Сбросить прогресс
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

const TABS = [
  { id: "theory", label: "Теория", icon: "BookOpen" },
  { id: "tests", label: "Тесты", icon: "PenLine" },
  { id: "solutions", label: "Разборы", icon: "Layers" },
  { id: "progress", label: "Прогресс", icon: "TrendingUp" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Index() {
  const [tab, setTab] = useState<TabId>("theory");
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => { saveProgress(progress); }, [progress]);

  function handleAnswer(correct: boolean) {
    setProgress((p) => ({ total: p.total + 1, correct: p.correct + (correct ? 1 : 0) }));
  }

  function handleReset() {
    const reset = { total: 0, correct: 0 };
    setProgress(reset);
    saveProgress(reset);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Icon name="GraduationCap" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-[15px] leading-tight">ОГЭ Математика</h1>
            <p className="text-xs text-slate-400">Подготовка к ОГЭ 2026 · 9 класс</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              ФИПИ 2026
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 sticky top-[61px] z-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  tab === t.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon name={t.icon} size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {tab === "theory" && <TheorySection />}
        {tab === "tests" && <TestsSection onAnswer={handleAnswer} />}
        {tab === "solutions" && <SolutionsSection />}
        {tab === "progress" && <ProgressSection progress={progress} onReset={handleReset} />}
      </main>

      <footer className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        ОГЭ Математика 2026 · Задания соответствуют программе ФИПИ
      </footer>
    </div>
  );
}