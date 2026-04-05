import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

interface Formula {
  id: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  example?: string;
}

const FORMULAS: Formula[] = [
  // ── ЧИСЛА И ВЫЧИСЛЕНИЯ ──
  {
    id: "pct-base",
    title: "Процент от числа",
    category: "Числа",
    tags: ["процент", "доля", "вычисление", "процентная"],
    body: "P% от числа N = N · P / 100",
    example: "15% от 200 = 200 · 15 / 100 = 30",
  },
  {
    id: "pct-increase",
    title: "Увеличение на процент",
    category: "Числа",
    tags: ["процент", "увеличить", "рост", "добавить"],
    body: "N увеличили на P% → N · (1 + P/100)",
    example: "100 увеличили на 20% → 100 · 1,2 = 120",
  },
  {
    id: "pct-decrease",
    title: "Уменьшение на процент",
    category: "Числа",
    tags: ["процент", "уменьшить", "скидка", "снизить"],
    body: "N уменьшили на P% → N · (1 − P/100)",
    example: "200 уменьшили на 25% → 200 · 0,75 = 150",
  },
  {
    id: "degree-mult",
    title: "Умножение степеней",
    category: "Степени",
    tags: ["степень", "умножение", "показатель"],
    body: "aⁿ · aᵐ = aⁿ⁺ᵐ",
    example: "2³ · 2⁴ = 2⁷ = 128",
  },
  {
    id: "degree-div",
    title: "Деление степеней",
    category: "Степени",
    tags: ["степень", "деление", "показатель"],
    body: "aⁿ / aᵐ = aⁿ⁻ᵐ  (a ≠ 0)",
    example: "5⁶ / 5² = 5⁴ = 625",
  },
  {
    id: "degree-power",
    title: "Степень степени",
    category: "Степени",
    tags: ["степень", "степень степени", "возведение"],
    body: "(aⁿ)ᵐ = aⁿᵐ",
    example: "(2³)² = 2⁶ = 64",
  },
  {
    id: "degree-neg",
    title: "Отрицательная степень",
    category: "Степени",
    tags: ["степень", "отрицательная", "дробь"],
    body: "a⁻ⁿ = 1 / aⁿ  (a ≠ 0)",
    example: "2⁻³ = 1/8",
  },
  {
    id: "root-mult",
    title: "Корень произведения",
    category: "Корни",
    tags: ["корень", "квадратный", "умножение", "произведение"],
    body: "√(a · b) = √a · √b  (a,b ≥ 0)",
    example: "√12 = √4 · √3 = 2√3",
  },
  {
    id: "root-frac",
    title: "Корень дроби",
    category: "Корни",
    tags: ["корень", "дробь", "деление"],
    body: "√(a/b) = √a / √b  (a ≥ 0, b > 0)",
    example: "√(9/4) = 3/2",
  },
  {
    id: "root-degree",
    title: "Дробная степень",
    category: "Корни",
    tags: ["корень", "степень", "дробная"],
    body: "a^(1/n) = ⁿ√a",
    example: "8^(1/3) = ∛8 = 2",
  },

  // ── АЛГЕБРА ──
  {
    id: "fsu-sq-sum",
    title: "Квадрат суммы",
    category: "ФСУ",
    tags: ["фсу", "квадрат", "сумма", "формула", "сокращённое"],
    body: "(a + b)² = a² + 2ab + b²",
    example: "(x + 3)² = x² + 6x + 9",
  },
  {
    id: "fsu-sq-diff",
    title: "Квадрат разности",
    category: "ФСУ",
    tags: ["фсу", "квадрат", "разность", "формула"],
    body: "(a − b)² = a² − 2ab + b²",
    example: "(x − 5)² = x² − 10x + 25",
  },
  {
    id: "fsu-diff-sq",
    title: "Разность квадратов",
    category: "ФСУ",
    tags: ["фсу", "разность", "квадраты", "множители", "разложить"],
    body: "a² − b² = (a − b)(a + b)",
    example: "x² − 9 = (x−3)(x+3)",
  },
  {
    id: "fsu-cube-sum",
    title: "Сумма кубов",
    category: "ФСУ",
    tags: ["фсу", "куб", "сумма", "кубов"],
    body: "a³ + b³ = (a + b)(a² − ab + b²)",
    example: "x³ + 8 = (x+2)(x²−2x+4)",
  },
  {
    id: "fsu-cube-diff",
    title: "Разность кубов",
    category: "ФСУ",
    tags: ["фсу", "куб", "разность", "кубов"],
    body: "a³ − b³ = (a − b)(a² + ab + b²)",
    example: "x³ − 27 = (x−3)(x²+3x+9)",
  },
  {
    id: "discr",
    title: "Дискриминант квадратного уравнения",
    category: "Уравнения",
    tags: ["уравнение", "квадратное", "дискриминант", "корни", "решить"],
    body: "ax² + bx + c = 0\nD = b² − 4ac\nx₁,₂ = (−b ± √D) / 2a\n\nD > 0 → два корня\nD = 0 → один корень: x = −b/2a\nD < 0 → нет вещественных корней",
    example: "x²−5x+6=0 → D=1 → x=3; x=2",
  },
  {
    id: "vieta",
    title: "Теорема Виета",
    category: "Уравнения",
    tags: ["уравнение", "квадратное", "виета", "корни", "сумма", "произведение"],
    body: "x₁ + x₂ = −b/a\nx₁ · x₂ = c/a",
    example: "x²−5x+6=0 → x₁+x₂=5; x₁·x₂=6",
  },
  {
    id: "linear-eq",
    title: "Линейное уравнение",
    category: "Уравнения",
    tags: ["уравнение", "линейное", "решить", "корень"],
    body: "ax + b = 0\nx = −b/a  (при a ≠ 0)",
    example: "3x − 6 = 0 → x = 2",
  },
  {
    id: "ineq-linear",
    title: "Линейное неравенство",
    category: "Неравенства",
    tags: ["неравенство", "линейное", "решить", "промежуток"],
    body: "ax + b > 0\nПри a > 0: x > −b/a\nПри a < 0: x < −b/a  (знак меняется!)",
    example: "2x − 4 > 0 → x > 2",
  },

  // ── ПРОГРЕССИИ ──
  {
    id: "ap-n",
    title: "n-й член АП",
    category: "Прогрессии",
    tags: ["прогрессия", "арифметическая", "член", "разность"],
    body: "aₙ = a₁ + (n − 1) · d\nd — разность прогрессии",
    example: "a₁=3, d=4 → a₅ = 3 + 4·4 = 19",
  },
  {
    id: "ap-sum",
    title: "Сумма n членов АП",
    category: "Прогрессии",
    tags: ["прогрессия", "арифметическая", "сумма"],
    body: "Sₙ = n · (a₁ + aₙ) / 2\nили: Sₙ = n/2 · (2a₁ + (n−1)d)",
    example: "S₅ = 5·(3+19)/2 = 55",
  },
  {
    id: "gp-n",
    title: "n-й член ГП",
    category: "Прогрессии",
    tags: ["прогрессия", "геометрическая", "член", "знаменатель"],
    body: "bₙ = b₁ · q^(n−1)\nq — знаменатель прогрессии",
    example: "b₁=2, q=3 → b₄ = 2·27 = 54",
  },
  {
    id: "gp-sum",
    title: "Сумма n членов ГП",
    category: "Прогрессии",
    tags: ["прогрессия", "геометрическая", "сумма"],
    body: "Sₙ = b₁ · (qⁿ − 1) / (q − 1)  при q ≠ 1",
    example: "b₁=1, q=2, n=4 → S₄=15",
  },

  // ── ФУНКЦИИ ──
  {
    id: "linear-fn",
    title: "Линейная функция",
    category: "Функции",
    tags: ["функция", "линейная", "прямая", "график", "наклон"],
    body: "y = kx + b\nk — угловой коэффициент (наклон)\nb — точка пересечения с осью y",
    example: "y = 2x + 1: при x=3 → y=7",
  },
  {
    id: "quad-fn",
    title: "Квадратичная функция",
    category: "Функции",
    tags: ["функция", "квадратичная", "парабола", "вершина"],
    body: "y = ax² + bx + c\nВершина: x₀ = −b/(2a)\ny₀ = f(x₀)\na>0: ветви вверх (min), a<0: вниз (max)",
    example: "y=x²−4x+3, x₀=2, y₀=−1",
  },
  {
    id: "inverse-fn",
    title: "Обратная пропорциональность",
    category: "Функции",
    tags: ["функция", "гипербола", "обратная", "пропорциональность"],
    body: "y = k/x  (x ≠ 0)\nГипербола, не определена при x=0",
    example: "y = 6/x: при x=2 → y=3",
  },
  {
    id: "domain",
    title: "Область определения",
    category: "Функции",
    tags: ["область", "определения", "одз", "допустимые"],
    body: "√(f(x)): f(x) ≥ 0\n1/f(x): f(x) ≠ 0\n√(f(x))/g(x): f(x)≥0 И g(x)≠0",
    example: "√(x−3): x−3≥0 → x≥3",
  },

  // ── ГЕОМЕТРИЯ: ТРЕУГОЛЬНИКИ ──
  {
    id: "pythagoras",
    title: "Теорема Пифагора",
    category: "Треугольник",
    tags: ["пифагор", "теорема", "катет", "гипотенуза", "прямоугольный"],
    body: "a² + b² = c²\nc — гипотенуза, a и b — катеты",
    example: "a=3, b=4 → c=√25=5",
  },
  {
    id: "triangle-area",
    title: "Площадь треугольника",
    category: "Треугольник",
    tags: ["площадь", "треугольник", "основание", "высота"],
    body: "S = ½ · a · h\nS = ½ · a · b · sin C\nS = √(p(p−a)(p−b)(p−c))  — Герон\np = (a+b+c)/2",
    example: "a=6, h=4 → S=12",
  },
  {
    id: "triangle-angles",
    title: "Сумма углов треугольника",
    category: "Треугольник",
    tags: ["углы", "треугольник", "сумма", "180"],
    body: "∠A + ∠B + ∠C = 180°\nВнешний угол = сумма двух несмежных",
    example: "∠A=40°, ∠B=75° → ∠C=65°",
  },
  {
    id: "isoceles",
    title: "Равнобедренный треугольник",
    category: "Треугольник",
    tags: ["равнобедренный", "треугольник", "основание", "боковые"],
    body: "AB = AC (равные стороны)\n∠B = ∠C (равные углы)\nВысота на основание = медиана = биссектриса",
    example: "∠A=50° → ∠B=∠C=65°",
  },
  {
    id: "equilateral",
    title: "Равносторонний треугольник",
    category: "Треугольник",
    tags: ["равносторонний", "треугольник", "высота", "площадь"],
    body: "Все стороны равны: a=b=c\nВсе углы = 60°\nВысота: h = a√3/2\nПлощадь: S = a²√3/4",
    example: "a=6 → h=3√3, S=9√3",
  },
  {
    id: "similarity",
    title: "Подобные треугольники",
    category: "Треугольник",
    tags: ["подобие", "треугольник", "коэффициент", "площадь"],
    body: "Коэффициент подобия k:\nСтороны в k раз больше/меньше\nПлощади в k² раз",
    example: "k=3 → S₂=k²·S₁=9·S₁",
  },

  // ── ЧЕТЫРЁХУГОЛЬНИКИ ──
  {
    id: "rect-area",
    title: "Площадь прямоугольника",
    category: "Четырёхугольники",
    tags: ["площадь", "прямоугольник", "стороны"],
    body: "S = a · b\nДиагональ: d = √(a² + b²)",
    example: "a=5, b=8 → S=40, d=√89",
  },
  {
    id: "parallelogram-area",
    title: "Площадь параллелограмма",
    category: "Четырёхугольники",
    tags: ["площадь", "параллелограмм", "высота", "основание"],
    body: "S = a · h\nS = a · b · sin α",
    example: "a=8, h=5 → S=40",
  },
  {
    id: "trapezoid-area",
    title: "Площадь трапеции",
    category: "Четырёхугольники",
    tags: ["площадь", "трапеция", "основания", "высота"],
    body: "S = ½ · (a + b) · h\nСредняя линия: m = (a+b)/2",
    example: "a=4, b=8, h=3 → S=18",
  },
  {
    id: "rhombus-area",
    title: "Площадь ромба",
    category: "Четырёхугольники",
    tags: ["площадь", "ромб", "диагонали"],
    body: "S = ½ · d₁ · d₂\nДиагонали ромба ⊥ друг другу",
    example: "d₁=6, d₂=10 → S=30",
  },

  // ── ОКРУЖНОСТЬ ──
  {
    id: "circle-len",
    title: "Длина окружности",
    category: "Окружность",
    tags: ["окружность", "длина", "периметр", "радиус"],
    body: "C = 2πr = πd",
    example: "r=5 → C=10π≈31,4",
  },
  {
    id: "circle-area",
    title: "Площадь круга",
    category: "Окружность",
    tags: ["площадь", "круг", "радиус"],
    body: "S = πr²",
    example: "r=3 → S=9π≈28,3",
  },
  {
    id: "arc-len",
    title: "Длина дуги",
    category: "Окружность",
    tags: ["дуга", "длина", "угол", "центральный"],
    body: "l = 2πr · α/360°  (α в градусах)\nили  l = rα  (α в радианах)",
    example: "r=6, α=60° → l=2π",
  },
  {
    id: "sector-area",
    title: "Площадь сектора",
    category: "Окружность",
    tags: ["сектор", "площадь", "угол"],
    body: "S = πr² · α/360°",
    example: "r=6, α=90° → S=9π",
  },
  {
    id: "inscribed-angle",
    title: "Вписанный угол",
    category: "Окружность",
    tags: ["вписанный", "угол", "центральный", "дуга"],
    body: "Вписанный угол = ½ центрального\nВписанный угол на диаметр = 90°",
    example: "Центральный 80° → Вписанный 40°",
  },
  {
    id: "chord-dist",
    title: "Хорда и расстояние",
    category: "Окружность",
    tags: ["хорда", "расстояние", "центр", "перпендикуляр"],
    body: "r² = d² + (AB/2)²\nd — расстояние от центра до хорды",
    example: "r=5, d=3 → AB/2=4 → AB=8",
  },

  // ── КООРДИНАТЫ ──
  {
    id: "coord-dist",
    title: "Расстояние между точками",
    category: "Координаты",
    tags: ["расстояние", "точки", "координаты", "длина"],
    body: "d = √((x₂−x₁)² + (y₂−y₁)²)",
    example: "A(1,2), B(4,6) → d=5",
  },
  {
    id: "coord-mid",
    title: "Середина отрезка",
    category: "Координаты",
    tags: ["середина", "отрезок", "координаты", "точка"],
    body: "M = ((x₁+x₂)/2 ; (y₁+y₂)/2)",
    example: "A(0,0), B(6,4) → M(3,2)",
  },
  {
    id: "coord-slope",
    title: "Угловой коэффициент прямой",
    category: "Координаты",
    tags: ["прямая", "угловой", "коэффициент", "наклон", "две точки"],
    body: "k = (y₂ − y₁) / (x₂ − x₁)",
    example: "A(0,1), B(2,5) → k=2",
  },

  // ── ВЕРОЯТНОСТЬ ──
  {
    id: "prob-classic",
    title: "Классическая вероятность",
    category: "Вероятность",
    tags: ["вероятность", "классическая", "исходы", "благоприятные"],
    body: "P(A) = m / n\nm — благоприятные исходы\nn — все равновозможные исходы",
    example: "Кубик: P(чётное) = 3/6 = 0,5",
  },
  {
    id: "prob-opposite",
    title: "Противоположное событие",
    category: "Вероятность",
    tags: ["вероятность", "противоположное", "не", "дополнение"],
    body: "P(Ā) = 1 − P(A)",
    example: "P(A)=0,3 → P(Ā)=0,7",
  },
  {
    id: "prob-sum",
    title: "Сложение вероятностей",
    category: "Вероятность",
    tags: ["вероятность", "сложение", "или", "несовместные"],
    body: "Несовместные события:\nP(A+B) = P(A) + P(B)\n\nСовместные:\nP(A∪B) = P(A)+P(B)−P(A∩B)",
    example: "P(A)=0,3, P(B)=0,4 → P=0,7",
  },
  {
    id: "prob-mult",
    title: "Умножение вероятностей",
    category: "Вероятность",
    tags: ["вероятность", "умножение", "независимые", "оба"],
    body: "Независимые события:\nP(A∩B) = P(A) · P(B)",
    example: "P(A)=0,5, P(B)=0,6 → P=0,3",
  },

  // ── СТАТИСТИКА ──
  {
    id: "mean",
    title: "Среднее арифметическое",
    category: "Статистика",
    tags: ["среднее", "арифметическое", "статистика", "выборка"],
    body: "x̄ = (x₁ + x₂ + … + xₙ) / n",
    example: "3,5,7,9 → x̄=(3+5+7+9)/4=6",
  },
  {
    id: "median",
    title: "Медиана",
    category: "Статистика",
    tags: ["медиана", "статистика", "середина", "упорядоченный"],
    body: "Упорядоченный ряд:\n• Нечётное n: средний элемент\n• Чётное n: среднее двух средних",
    example: "1,3,5,7,9 → медиана=5",
  },
  {
    id: "mode",
    title: "Мода",
    category: "Статистика",
    tags: ["мода", "статистика", "частый", "встречается"],
    body: "Мода — наиболее часто встречающееся значение",
    example: "2,3,3,5,3,7 → мода=3",
  },
  {
    id: "range",
    title: "Размах выборки",
    category: "Статистика",
    tags: ["размах", "статистика", "максимум", "минимум"],
    body: "R = xₘₐₓ − xₘᵢₙ",
    example: "2,5,1,9,3 → R=9−1=8",
  },
];

const CATEGORIES = Array.from(new Set(FORMULAS.map((f) => f.category)));

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Числа:          { bg: "bg-blue-50",    text: "text-blue-600",   border: "border-blue-100" },
  Степени:        { bg: "bg-indigo-50",  text: "text-indigo-600", border: "border-indigo-100" },
  Корни:          { bg: "bg-violet-50",  text: "text-violet-600", border: "border-violet-100" },
  ФСУ:            { bg: "bg-purple-50",  text: "text-purple-600", border: "border-purple-100" },
  Уравнения:      { bg: "bg-pink-50",    text: "text-pink-600",   border: "border-pink-100" },
  Неравенства:    { bg: "bg-rose-50",    text: "text-rose-600",   border: "border-rose-100" },
  Прогрессии:     { bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-100" },
  Функции:        { bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-100" },
  Треугольник:    { bg: "bg-emerald-50", text: "text-emerald-600",border: "border-emerald-100" },
  Четырёхугольники:{ bg: "bg-teal-50",  text: "text-teal-600",   border: "border-teal-100" },
  Окружность:     { bg: "bg-cyan-50",    text: "text-cyan-600",   border: "border-cyan-100" },
  Координаты:     { bg: "bg-sky-50",     text: "text-sky-600",    border: "border-sky-100" },
  Вероятность:    { bg: "bg-lime-50",    text: "text-lime-600",   border: "border-lime-100" },
  Статистика:     { bg: "bg-green-50",   text: "text-green-600",  border: "border-green-100" },
};

function getColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" };
}

export default function FormulaSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FORMULAS.filter((f) => {
      const matchCat = !activeCategory || f.category === activeCategory;
      if (!q) return matchCat;
      const searchIn = [f.title, f.category, f.body, f.example ?? "", ...f.tags].join(" ").toLowerCase();
      return matchCat && searchIn.includes(q);
    });
  }, [query, activeCategory]);

  return (
    <div className="space-y-5">
      {/* Search input */}
      <div className="relative">
        <Icon
          name="Search"
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск формулы: «корень», «трапеция», «вероятность»..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <Icon name="X" size={15} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            activeCategory === null
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          }`}
        >
          Все
        </button>
        {CATEGORIES.map((cat) => {
          const c = getColor(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                activeCategory === cat
                  ? `${c.bg} ${c.text} ${c.border} border-2`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400">
        Найдено: <span className="font-semibold text-slate-600">{filtered.length}</span> формул
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
          <Icon name="SearchX" size={32} />
          <p className="text-sm">Ничего не найдено по запросу «{query}»</p>
          <button onClick={() => { setQuery(""); setActiveCategory(null); }} className="text-xs text-indigo-500 hover:underline">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => {
            const c = getColor(f.category);
            const isOpen = expanded === f.id;
            return (
              <div key={f.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? c.border : "border-slate-100"}`}>
                <button
                  onClick={() => setExpanded(isOpen ? null : f.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon name="FlaskConical" size={13} className={c.text} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{f.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{f.body.split("\n")[0]}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md ${c.bg} ${c.text}`}>
                    {f.category}
                  </span>
                  <Icon
                    name="ChevronDown"
                    size={15}
                    className={`flex-shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className={`px-4 pb-4 space-y-3 border-t ${c.border}`}>
                    <div className={`rounded-xl ${c.bg} px-4 py-3 mt-3`}>
                      <p className="font-mono text-sm text-slate-800 whitespace-pre-line leading-relaxed">{f.body}</p>
                    </div>
                    {f.example && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Пример</p>
                        <p className="font-mono text-sm text-slate-700">{f.example}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
