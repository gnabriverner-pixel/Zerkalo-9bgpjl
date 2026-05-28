// Система Цифровой Код — Calculation Engine v4.0
// Production Patch v1 — Detailed composite mode

export interface NumberEntry {
  publicLabel: string;
  internalLabel: string;
  composite: number;
  final: number;
  chain: string;
  planet: string;
}

export interface CoreNumbers {
  day: number;
  month: number;
  year: number;

  // Число Души — reduce(day)
  soulComposite: number;     // raw day (e.g. 6)
  soulFinal: number;         // single digit
  soulChain: string;

  // Число Выражения — reduce(sumDigits(DD + MM)) — авторское расширение
  expressionComposite: number;  // e.g. 11
  expressionFinal: number;      // single digit (e.g. 2)
  expressionChain: string;

  // Число Пути — reduce(sum of all date digits)
  pathComposite: number;   // e.g. 35
  pathFinal: number;       // single digit (e.g. 8)
  pathChain: string;

  // Число Направления — reduce(soul.composite + path.composite)
  directionComposite: number; // e.g. 41
  directionFinal: number;     // single digit (e.g. 5)
  directionChain: string;

  // Число Результата — reduce(soul.composite + path.composite + direction.composite)
  resultComposite: number;    // e.g. 82
  resultFinal: number;        // single digit (e.g. 1)
  resultChain: string;
}

export interface MoneyCode {
  digit1: number;  // reduceToSingle(day)
  digit2: number;  // reduceToSingle(month)
  digit3: number;  // reduceToSingle(sumDigits(year))
  digit4: number;  // reduceToSingle(d1+d2+d3)
  chain1: string;
  chain2: string;
  chain3: string;
  chain4: string;
}

export interface MatrixData {
  simple: Record<number, number>;
  detailed: Record<number, number>;
  emptySimple: number[];
  emptyDetailed: number[];
  simpleDigits: number[];
  detailedDigits: number[];
}

export interface PersonalCycleData {
  personalYear: number;
  personalYearComposite: number;
  personalBase: number;     // reduced DD+MM sum
  yearBase: number;         // reduced year sum
  currentMonth: number;
  personalMonth: number;
  personalMonthComposite: number;
  yearChain: string;
  monthChain: string;
  monthlyBreakdown: { month: number; label: string; personalNumber: number }[];
}

// ── Core math ─────────────────────────────────────────────────────────────

export function sumDigits(n: number): number {
  return String(Math.abs(n)).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
}

export function reduceToSingle(n: number): number {
  let x = n;
  while (x > 9) x = sumDigits(x);
  return x;
}

export function buildChain(n: number): string {
  if (n <= 9) return String(n);
  const steps: string[] = [String(n)];
  let cur = sumDigits(n);
  steps.push(String(cur));
  while (cur > 9) { cur = sumDigits(cur); steps.push(String(cur)); }
  return steps.join(' → ');
}

export function parseDateOfBirth(dateStr: string): { day: number; month: number; year: number } | null {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return null;
  return { day, month, year };
}

// ── Planet map ─────────────────────────────────────────────────────────────

export const PLANET_MAP: Record<number, string> = {
  1: 'Солнце', 2: 'Луна', 3: 'Юпитер', 4: 'Раху',
  5: 'Меркурий', 6: 'Венера', 7: 'Кету', 8: 'Сатурн', 9: 'Марс',
};

// ── Main calculation — DETAILED / COMPOSITE MODE ───────────────────────────
//
// Acceptance test 06.05.1986:
//   soul:       06 → 6
//   expression: 0+6+0+5 = 11 → 2
//   path:       0+6+0+5+1+9+8+6 = 35 → 8
//   direction:  6 + 35 = 41 → 5     (composites, NOT finals 6+8=14)
//   result:     6 + 35 + 41 = 82 → 1 (composites, NOT finals 6+8+5=19)

export function calculateCoreNumbers(day: number, month: number, year: number): CoreNumbers {

  // ── Число Души ─────────────────────────────────────────────────────────
  const soulComposite = day;  // preserve raw day
  const soulFinal = reduceToSingle(day);
  const soulChain = day >= 10 ? buildChain(day) : String(day);

  const ddStr = String(day).padStart(2, '0');
  const mmStr = String(month).padStart(2, '0');

  // ── Число Выражения (авторское расширение) ─────────────────────────────
  // Runtime parity with bot engine.py: day + month, not a DDMM digit sum.
  const expressionComposite = day + month;
  const expressionFinal = reduceToSingle(expressionComposite);
  const expressionChain = `${day} + ${month} = ${buildChain(expressionComposite)}`;

  // ── Число Пути ─────────────────────────────────────────────────────────
  const yyyyStr = String(year);
  const allDigits = (ddStr + mmStr + yyyyStr).split('').map(Number);
  const pathFormula = allDigits.join('+');
  const pathComposite = allDigits.reduce((a, b) => a + b, 0);
  const pathFinal = reduceToSingle(pathComposite);
  const pathChain = `${pathFormula} = ${buildChain(pathComposite)}`;

  // ── Число Направления — composite mode: soul.composite + path.composite ──
  const directionRaw = soulComposite + pathComposite;
  const directionComposite = directionRaw;
  const directionFinal = reduceToSingle(directionRaw);
  const directionChain = `${soulComposite} + ${pathComposite} = ${buildChain(directionRaw)}`;

  // ── Число Результата — composite mode: soul + path + direction composites ─
  const resultRaw = soulComposite + pathComposite + directionComposite;
  const resultComposite = resultRaw;
  const resultFinal = reduceToSingle(resultRaw);
  const resultChain = `${soulComposite} + ${pathComposite} + ${directionComposite} = ${buildChain(resultRaw)}`;

  return {
    day, month, year,
    soulComposite, soulFinal, soulChain,
    expressionComposite, expressionFinal, expressionChain,
    pathComposite, pathFinal, pathChain,
    directionComposite, directionFinal, directionChain,
    resultComposite, resultFinal, resultChain,
  };
}

// ── Matrix ─────────────────────────────────────────────────────────────────

export function calculateMatrix(core: CoreNumbers): MatrixData {
  const ddStr = String(core.day).padStart(2, '0');
  const mmStr = String(core.month).padStart(2, '0');
  const yyyyStr = String(core.year);
  const dateDigits = (ddStr + mmStr + yyyyStr).split('').map(Number).filter(d => d !== 0);

  // Detailed: add composite number digits
  const compositeStr = String(core.pathComposite) + String(core.directionComposite) + String(core.resultComposite);
  const compositeDigits = compositeStr.split('').map(Number).filter(d => d !== 0);
  const detailedDigits = [...dateDigits, ...compositeDigits];

  const simple: Record<number, number> = {};
  const detailed: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) { simple[i] = 0; detailed[i] = 0; }

  dateDigits.forEach(d => { if (d >= 1 && d <= 9) simple[d]++; });
  detailedDigits.forEach(d => { if (d >= 1 && d <= 9) detailed[d]++; });

  const emptySimple = Object.entries(simple).filter(([, v]) => v === 0).map(([k]) => parseInt(k));
  const emptyDetailed = Object.entries(detailed).filter(([, v]) => v === 0).map(([k]) => parseInt(k));

  return { simple, detailed, emptySimple, emptyDetailed, simpleDigits: dateDigits, detailedDigits };
}

// ── Money Code ─────────────────────────────────────────────────────────────
//
// Acceptance test 06.05.1986:
//   money1 = 0+6 = 6
//   money2 = 0+5 = 5
//   money3 = 1+9+8+6 = 24 → 6
//   money4 = 6+5+6 = 17 → 8

export function calculateMoneyCode(day: number, month: number, year: number): MoneyCode {
  const ddDigits = String(day).padStart(2, '0').split('').map(Number);
  const mmDigits = String(month).padStart(2, '0').split('').map(Number);
  const yyyyDigits = String(year).split('').map(Number);

  const sum1 = ddDigits.reduce((a, b) => a + b, 0);
  const digit1 = reduceToSingle(sum1);
  const chain1 = `${ddDigits.join('+')} = ${buildChain(sum1)}`;

  const sum2 = mmDigits.reduce((a, b) => a + b, 0);
  const digit2 = reduceToSingle(sum2);
  const chain2 = `${mmDigits.join('+')} = ${buildChain(sum2)}`;

  const sum3raw = yyyyDigits.reduce((a, b) => a + b, 0);
  const digit3 = reduceToSingle(sum3raw);
  const chain3 = `${yyyyDigits.join('+')} = ${buildChain(sum3raw)}`;

  const sum4 = digit1 + digit2 + digit3;
  const digit4 = reduceToSingle(sum4);
  const chain4 = `${digit1}+${digit2}+${digit3} = ${buildChain(sum4)}`;

  return { digit1, digit2, digit3, digit4, chain1, chain2, chain3, chain4 };
}

// ── Personal Cycles ────────────────────────────────────────────────────────
//
// Acceptance test 06.05.1986, year 2026:
//   personalBase = reduce(0+6+0+5=11→2)
//   yearBase     = reduce(2+0+2+6=10→1)
//   personalYear = reduce(2+1=3)
//   personalMonth May = reduce(3+5=8)

export function calculatePersonalCycles(
  day: number,
  month: number,
  targetYear: number,
  currentMonth: number
): PersonalCycleData {
  const ddStr = String(day).padStart(2, '0');
  const mmStr = String(month).padStart(2, '0');
  const yyyyStr = String(targetYear);

  const personalDigits = (ddStr + mmStr).split('').map(Number);
  const personalSum = personalDigits.reduce((a, b) => a + b, 0);
  const personalBase = reduceToSingle(personalSum);

  const yearDigits = yyyyStr.split('').map(Number);
  const yearSum = yearDigits.reduce((a, b) => a + b, 0);
  const yearBase = reduceToSingle(yearSum);

  const pySumRaw = personalBase + yearBase;
  const personalYearComposite = pySumRaw;
  const personalYear = reduceToSingle(pySumRaw);

  const pmSumRaw = personalYear + currentMonth;
  const personalMonthComposite = pmSumRaw;
  const personalMonth = reduceToSingle(pmSumRaw);

  const yearChain =
    `${personalDigits.join('+')} = ${buildChain(personalSum)}\n` +
    `${yearDigits.join('+')} = ${buildChain(yearSum)}\n` +
    `${personalBase}+${yearBase} = ${buildChain(pySumRaw)}`;

  const monthChain = `${personalYear}+${currentMonth} = ${buildChain(pmSumRaw)}`;

  const MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];

  const monthlyBreakdown = MONTH_NAMES.map((label, i) => ({
    month: i + 1,
    label,
    personalNumber: reduceToSingle(personalYear + (i + 1)),
  }));

  return {
    personalYear,
    personalYearComposite,
    personalBase,
    yearBase,
    currentMonth,
    personalMonth,
    personalMonthComposite,
    yearChain,
    monthChain,
    monthlyBreakdown,
  };
}

// ── Compatibility ──────────────────────────────────────────────────────────

export function calculateCompatibility(
  person1: CoreNumbers,
  person2: CoreNumbers
): {
  unionNumber: number;
  unionComposite: number;
  strengthZones: string[];
  tensionZones: string[];
  summary: string;
} {
  const unionRaw = person1.resultFinal + person2.resultFinal;
  const unionNumber = reduceToSingle(unionRaw);
  const p1 = person1.resultFinal;
  const p2 = person2.resultFinal;
  const harmoniousPairs = new Set([
    '1-3','1-5','1-6','2-6','2-8','3-6','3-9','4-8','5-9','6-6','6-9','1-9','3-3','6-3'
  ]);
  const key = [Math.min(p1, p2), Math.max(p1, p2)].join('-');
  const isHarmonious = harmoniousPairs.has(key);
  return {
    unionNumber,
    unionComposite: unionRaw,
    strengthZones: [
      'Взаимное уважение и опора в трудных моментах',
      isHarmonious ? 'Естественная совместимость жизненных ритмов' : 'Развивающее напряжение как точка роста',
      'Возможность дополнять друг друга в ключевых зонах',
    ],
    tensionZones: [
      !isHarmonious ? 'Различные подходы к реализации целей' : 'Риск слияния и потери индивидуальных векторов',
      'Разные скорости принятия решений',
    ],
    summary: isHarmonious
      ? `Союз чисел Результата ${p1} и ${p2} создаёт гармоничное поле взаимодействия.`
      : `Союз чисел Результата ${p1} и ${p2} — развивающий. Разность подходов при осознанности становится точкой роста.`,
  };
}

// ── Age Map ────────────────────────────────────────────────────────────────

export function getAgeMap(core: CoreNumbers): { age: number; year: number; activation: string; meaning: string }[] {
  const birthYear = core.year;
  return [
    { age: core.soulFinal, label: 'Число Души', meaning: 'Пробуждение внутреннего стержня, первое серьёзное столкновение с собственной природой' },
    { age: core.soulFinal + core.pathFinal, label: 'Число Пути', meaning: 'Становление способа движения в мире, выход на взрослый маршрут' },
    { age: core.directionFinal * 4, label: 'Число Направления', meaning: 'Горизонт зрелой реализации, активация полного потенциала' },
    { age: core.resultFinal * 4, label: 'Большой цикл Результата', meaning: 'Завершение первого большого жизненного цикла' },
  ]
    .filter(a => a.age > 0 && a.age < 100)
    .map(a => ({ age: a.age, year: birthYear + a.age, activation: a.label, meaning: a.meaning }));
}
