/**
 * Mirror Data Contract — V3
 * Data layer for the Living Passport experience.
 * All UI components consume MirrorProfile. No business logic in components.
 *
 * PROTOTYPE STATUS: mock data only. Adapter interface ready for canonical backend.
 */

import type { CoreNumbers } from '@/services/calculations';
import { PLANET_NAMES, PLANET_COLORS } from '@/constants/theme';

// ── Core types ───────────────────────────────────────────────────────────────

export type GrammaticalForm = 'masculine' | 'feminine' | 'neutral';
export type PositionKey = 'soul' | 'expression' | 'path' | 'direction' | 'result';
export type InsightType = 'strength' | 'tension' | 'action';

export interface MirrorIdentity {
  displayName?: string;
  dateOfBirth: string;
  grammaticalForm: GrammaticalForm;
}

export interface PositionProfile {
  key: PositionKey;
  label: string;
  roleLabel: string;          // "Внутренняя природа"
  humanDescription: string;   // human meaning first
  planet: string;
  planetColor: string;
  finalNumber: number;
  compositeNumber: number;
  calculationChain: string;
  light: string;
  shadow: string;
  practicalOrient: string;
  isAuthorExtension?: boolean;
}

export interface InsightTriptych {
  strength: string;    // 2–3 sentences
  tension: string;     // 2–3 sentences
  action: string;      // 2–3 sentences
}

export interface RecognitionStatement {
  headline: string;      // 2–4 lines, human pattern, NOT number meaning
  symbolicImage: string; // one of: threshold | mirror | route | room | bridge | source | rhythm
  triptych: InsightTriptych;
}

export interface Synthesis {
  mainRoute: string;
  centralConflict: string;
  matureDirection: string;
  howOthersSeeYou: string;
  whereYouExpand: string;
}

export interface Practice {
  type: 'observation' | 'action' | 'recovery' | 'communication';
  typeLabel: string;
  title: string;
  body: string;
  planetColor: string;
}

export interface MoneyPreviewPosition {
  positionIndex: number;
  label: string;
  number: number;
  planet: string;
  planetColor: string;
  description: string;
  isUnlocked: boolean;
}

export interface MoneyPreview {
  positions: MoneyPreviewPosition[];
  vectorSummary: string;
}

export interface DepthSection {
  id: string;
  icon: string;
  title: string;
  teaser: string;
  description: string;
}

export interface ContinuationProduct {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  priceConfigKey: string;  // key into PRICE_CONFIG, never hardcoded
}

export interface ContinuationState {
  products: ContinuationProduct[];
  depthSections: DepthSection[];
}

export interface MirrorProfile {
  sessionId: string;
  identity: MirrorIdentity;
  recognition: RecognitionStatement;
  positions: PositionProfile[];
  synthesis: Synthesis;
  practices: Practice[];
  moneyPreview: MoneyPreview;
  continuation: ContinuationState;
  // Provenance: distinguishes canon from practical inference from artistic
  provenance: {
    calculationVersion: string;
    interpretationSource: 'canonical' | 'practical' | 'artistic';
    isMockData: boolean;
  };
}

// ── Price configuration (change here, never in components) ───────────────────

export const PRICE_CONFIG: Record<string, string> = {
  auto_deep_report: '990 ₽',
  big_personal_research: '2 900 ₽',
  personal_myth: '1 490 ₽',
};

// ── Adapter interface (implement with real backend) ──────────────────────────

export interface MirrorProfileAdapter {
  buildFromSession(
    core: CoreNumbers,
    identity: MirrorIdentity,
    sessionId: string
  ): MirrorProfile;
}

// ── Mock adapter — Артём 06.05.1986 ─────────────────────────────────────────
// Replace with real backend adapter in canonical product.

export const MOCK_PROFILE: MirrorProfile = {
  sessionId: 'mock-artem-06051986',
  provenance: {
    calculationVersion: 'v4.0',
    interpretationSource: 'artistic',
    isMockData: true,
  },
  identity: {
    displayName: 'Артём',
    dateOfBirth: '06.05.1986',
    grammaticalForm: 'masculine',
  },
  recognition: {
    headline:
      'Есть люди, которые создают тепло там, где его не хватает — не декларируя это, а просто своим присутствием.\n\nВы из тех, кто внутри устроен на качество жизни: не на шоу, а на настоящее. Но двигаться к нему долго — через дисциплину и зрелость, а не через случайность.',
    symbolicImage: 'threshold',
    triptych: {
      strength:
        'Природа Венеры внутри даёт вкус к качеству и тепло, которое люди ощущают без объяснений. Сатурн на Пути — редкость: умение строить большое и надёжное, когда другие сдаются.',
      tension:
        'Луна в Выражении ищет отклика прежде чем действовать. Меркурий тянет в расширение, когда ещё не завершено начатое. Между этими двумя тянется самое живое напряжение.',
      action:
        'Выберите одно незаконченное дело и доведите его до результата — прежде чем брать следующее. Это не ограничение, а ваш способ накапливать реальную силу.',
    },
  },
  positions: [
    {
      key: 'soul',
      label: 'Число Души',
      roleLabel: 'Внутренняя природа',
      humanDescription:
        'Внутри живёт стремление к красоте, теплу и качеству жизни — не как к привилегии, а как к естественному состоянию. Гармонизатор: создаёт пространство, в котором людям хорошо и безопасно.',
      planet: 'Венера',
      planetColor: '#C87A8A',
      finalNumber: 6,
      compositeNumber: 6,
      calculationChain: '6',
      light: 'Любовь, красота, гармония, тонкое ощущение качества, способность создавать живую атмосферу.',
      shadow: 'Контроль через заботу, перфекционизм в деталях, откладывание собственной жизни ради идеала.',
      practicalOrient: 'Создавайте красивое — это ваш ресурс, не привилегия. Учитесь принимать заботу так же, как давать её.',
    },
    {
      key: 'expression',
      label: 'Число Выражения',
      roleLabel: 'Способ проявления',
      humanDescription:
        'Вас слышат через чуткость и точное присутствие — не через громкость или давление. Сила раскрывается в контакте, который создаёт доверие.',
      planet: 'Луна',
      planetColor: '#A8B8C8',
      finalNumber: 2,
      compositeNumber: 11,
      calculationChain: '0+6+0+5 = 11 → 2',
      light: 'Тонкость, эмпатия, дипломатичность, способность чувствовать атмосферу и настраиваться на другого.',
      shadow: 'Зависимость от отклика, страх прямого проявления, ожидание разрешения от окружающих.',
      practicalOrient: 'Проявляйтесь через точное присутствие и диалог. Не растворяйтесь в чужом состоянии.',
      isAuthorExtension: true,
    },
    {
      key: 'path',
      label: 'Число Пути',
      roleLabel: 'Движение в мире',
      humanDescription:
        'Путь через дисциплину и зрелость. Движение медленное, но строительство надёжное и долгосрочное. Не спринтер — марафонец, который добегает.',
      planet: 'Сатурн',
      planetColor: '#6A6A7A',
      finalNumber: 8,
      compositeNumber: 35,
      calculationChain: '0+6+0+5+1+9+8+6 = 35 → 8',
      light: 'Дисциплина, зрелость, способность нести ответственность, строить серьёзное и долгоживущее.',
      shadow: 'Самоизнос через чувство долга, ощущение вечного должника, неспособность позволить себе отдых.',
      practicalOrient: 'Инвестируйте в долгое и серьёзное. Позвольте себе останавливаться — отдых встроен в систему.',
    },
    {
      key: 'direction',
      label: 'Число Направления',
      roleLabel: 'Форма раскрытия',
      humanDescription:
        'Реализация приходит через коммуникацию, объяснение и связи. Когда слово точное — открываются двери, которые молчание держит закрытыми.',
      planet: 'Меркурий',
      planetColor: '#5A8A7A',
      finalNumber: 5,
      compositeNumber: 41,
      calculationChain: '6 + 35 = 41 → 5',
      light: 'Коммуникация, гибкость, новые связи, способность объяснять сложное через простое.',
      shadow: 'Рассеянность, бегство от глубины, трудность с завершением начатого.',
      practicalOrient: 'Выбирайте одно и доводите до результата. Глубина — это не ограничение вашей природы, а её ресурс.',
    },
    {
      key: 'result',
      label: 'Число Результата',
      roleLabel: 'Зрелый итог пути',
      humanDescription:
        'Весь маршрут последовательно ведёт к зрелой автономии: умению быть собой без борьбы с миром и без нужды в постоянном одобрении.',
      planet: 'Солнце',
      planetColor: '#E8C040',
      finalNumber: 1,
      compositeNumber: 82,
      calculationChain: '6 + 35 + 41 = 82 → 1',
      light: 'Лидерство, воля, инициатива, способность принимать решения и вести за собой.',
      shadow: 'Упрямство, нежелание слышать других, соблазн всё контролировать в одиночку.',
      practicalOrient: 'Создавайте своё. Учитесь слышать — это усиливает силу, а не ослабляет её.',
    },
  ],
  synthesis: {
    mainRoute:
      'Венера внутри — Луна в выражении — Сатурн на пути — Меркурий в направлении — Солнце как результат. Человек, в котором одновременно живут тяга к красоте, способность тонко чувствовать, готовность строить медленно и надёжно — через слово и публичное присутствие — к зрелой автономии.',
    centralConflict:
      'Венера хочет красоты и мягкости. Луна ищет отклика. Сатурн требует дисциплины. Меркурий тянет в расширение. Солнце требует собственного курса. Всё это — в одном человеке, одновременно.',
    matureDirection:
      'Не растворяться в ожидании идеального отклика. Не распыляться в движении. Собрать свою систему и выйти с ней в мир — через речь, объяснение или публичное присутствие.',
    howOthersSeeYou:
      'Человек с теплотой и вкусом, который умеет создавать хорошую атмосферу. Заметен через качество присутствия, а не через громкость. Первое впечатление — надёжный, внимательный, с ощущением стиля.',
    whereYouExpand:
      'Раскрытие происходит там, где есть диалог, доверие и возможность объяснять. Не в одиночестве и не в хаосе — а в структурированном контакте с людьми, где слово передаёт смысл.',
  },
  practices: [
    {
      type: 'observation',
      typeLabel: 'Наблюдение',
      title: 'Утренний сигнал',
      body: 'Три минуты: что ваша природа Венеры хочет создать сегодня? Не для других — для себя.',
      planetColor: '#C87A8A',
    },
    {
      type: 'action',
      typeLabel: 'Действие',
      title: 'Один завершённый шаг',
      body: 'Путь Сатурна требует не скорости, а регулярности. Одно дело — до конца, прежде чем брать следующее.',
      planetColor: '#6A6A7A',
    },
    {
      type: 'recovery',
      typeLabel: 'Восстановление',
      title: 'Граница через тишину',
      body: 'Луна истощается без паузы. Одна запланированная тишина — не уход, а часть ресурса.',
      planetColor: '#A8B8C8',
    },
    {
      type: 'communication',
      typeLabel: 'Коммуникация',
      title: 'Слово как инструмент',
      body: 'Меркурий реализуется через речь. Сформулируйте мысль письменно перед разговором — качество изменится.',
      planetColor: '#5A8A7A',
    },
  ],
  moneyPreview: {
    positions: [
      {
        positionIndex: 1,
        label: 'Источник ценности',
        number: 6,
        planet: 'Венера',
        planetColor: '#C87A8A',
        description:
          'Денежная энергия начинает двигаться там, где есть вкус, красота, теплота и ощущение качества. Это не luxury — это точность отношений с ценностью.',
        isUnlocked: true,
      },
      {
        positionIndex: 2,
        label: 'Способ обмена',
        number: 5,
        planet: 'Меркурий',
        planetColor: '#5A8A7A',
        description:
          'Поток растёт через речь, контакты, обмен и обучение. Ваш денежный канал — это способность объяснять, передавать, быть в движении.',
        isUnlocked: true,
      },
      {
        positionIndex: 3,
        label: 'Удержание ресурса',
        number: 6,
        planet: 'Венера',
        planetColor: '#C87A8A',
        description: 'Открывается в полном исследовании.',
        isUnlocked: false,
      },
      {
        positionIndex: 4,
        label: 'Масштаб реализации',
        number: 8,
        planet: 'Сатурн',
        planetColor: '#6A6A7A',
        description: 'Открывается в полном исследовании.',
        isUnlocked: false,
      },
    ],
    vectorSummary:
      'Венера (6) запускает. Меркурий (5) движет. Сатурн (8) масштабирует. Деньги приходят через создание качества — и через речь, которая передаёт этот смысл другим.',
  },
  continuation: {
    depthSections: [
      {
        id: 'deep_analysis',
        icon: 'layers',
        title: 'Глубокий разбор позиций',
        teaser: '22 раздела',
        description:
          'Зоны напряжения, детальная матрица, синтез сильных сторон — с полными формулировками, а не тезисами.',
      },
      {
        id: 'age_map',
        icon: 'timeline',
        title: 'Возрастная карта',
        teaser: 'Точки активации',
        description:
          'Ключевые периоды в 18, 27, 36, 45 — что они означают именно для формулы 6—2—8—5—1.',
      },
      {
        id: 'compatibility',
        icon: 'people',
        title: 'Совместимость',
        teaser: 'Два кода рядом',
        description:
          'Вектор взаимодействия двух формул. Где усиление, где напряжение.',
      },
      {
        id: 'personal_year',
        icon: 'autorenew',
        title: 'Личный год 2026',
        teaser: 'Год 3 · Юпитер',
        description:
          'Зоны напряжения, ключевые месяцы и практический ориентир текущего цикла.',
      },
      {
        id: 'pdf',
        icon: 'picture-as-pdf',
        title: 'PDF-разбор',
        teaser: 'Личный документ',
        description:
          'Полный разбор в виде персонального документа — сохраняется, передаётся, возвращаешься.',
      },
    ],
    products: [
      {
        id: 'auto_deep_report',
        title: 'Автоматический глубокий разбор',
        subtitle: 'Доступный массовый продукт',
        description:
          'Все 22 раздела формулы, матрица, циклы и денежный код — в формате персонального отчёта.',
        includes: [
          'Полный разбор пяти позиций с составными числами',
          'Матрица рождения — ресурсы и зоны задач',
          'Денежный код — все четыре позиции',
          'Личный год с ключевыми месяцами',
          'PDF для сохранения',
        ],
        priceConfigKey: 'auto_deep_report',
      },
      {
        id: 'big_personal_research',
        title: 'Большое персональное исследование',
        subtitle: 'Премиальная книга',
        description:
          'Ручная/полуавтоматическая работа: не отчёт, а живая книга, написанная для конкретного человека.',
        includes: [
          'Всё из автоматического разбора',
          'Авторские формулировки под конкретную формулу',
          'Возрастная карта и точки активации',
          'Совместимость (один код в подарок)',
          'Личный практический план на ближайший год',
        ],
        priceConfigKey: 'big_personal_research',
      },
    ],
  },
};

// ── Builder from real session ────────────────────────────────────────────────
// This adapter converts AppContext session → MirrorProfile.
// In canonical product replace with real interpretation service.

export function buildMirrorProfileFromSession(
  core: CoreNumbers,
  identity: MirrorIdentity,
  sessionId: string
): MirrorProfile {
  // For prototype: inject real numbers but keep artistic mock content
  const profile = { ...MOCK_PROFILE };
  profile.sessionId = sessionId;
  profile.identity = identity;
  profile.provenance = {
    calculationVersion: 'v4.0',
    interpretationSource: 'practical',
    isMockData: false,
  };

  // Update positions with real calculated numbers
  const positionUpdates: Record<PositionKey, { final: number; composite: number; chain: string }> = {
    soul:       { final: core.soulFinal,       composite: core.soulComposite,       chain: core.soulChain },
    expression: { final: core.expressionFinal, composite: core.expressionComposite, chain: core.expressionChain },
    path:       { final: core.pathFinal,       composite: core.pathComposite,       chain: core.pathChain },
    direction:  { final: core.directionFinal,  composite: core.directionComposite,  chain: core.directionChain },
    result:     { final: core.resultFinal,     composite: core.resultComposite,     chain: core.resultChain },
  };

  profile.positions = profile.positions.map(p => ({
    ...p,
    finalNumber:     positionUpdates[p.key].final,
    compositeNumber: positionUpdates[p.key].composite,
    calculationChain: positionUpdates[p.key].chain,
    planet: PLANET_NAMES[positionUpdates[p.key].final] || p.planet,
    planetColor: PLANET_COLORS[positionUpdates[p.key].final] || p.planetColor,
  }));

  return profile;
}
