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
        title: "Числа и вычисления (зад. 6)",
        content: [
          { h: "Действия с дробями", b: "a/b + c/d = (ad + bc) / bd\na/b − c/d = (ad − bc) / bd\na/b · c/d = ac / bd\na/b ÷ c/d = a·d / b·c\n\nПеревод: 1,5 = 3/2; 0,25 = 1/4" },
          { h: "Проценты (зад. 4)", b: "P% от N = N · P / 100\nN больше M на P%: (N−M)/M · 100%\nN увеличили на P%: N · (1 + P/100)\nN уменьшили на P%: N · (1 − P/100)" },
        ],
      },
      {
        title: "Степени и корни (зад. 8)",
        content: [
          { h: "Правила работы со степенями", b: "aⁿ · aᵐ = aⁿ⁺ᵐ\naⁿ / aᵐ = aⁿ⁻ᵐ (a≠0)\n(aⁿ)ᵐ = aⁿᵐ\n(ab)ⁿ = aⁿ·bⁿ\na⁰ = 1  (a≠0)\na⁻ⁿ = 1/aⁿ\na^(1/n) = ⁿ√a" },
          { h: "Корни", b: "√(ab) = √a·√b  (a,b≥0)\n√(a/b) = √a/√b  (b>0)\n(√a)² = a  (a≥0)\n√(a²) = |a|\n∛(a³) = a" },
        ],
      },
      {
        title: "Уравнения (зад. 9, 20)",
        content: [
          { h: "Линейное уравнение", b: "ax + b = 0  →  x = −b/a\n\nАлгоритм:\n1) Все x влево, числа вправо\n2) Разделить на коэффициент при x" },
          { h: "Квадратное уравнение", b: "ax²+bx+c = 0\nD = b²−4ac\nx₁,₂ = (−b ± √D) / 2a\n\nТеорема Виета: x₁+x₂ = −b/a; x₁·x₂ = c/a\n\nD>0: 2 корня; D=0: 1 корень; D<0: нет" },
          { h: "Уравнение 3-й степени (группировка)", b: "x³+5x²−9x−45=0\nШаг 1: группировка\nx²(x+5) − 9(x+5) = 0\nШаг 2: вынести скобку\n(x²−9)(x+5) = 0\nШаг 3: разность квадратов\n(x−3)(x+3)(x+5) = 0\nx=3, x=−3, x=−5" },
        ],
      },
      {
        title: "Неравенства (зад. 13)",
        content: [
          { h: "Линейное неравенство", b: "ax > b\nПри a > 0: x > b/a\nПри a < 0: x < b/a  (знак меняется!)\n\n3−2x ≥ 8x−1:\n3+1 ≥ 8x+2x\n4 ≥ 10x\nx ≤ 0,4" },
          { h: "Методические советы", b: "Переносить слагаемые меняя знак\nПри умножении/делении на отриц. — знак меняется!\nПроверить: подставить значение" },
        ],
      },
      {
        title: "Линейные функции (зад. 11)",
        content: [
          { h: "y = kx + b", b: "k — угловой коэффициент:\n  k > 0 → возрастает\n  k < 0 → убывает\n  k = 0 → горизонталь\n\nb — пересечение с Oy (при x=0)\n\nДве прямые параллельны, если k₁ = k₂" },
          { h: "Нахождение k и b", b: "По двум точкам (x₁,y₁) и (x₂,y₂):\nk = (y₂−y₁) / (x₂−x₁)\nb = y₁ − k·x₁" },
        ],
      },
      {
        title: "Прогрессии (зад. 14)",
        content: [
          { h: "Арифметическая прогрессия (АП)", b: "aₙ = a₁ + (n−1)·d\nSₙ = n·(a₁+aₙ)/2\n\nd = aₙ − aₙ₋₁ (разность)\n\nПример: a₁=19, d=2:\na₁₃ = 19 + 12·2 = 43" },
          { h: "Геометрическая прогрессия (ГП)", b: "bₙ = b₁ · q^(n−1)\nSₙ = b₁(qⁿ−1)/(q−1)  при q≠1" },
        ],
      },
      {
        title: "Кусочные функции (зад. 22)",
        content: [
          { h: "Как читать и строить", b: "f(x) = { x²+4x−1, x≥−4\n        { x,        x<−4\n\n1) Для каждой части — ключевые точки\n2) Парабола: вершина x₀=−b/2a\n3) y=m: провести горизонталь, считать точки" },
          { h: "Вершина параболы", b: "y = x²+4x−1 = (x+2)²−5\nВершина: (−2; −5)\nПри x=−4: y=−1\nПри y=−5: одно пересечение с параболой\nПлюс одно на ветви y=x → 2 точки итого" },
        ],
      },
      {
        title: "Тарифы и формулы (зад. 5, 12)",
        content: [
          { h: "Расчёт по тарифу", b: "1) Запиши стоимость как функцию\n2) Подставь конкретное значение\n3) Сравни варианты\n\nТакси: C=150+11(t−5)\nПри t=16: C=150+11·11=271 руб." },
          { h: "Точка безразличия", b: "A₁+B₁x = A₂+B₂x\n(B₁−B₂)x = A₂−A₁\nx = (A₂−A₁)/(B₁−B₂)" },
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
        title: "Планы помещений (зад. 1, 3)",
        content: [
          { h: "Масштаб и реальные размеры", b: "Масштаб 1:N: 1 см плана = N см реальных\nРеальный размер = план × N\n\nПример: 1:200, план 2,5×2 см\nРеал: 5×4 м → S=20 м²" },
          { h: "Сортировка площадей", b: "S = a·b\nВычисли площадь каждой комнаты\nРасставь в нужном порядке" },
        ],
      },
      {
        title: "Паркет, плитка (зад. 2)",
        content: [
          { h: "Расчёт упаковок", b: "1) Площадь помещения\n2) × (1 + запас) — учёт брака\n3) ÷ площадь упаковки\n4) Округлить ВВЕРХ!\n\n14,5 × 1,1 = 15,95 м²\n15,95 ÷ 2,4 = 6,6 → 7 упаковок" },
        ],
      },
      {
        title: "Треугольники (зад. 15, 19, 23)",
        content: [
          { h: "Биссектриса угла", b: "Делит угол пополам:\n∠BAD = ∠BAC / 2\n\nТеорема о биссектрисе:\nBD/DC = AB/AC" },
          { h: "Сумма углов и виды", b: "∠A+∠B+∠C = 180°\nВнешний = сумма двух несмежных\n\nРавнобедренный: ∠B=∠C\nРавносторонний: 60° каждый" },
          { h: "Теорема Пифагора", b: "a²+b² = c²  (c — гипотенуза)\nТройки: 3-4-5, 5-12-13, 8-15-17" },
          { h: "Подобие (зад. 23)", b: "MN ∥ AC → △BMN ~ △BAC\nk = MN/AC\nBN/BC = k\n\nBN/(BN+NC) = k → решить уравнение" },
        ],
      },
      {
        title: "Окружность (зад. 16, 17)",
        content: [
          { h: "Вписанный и центральный угол", b: "Вписанный = ½ центрального (на одну дугу)\nВписанный на диаметр = 90°\n\n∠AOB=47° → ∠ACB=23,5°" },
          { h: "Квадрат около окружности", b: "Сторона = 2R (диаметр)\nS = (2R)² = 4R²\n\nR=9 → a=18 → S=324" },
          { h: "Формулы окружности", b: "C = 2πr\nS_круга = πr²\nДуга = 2πr·α/360°\nСектор = πr²·α/360°" },
        ],
      },
      {
        title: "Трапеция (зад. 18)",
        content: [
          { h: "Средняя линия", b: "m = (a+b)/2\na, b — основания\n\nm ∥ основаниям, делит высоту пополам\n\na=6, b=2 → m=4" },
          { h: "Площадь трапеции", b: "S = ½·(a+b)·h" },
        ],
      },
      {
        title: "Параллелограмм (зад. 25)",
        content: [
          { h: "Свойства", b: "AB=CD, BC=AD\n∠A=∠C, ∠B=∠D\n∠A+∠B = 180°\nДиагонали делятся пополам" },
          { h: "Биссектрисы углов A и B", b: "½∠A + ½∠B = 90°\nБиссектрисы пересекаются под 90°\n\nS = a·h (основание × высота)" },
        ],
      },
      {
        title: "Координаты (зад. 7)",
        content: [
          { h: "Числовая прямая", b: "Числа расположены слева → направо по возрастанию\n−3 < −1,5 < 0 < √2 ≈ 1,41\n−0,1 < −0,04 < −0,031 < 0" },
          { h: "Формулы", b: "d(A,B) = √((x₂−x₁)²+(y₂−y₁)²)\nСередина: M=((x₁+x₂)/2;(y₁+y₂)/2)" },
        ],
      },
    ],
  },
  {
    id: "probability",
    icon: "BarChart2",
    label: "Вероятность",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    sections: [
      {
        title: "Вероятность (зад. 10)",
        content: [
          { h: "Классическое определение", b: "P(A) = m / n\nm — благоприятные, n — все исходы\n0 ≤ P(A) ≤ 1\n\n4 синих из 12: P=4/12=1/3≈0,333" },
          { h: "Операции с событиями", b: "P(Ā) = 1−P(A)\nНесовместные: P(A∪B)=P(A)+P(B)\nНезависимые: P(A∩B)=P(A)·P(B)" },
        ],
      },
      {
        title: "Статистика",
        content: [
          { h: "Характеристики", b: "Среднее: x̄ = Σxᵢ/n\nМедиана: середина упорядоченного ряда\nМода: наиболее частый элемент\nРазмах: R = xₘₐₓ − xₘᵢₙ" },
        ],
      },
    ],
  },
  {
    id: "movement",
    icon: "Truck",
    label: "Движение",
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    sections: [
      {
        title: "Задача о поезде (зад. 21)",
        content: [
          { h: "Схема решения", b: "Навстречу: v_отн = vп+vх\nВдогон:   v_отн = vп−vх\nДлина поезда L = v_отн · t\n\nПример: 93+3=96 км/ч\n96/3,6=26,67 м/с\nL=26,67·8≈213,3 м" },
          { h: "Перевод единиц", b: "км/ч → м/с: делить на 3,6\nм/с → км/ч: умножить на 3,6\n\n108 км/ч = 30 м/с\n72 км/ч = 20 м/с" },
        ],
      },
      {
        title: "Доказательства площадей (зад. 24)",
        content: [
          { h: "Трапеция и средняя линия", b: "Трапеция: a=BC, b=AD, h=высота\nS=(a+b)h/2\n\nE на средней линии:\nh(E,BC)=h(E,AD)=h/2\nS(BEC)=ah/4\nS(AED)=bh/4\nСумма=(a+b)h/4=S/2 ✓" },
          { h: "Медиана треугольника", b: "AM — медиана (BM=MC)\nS(ABM)=S(ACM)=S(ABC)/2\nОбщая высота из A, равные основания" },
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
    <div className="space-y-5">
      {/* Block switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {THEORY.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveBlock(t.id); setOpenSection(null); setOpenItem(null); }}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
              activeBlock === t.id
                ? `${t.bg} ${t.border} ${t.color} border-2`
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 shadow-sm"
            }`}
          >
            <Icon name={t.icon as string} size={18} className={activeBlock === t.id ? t.color : "text-slate-400"} />
            <span className="text-center leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-2">
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
