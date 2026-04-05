import { useState } from "react";
import Icon from "@/components/ui/icon";

const THEORY = [
  {
    id: "algebra",
    icon: "FunctionSquare",
    label: "Алгебра",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    sections: [
      {
        title: "Числа и вычисления",
        content: [
          { h: "Натуральные и целые числа", b: "ℕ = {1, 2, 3, …} — натуральные\nℤ = {…, −2, −1, 0, 1, 2, …} — целые\nПризнак делимости на 9: сумма цифр делится на 9\nПризнак делимости на 3: сумма цифр делится на 3\nПризнак делимости на 2: последняя цифра чётная" },
          { h: "Дроби и проценты", b: "a/b + c/d = (ad + bc) / bd\na/b · c/d = ac / bd\na/b ÷ c/d = a/b · d/c\n\nP% от числа N = N · P / 100\nN увеличено на P%: N · (1 + P/100)\nN уменьшено на P%: N · (1 − P/100)" },
          { h: "Степени и корни", b: "aⁿ · aᵐ = aⁿ⁺ᵐ\naⁿ / aᵐ = aⁿ⁻ᵐ\n(aⁿ)ᵐ = aⁿᵐ\n(ab)ⁿ = aⁿbⁿ\na⁰ = 1 (a≠0)\na⁻ⁿ = 1/aⁿ\na^(1/n) = ⁿ√a\n\n√(ab) = √a · √b\n√(a/b) = √a / √b" },
        ],
      },
      {
        title: "Алгебраические выражения",
        content: [
          { h: "Формулы сокращённого умножения", b: "(a+b)² = a² + 2ab + b²\n(a−b)² = a² − 2ab + b²\n(a+b)(a−b) = a² − b²\n(a+b)³ = a³ + 3a²b + 3ab² + b³\n(a−b)³ = a³ − 3a²b + 3ab² − b³\na³+b³ = (a+b)(a²−ab+b²)\na³−b³ = (a−b)(a²+ab+b²)" },
          { h: "Алгебраические дроби", b: "Сокращение: (ax)/(bx) = a/b (x≠0)\nСложение с одним знаменателем: (a+b)/c\nОДЗ: значения x, при которых выражение определено\n(знаменатель ≠ 0, подкоренное ≥ 0)" },
        ],
      },
      {
        title: "Уравнения и неравенства",
        content: [
          { h: "Линейные уравнения", b: "ax + b = 0 → x = −b/a (a≠0)\nСистема: { a₁x + b₁y = c₁; a₂x + b₂y = c₂ }\nМетоды: подстановки, сложения (сложить/вычесть уравнения)" },
          { h: "Квадратные уравнения", b: "ax² + bx + c = 0\nD = b² − 4ac (дискриминант)\nx₁,₂ = (−b ± √D) / 2a\nD > 0: два различных корня\nD = 0: один кратный корень x = −b/2a\nD < 0: нет вещественных корней\n\nТеорема Виета: x₁+x₂ = −b/a; x₁·x₂ = c/a" },
          { h: "Неравенства", b: "Линейное: ax + b > 0\nПри умножении/делении на отриц. число — знак меняется!\n\nКвадратное: a(x−x₁)(x−x₂) > 0\nМетод интервалов:\n1) найти корни\n2) расставить знаки на числовой оси\n3) выбрать нужные промежутки" },
        ],
      },
      {
        title: "Функции и графики",
        content: [
          { h: "Основные функции", b: "Линейная: y = kx + b\n  k — угловой коэффициент (наклон)\n  b — сдвиг по оси y\n  График: прямая\n\nКвадратичная: y = ax² + bx + c\n  Вершина: x = −b/2a\n  При a>0: ветви вверх; a<0: вниз\n  График: парабола\n\nОбратная пропорциональность: y = k/x\n  График: гипербола\n\nМодуль: y = |x| — V-образный график" },
          { h: "Свойства функций", b: "Область определения (ОДЗ) — допустимые x\nОбласть значений — все возможные y\n\nФункция возрастает на [a;b], если при x₁<x₂ → f(x₁)<f(x₂)\nФункция убывает на [a;b], если при x₁<x₂ → f(x₁)>f(x₂)\n\nНули функции: x, при которых f(x)=0\nЗнакопостоянство: промежутки, где f(x)>0 или f(x)<0" },
        ],
      },
      {
        title: "Прогрессии",
        content: [
          { h: "Арифметическая прогрессия", b: "aₙ = a₁ + (n−1)·d  (d — разность)\nSₙ = n·(a₁ + aₙ)/2 = n/2·(2a₁ + (n−1)d)\n\nПример: 2, 5, 8, 11... (d=3)" },
          { h: "Геометрическая прогрессия", b: "bₙ = b₁ · q^(n−1)  (q — знаменатель)\nSₙ = b₁·(qⁿ−1)/(q−1) при q≠1\n\nПример: 1, 2, 4, 8... (q=2)" },
        ],
      },
    ],
  },
  {
    id: "geometry",
    icon: "Triangle",
    label: "Геометрия",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    sections: [
      {
        title: "Треугольники",
        content: [
          { h: "Основные свойства", b: "Сумма углов = 180°\nВнешний угол = сумма двух несмежных внутренних\nТеорема Пифагора: a² + b² = c² (прямоугольный треугольник)\n\nПризнаки равенства: ССС, ССУ, УСУ\nПризнаки подобия: УУ, ССС, СУС\nКоэффициент подобия k: стороны в k раз, площади в k² раз" },
          { h: "Площадь треугольника", b: "S = ½ · a · h  (основание × высота)\nS = ½ · a · b · sin C  (две стороны и угол между ними)\nS = √(p(p−a)(p−b)(p−c))  (формула Герона, p = (a+b+c)/2)\nS = (a · b · c) / (4R)  (R — радиус описанной окружности)\nS = r · p  (r — радиус вписанной окружности)" },
          { h: "Виды треугольников", b: "Остроугольный: все углы < 90°\nПрямоугольный: один угол = 90°\nТупоугольный: один угол > 90°\n\nРавнобедренный: два равных угла и две равных стороны\nРавносторонний: все стороны и углы равны (60° каждый)" },
        ],
      },
      {
        title: "Четырёхугольники",
        content: [
          { h: "Параллелограмм", b: "Свойства: противоположные стороны и углы равны, диагонали делятся пополам\nS = a · h  (основание × высота)\nS = a · b · sin α\n\nПрямоугольник: все углы = 90°; диагонали равны\nРомб: все стороны равны; диагонали ⊥ друг другу\nКвадрат: все стороны равны и все углы = 90°" },
          { h: "Трапеция", b: "Одна пара параллельных сторон (основания a и b)\nS = ½ · (a + b) · h\nСредняя линия = (a + b) / 2\n\nРавнобедренная трапеция: боковые стороны равны" },
        ],
      },
      {
        title: "Окружность",
        content: [
          { h: "Основные формулы", b: "Длина окружности: C = 2πr = πd\nПлощадь круга: S = πr²\nДлина дуги: l = 2πr · α/360° (α в градусах)\nПлощадь сектора: S = πr² · α/360°\nПлощадь кольца: S = π(R²−r²)" },
          { h: "Хорды и касательные", b: "Касательная ⊥ радиусу в точке касания\n\nХорда: перпендикуляр из центра делит хорду пополам\nr² = d² + (AB/2)²  (d — расстояние до хорды)\n\nВписанный угол = ½ центрального угла\nВписанный угол, опирающийся на диаметр = 90°" },
          { h: "Вписанные и описанные", b: "Вписанная окружность треугольника: r = S/p\nОписанная окружность треугольника: R = abc/(4S)\n\nЧетырёхугольник вписан в окружность:\nсумма противоположных углов = 180°" },
        ],
      },
      {
        title: "Координаты и векторы",
        content: [
          { h: "Координатная плоскость", b: "Расстояние: d = √((x₂−x₁)² + (y₂−y₁)²)\nСередина: M = ((x₁+x₂)/2; (y₁+y₂)/2)\nУравнение прямой: y = kx + b\n  Угловой коэффициент: k = (y₂−y₁)/(x₂−x₁)" },
          { h: "Векторы", b: "Вектор a = (x, y)\nДлина: |a| = √(x² + y²)\nСложение: (x₁,y₁) + (x₂,y₂) = (x₁+x₂, y₁+y₂)\nСкалярное произведение: a·b = x₁x₂ + y₁y₂\nВекторы ⊥, если a·b = 0" },
        ],
      },
    ],
  },
  {
    id: "probability",
    icon: "BarChart2",
    label: "Вероятность и статистика",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    sections: [
      {
        title: "Теория вероятностей",
        content: [
          { h: "Классическое определение", b: "P(A) = m / n\n  m — число благоприятных исходов\n  n — общее число равновозможных исходов\n  0 ≤ P(A) ≤ 1\n\nДостоверное событие: P(A) = 1\nНевозможное событие: P(A) = 0" },
          { h: "Операции с событиями", b: "Противоположное событие: P(Ā) = 1 − P(A)\n\nСумма (объединение): A ∪ B\nP(A∪B) = P(A) + P(B) − P(A∩B)\nДля несовместных: P(A∪B) = P(A) + P(B)\n\nПроизведение (пересечение): A ∩ B\nДля независимых: P(A∩B) = P(A) · P(B)" },
        ],
      },
      {
        title: "Статистика",
        content: [
          { h: "Числовые характеристики", b: "Среднее арифметическое: x̄ = (x₁+x₂+…+xₙ)/n\n\nМедиана: средний элемент упорядоченного ряда\n  Нечётное n: средний элемент\n  Чётное n: среднее двух средних\n\nМода: наиболее часто встречающийся элемент\n\nРазмах: R = xₘₐₓ − xₘᵢₙ" },
          { h: "Диаграммы и таблицы", b: "Круговая диаграмма: угол сектора = доля · 360°\nСтолбчатая диаграмма: высота ∝ значению\n\nЧитать таблицы: находить значения, сумму, среднее\nЧастота = количество / общее число\nОтносительная частота (в %) = частота · 100%" },
        ],
      },
    ],
  },
];

export default function TheorySection() {
  const [activeBlock, setActiveBlock] = useState("algebra");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const block = THEORY.find((t) => t.id === activeBlock)!;

  return (
    <div className="space-y-6">
      {/* Block switcher */}
      <div className="grid grid-cols-3 gap-2">
        {THEORY.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveBlock(t.id); setOpenSection(null); setOpenItem(null); }}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
              activeBlock === t.id
                ? `${t.bg} ${t.border} ${t.color} border-2`
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
            }`}
          >
            <Icon name={t.icon as string} size={18} className={activeBlock === t.id ? t.color : "text-slate-400"} />
            <span className="text-center leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {block.sections.map((sec) => (
          <div key={sec.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === sec.title ? null : sec.title)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-semibold text-slate-800 text-sm">{sec.title}</span>
              <Icon
                name="ChevronDown"
                size={16}
                className={`text-slate-400 transition-transform flex-shrink-0 ${openSection === sec.title ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === sec.title && (
              <div className="px-4 pb-4 space-y-2">
                {sec.content.map((item) => {
                  const key = sec.title + item.h;
                  return (
                    <div key={key} className="rounded-xl border border-slate-100 overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {item.h}
                        <Icon
                          name="ChevronRight"
                          size={14}
                          className={`text-slate-400 transition-transform flex-shrink-0 ${openItem === key ? "rotate-90" : ""}`}
                        />
                      </button>
                      {openItem === key && (
                        <div className={`px-4 py-3 border-t border-slate-100 ${block.bg} font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed`}>
                          {item.b}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
