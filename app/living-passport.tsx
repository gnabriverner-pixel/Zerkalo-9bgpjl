/**
 * Living Passport — Palace Entry V3 (Lovable Canon)
 * Vertical story-flow. Seven sequential "rooms".
 * Constellation SVG map + Orbs in Room 1.
 * Practice triptych cards (Наблюдение / Действие / Интеграция).
 * Personal Myth bridge routes to /myth (not /continuation).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import {
  MOCK_PROFILE, buildMirrorProfileFromSession, type MirrorProfile, type PositionProfile,
} from '@/services/mirror-data';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { Orb } from '@/components/brand/Orb';
import { ConstellationMap } from '@/components/brand/ConstellationMap';

const { width: SW } = Dimensions.get('window');

// ── Room header ───────────────────────────────────────────────────────────────

function RoomHeader({ roomNumber, label, title }: { roomNumber: number; label: string; title: string }) {
  return (
    <View style={rhStyles.root}>
      <View style={rhStyles.numWrap}>
        <Text style={rhStyles.num}>{roomNumber}</Text>
      </View>
      <View style={rhStyles.text}>
        <Text style={rhStyles.label}>{label}</Text>
        <Text style={rhStyles.title}>{title}</Text>
      </View>
    </View>
  );
}
const rhStyles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  numWrap: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.goldGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  num: { ...Typography.label, color: Colors.gold, fontSize: 13 },
  text: { flex: 1, gap: 2 },
  label: { ...Typography.label, color: Colors.gold, letterSpacing: 1.5, fontSize: 10 },
  title: { ...Typography.heading, color: Colors.textPrimary, fontSize: 19 },
});

// ── Glass card ────────────────────────────────────────────────────────────────

function GlassCard({ children, style, accent }: { children: React.ReactNode; style?: any; accent?: string }) {
  return (
    <View style={[gcStyles.card, accent ? { borderColor: accent + '28' } : {}, style]}>
      {children}
    </View>
  );
}
const gcStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.sm,
  },
});

// ── Expandable position card ──────────────────────────────────────────────────

function PositionCard({ pos }: { pos: PositionProfile }) {
  const [open, setOpen] = useState(false);
  const showComp = pos.compositeNumber !== pos.finalNumber;

  return (
    <Pressable
      onPress={() => {
        analytics.track('position_opened', { position_key: pos.key });
        setOpen(v => !v);
      }}
      style={[posStyles.card, { borderColor: pos.planetColor + '28' }]}
    >
      <View style={posStyles.head}>
        {/* Orb */}
        <View style={posStyles.orbWrap}>
          <Orb color={pos.planetColor} size={56} rotationDuration={18000} />
          {showComp ? (
            <Text style={[posStyles.compLabel, { color: pos.planetColor + 'BB' }]}>{pos.compositeNumber}</Text>
          ) : null}
        </View>
        <View style={posStyles.headText}>
          <View style={posStyles.headRow}>
            <Text style={posStyles.label}>{pos.label}</Text>
            {pos.isAuthorExtension ? (
              <View style={posStyles.extChip}><Text style={posStyles.extChipText}>авт.</Text></View>
            ) : null}
          </View>
          <Text style={[posStyles.planet, { color: pos.planetColor }]}>
            {pos.planet} · {pos.roleLabel}
          </Text>
          <Text style={posStyles.human} numberOfLines={open ? undefined : 2}>
            {pos.humanDescription}
          </Text>
        </View>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20} color={Colors.textDisabled}
        />
      </View>

      {open ? (
        <View style={posStyles.detail}>
          <View style={posStyles.divider} />
          <View style={posStyles.lsRow}>
            <View style={[posStyles.lsBox, { borderColor: pos.planetColor + '28', backgroundColor: pos.planetColor + '08' }]}>
              <Text style={[posStyles.lsTag, { color: pos.planetColor }]}>Свет</Text>
              <Text style={posStyles.lsText}>{pos.light}</Text>
            </View>
            <View style={[posStyles.lsBox, { borderColor: Colors.borderLight }]}>
              <Text style={[posStyles.lsTag, { color: Colors.textMuted }]}>Напряжение</Text>
              <Text style={posStyles.lsText}>{pos.shadow}</Text>
            </View>
          </View>
          <View style={[posStyles.orientBox, { borderColor: pos.planetColor + '22', backgroundColor: pos.planetColor + '06' }]}>
            <Text style={[posStyles.orientTag, { color: pos.planetColor }]}>Ориентир</Text>
            <Text style={posStyles.orientText}>{pos.practicalOrient}</Text>
          </View>
          <View style={posStyles.chainRow}>
            <Text style={posStyles.chainLabel}>Расчёт</Text>
            <Text style={posStyles.chainText}>{pos.calculationChain}</Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}
const posStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.lg, gap: Spacing.md,
  },
  head: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  orbWrap: { flexShrink: 0, position: 'relative', alignItems: 'center' },
  compLabel: { fontSize: 9, position: 'absolute', bottom: -2, fontWeight: '600' },
  headText: { flex: 1, gap: 3 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  label: { ...Typography.subheading, color: Colors.textPrimary },
  extChip: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  extChipText: { ...Typography.caption, color: Colors.gold, fontSize: 9 },
  planet: { ...Typography.caption, fontWeight: '600' },
  human: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
  detail: { gap: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3 },
  lsTag: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
  orientBox: { borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3 },
  orientTag: { ...Typography.label, fontSize: 10 },
  orientText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  chainRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  chainLabel: { ...Typography.caption, color: Colors.textDisabled },
  chainText: { ...Typography.mono, color: Colors.textMuted, flex: 1, fontSize: 10 },
});

// ── Practice triptych card ────────────────────────────────────────────────────

const PRACTICE_TRIPTYCH: Record<string, { observation: string; action: string; integration: string }> = {
  observation: {
    observation: 'Заметьте телесный сигнал, когда эта тема возникает сегодня. Где в теле? Что меняется?',
    action: 'Запишите одно наблюдение — даже одним предложением.',
    integration: 'Фокус: «Я замечаю, не оцениваю».',
  },
  action: {
    observation: 'Какой микро-шаг в этом направлении реален прямо сейчас — без условий?',
    action: 'Сделайте один шаг сегодня. Не идеальный — просто сделанный.',
    integration: 'Мантра: «Движение важнее совершенства».',
  },
  recovery: {
    observation: 'Что сегодня истощает? Назовите это без осуждения.',
    action: 'Запланируйте одну паузу — не «если успею», а как часть дня.',
    integration: 'Отдых — это не перерыв в работе. Это работа.',
  },
  communication: {
    observation: 'Есть ли сегодня разговор, который нужен, но откладывается?',
    action: 'Сформулируйте главную мысль письменно перед тем, как говорить.',
    integration: 'Точность слова создаёт доверие.',
  },
};

function PracticeCard({ practice }: { practice: any }) {
  const [expanded, setExpanded] = useState(false);
  const triptych = PRACTICE_TRIPTYCH[practice.type];

  return (
    <Pressable
      onPress={() => setExpanded(v => !v)}
      style={[practStyles.card, { borderColor: practice.planetColor + '25' }]}
    >
      <View style={practStyles.top}>
        <Orb color={practice.planetColor} size={48} showRings={false} />
        <View style={practStyles.topText}>
          <View style={[practStyles.typeBadge, { backgroundColor: practice.planetColor + '12', borderColor: practice.planetColor + '25' }]}>
            <Text style={[practStyles.typeText, { color: practice.planetColor }]}>{practice.typeLabel}</Text>
          </View>
          <Text style={practStyles.title}>{practice.title}</Text>
        </View>
        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={18} color={Colors.textDisabled}
        />
      </View>
      <Text style={practStyles.body}>{practice.body}</Text>

      {expanded && triptych ? (
        <View style={practStyles.triptych}>
          <View style={practStyles.triptychDivider} />
          {[
            { icon: '👁', label: 'Наблюдение', text: triptych.observation },
            { icon: '⚡', label: 'Действие', text: triptych.action },
            { icon: '🧘', label: 'Интеграция', text: triptych.integration },
          ].map((item, i) => (
            <View key={item.label} style={[practStyles.triptychRow, i > 0 && practStyles.triptychRowBorder]}>
              <Text style={practStyles.triptychIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[practStyles.triptychLabel, { color: practice.planetColor }]}>{item.label}</Text>
                <Text style={practStyles.triptychText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
const practStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  topText: { flex: 1, gap: 3 },
  typeBadge: { borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, alignSelf: 'flex-start' },
  typeText: { ...Typography.label, fontSize: 9, letterSpacing: 0.8 },
  title: { ...Typography.subheading, color: Colors.textPrimary },
  body: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  triptych: { gap: Spacing.xs },
  triptychDivider: { height: 1, backgroundColor: Colors.borderLight },
  triptychRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 8, alignItems: 'flex-start' },
  triptychRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  triptychIcon: { fontSize: 14, marginTop: 1 },
  triptychLabel: { ...Typography.label, fontSize: 9, letterSpacing: 1, marginBottom: 2 },
  triptychText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
});

// ── Journey progress bar ──────────────────────────────────────────────────────

function JourneyProgress({ current, total }: { current: number; total: number }) {
  return (
    <View style={jpStyles.root}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[jpStyles.segment, i <= current ? jpStyles.segmentActive : {}]} />
      ))}
    </View>
  );
}
const jpStyles = StyleSheet.create({
  root: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.borderLight },
  segmentActive: { backgroundColor: Colors.gold },
});

// ── Locked depth card ─────────────────────────────────────────────────────────

function LockedDepthCard({ icon, title, teaser, desc, onPress }: {
  icon: string; title: string; teaser: string; desc: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [ldStyles.card, pressed && { opacity: 0.82 }]}>
      <View style={ldStyles.iconWrap}>
        <MaterialIcons name={icon as any} size={16} color={Colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ldStyles.title}>{title}</Text>
        <Text style={ldStyles.teaser}>{teaser}</Text>
        <Text style={ldStyles.desc} numberOfLines={2}>{desc}</Text>
      </View>
      <View style={ldStyles.lock}>
        <MaterialIcons name="lock" size={10} color={Colors.background} />
      </View>
    </Pressable>
  );
}
const ldStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  iconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', marginBottom: 1 },
  teaser: { ...Typography.label, color: Colors.gold, fontSize: 9, marginBottom: 3 },
  desc: { ...Typography.caption, color: Colors.textMuted, lineHeight: 16 },
  lock: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
});

// ── Main ─────────────────────────────────────────────────────────────────────

const TOTAL_ROOMS = 7;

export default function LivingPassportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();
  const scrollRef = useRef<ScrollView>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const headerFade = useRef(new Animated.Value(0)).current;

  const profile: MirrorProfile = currentSession
    ? buildMirrorProfileFromSession(
        currentSession.core,
        {
          displayName: currentSession.name,
          dateOfBirth: currentSession.dateOfBirth,
          grammaticalForm: currentSession.gender === 'Женский' ? 'feminine' : 'masculine',
        },
        `session-${currentSession.dateOfBirth}`
      )
    : MOCK_PROFILE;

  const { positions, synthesis, practices, moneyPreview, continuation, identity } = profile;

  useEffect(() => {
    analytics.track('passport_opened');
    Animated.timing(headerFade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }).start();
  }, []);

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const room = Math.min(Math.floor(y / 520), TOTAL_ROOMS - 1);
    if (room !== activeRoom) setActiveRoom(room);
  };

  const handleDeepCta = () => {
    analytics.track('deep_cta_clicked', { source: 'living_passport' });
    router.push('/continuation');
  };

  const handleMyth = () => {
    analytics.track('personal_myth_interest_clicked');
    router.push('/myth');
  };

  return (
    <View style={styles.root}>
      {/* Sticky header */}
      <Animated.View style={[styles.stickyHeader, { paddingTop: insets.top + 4, opacity: headerFade }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.headerIdent}>
            {identity.displayName ? <Text style={styles.headerName}>{identity.displayName}</Text> : null}
            <Text style={styles.headerDob}>{identity.dateOfBirth}</Text>
          </View>
          {profile.provenance.isMockData ? (
            <View style={styles.prototypePill}><Text style={styles.prototypePillText}>DEMO</Text></View>
          ) : null}
        </View>
        <View style={styles.progressRow}>
          <JourneyProgress current={activeRoom} total={TOTAL_ROOMS} />
          <Text style={styles.progressText}>{activeRoom + 1} / {TOTAL_ROOMS}</Text>
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* ═══════════════════════════════ ROOM 1 — Маршрут ═══════════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={1} label="ВАШ МАРШРУТ" title="Личная формула" />

          {/* Constellation SVG */}
          <View style={styles.constellationWrap}>
            <ConstellationMap
              nodes={positions.map(p => ({
                key: p.key,
                label: p.label,
                number: p.finalNumber,
                composite: p.compositeNumber,
              }))}
              size={280}
            />
          </View>

          {/* Orbs row */}
          <View style={styles.orbsRow}>
            {positions.map((pos) => (
              <View key={pos.key} style={styles.orbNode}>
                <Orb color={pos.planetColor} size={44} rotationDuration={18000} />
                <Text style={[styles.orbNum, { color: pos.planetColor }]}>{pos.finalNumber}</Text>
                <Text style={styles.orbLabel} numberOfLines={1}>{pos.label.replace('Число ', '')}</Text>
              </View>
            ))}
          </View>

          <GlassCard>
            <Text style={styles.noteText}>Планеты — метафорический язык, не астрологический прогноз</Text>
            <View style={styles.divider} />
            <Text style={styles.bodyText}>{synthesis.mainRoute}</Text>
          </GlassCard>
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 2 — Роли ════════════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={2} label="ПЯТЬ ВНУТРЕННИХ РОЛЕЙ" title="Кто вы в каждом слое" />
          <Text style={styles.roomHint}>Нажмите на позицию, чтобы раскрыть детали.</Text>
          {positions.map(pos => <PositionCard key={pos.key} pos={pos} />)}
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 3 — Противоречие ══════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={3} label="ГЛАВНОЕ ПРОТИВОРЕЧИЕ" title="Центральное напряжение" />
          <GlassCard accent={Colors.saturn}>
            <Text style={styles.bodyText}>{synthesis.centralConflict}</Text>
            <View style={styles.divider} />
            <Text style={[styles.sectionSmLabel, { color: Colors.saturn }]}>Зрелое направление</Text>
            <Text style={styles.bodyText}>{synthesis.matureDirection}</Text>
          </GlassCard>
          <GlassCard>
            <Text style={styles.sectionSmLabel}>КАК МЕНЯ ВИДЯТ</Text>
            <Text style={styles.bodyText}>{synthesis.howOthersSeeYou}</Text>
          </GlassCard>
          <GlassCard>
            <Text style={styles.sectionSmLabel}>ГДЕ Я РАСКРЫВАЮСЬ</Text>
            <Text style={styles.bodyText}>{synthesis.whereYouExpand}</Text>
          </GlassCard>
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 4 — Ресурс ════════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={4} label="РЕСУРС" title="Главная сила" />
          <GlassCard accent={Colors.venus}>
            {positions.map((pos, i) => (
              <View key={pos.key} style={[styles.resourceRow, i > 0 && styles.resourceRowBorder]}>
                <Orb color={pos.planetColor} size={32} showRings={false} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resourcePlanet, { color: pos.planetColor }]}>
                    {pos.planet} · {pos.label}
                  </Text>
                  <Text style={styles.resourceLight}>{pos.light}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 5 — Практика ══════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={5} label="ПРАКТИКА" title="Четыре режима" />
          <Text style={styles.practiceIntro}>
            Практики выведены из вашей формулы. Не советы — ориентиры. Нажмите, чтобы раскрыть триптих.
          </Text>
          {practices.map((p, i) => <PracticeCard key={i} practice={p} />)}
          <Text style={styles.practiceDisclaimer}>
            Носят самоисследовательский характер. Не являются медицинской рекомендацией.
          </Text>
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 6 — Деньги ════════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={6} label="ДЕНЕЖНЫЙ ВЕКТОР" title="Карта реализации" />
          <GlassCard>
            <Text style={styles.moneyDisclaimer}>
              Не является финансовой рекомендацией. Описывает личные паттерны отношения к ценности и реализации.
            </Text>
          </GlassCard>
          {moneyPreview.positions.map((pos) =>
            pos.isUnlocked ? (
              <GlassCard key={pos.positionIndex} accent={pos.planetColor}>
                <View style={styles.moneyHead}>
                  <Orb color={pos.planetColor} size={40} showRings={false} />
                  <View>
                    <Text style={styles.moneyLabel}>{pos.label}</Text>
                    <Text style={[styles.moneyPlanet, { color: pos.planetColor }]}>{pos.number} · {pos.planet}</Text>
                  </View>
                </View>
                <Text style={styles.bodyText}>{pos.description}</Text>
              </GlassCard>
            ) : (
              <LockedDepthCard
                key={pos.positionIndex}
                icon="lock"
                title={pos.label}
                teaser={`позиция ${pos.positionIndex}`}
                desc={pos.description}
                onPress={handleDeepCta}
              />
            )
          )}
          <GlassCard>
            <Text style={styles.sectionSmLabel}>ВЕКТОР РЕАЛИЗАЦИИ</Text>
            <Text style={styles.bodyText}>{moneyPreview.vectorSummary}</Text>
          </GlassCard>
        </View>

        <View style={styles.roomDivider} />

        {/* ═══════════════════════════════ ROOM 7 — Глубина ═══════════════ */}
        <View style={styles.room}>
          <RoomHeader roomNumber={7} label="ЧТО ОСТАЁТСЯ В ГЛУБИНЕ" title="Дом Самопознания" />

          <View style={styles.depthHero}>
            <View style={styles.depthHeroBadge}>
              <MaterialIcons name="workspace-premium" size={10} color={Colors.background} />
              <Text style={styles.depthHeroBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
            </View>
            <Text style={styles.depthHeroTitle}>Персональный{'\n'}PDF-разбор</Text>
            <Text style={styles.bodyText}>
              Вы уже получили бесплатно: маршрут, пять ролей, противоречие, ресурс, практики и денежный вектор.{'\n\n'}
              В глубине — 22 раздела, матрица, циклы, возрастная карта, совместимость и персональный документ.
            </Text>
          </View>

          {continuation.depthSections.map(section => (
            <LockedDepthCard
              key={section.id}
              icon={section.icon}
              title={section.title}
              teaser={section.teaser}
              desc={section.description}
              onPress={() => {
                analytics.track('deep_preview_viewed', { section_id: section.id });
                handleDeepCta();
              }}
            />
          ))}

          {/* Personal Myth Bridge */}
          <Pressable onPress={handleMyth} style={styles.mythBridge}>
            <View style={styles.mythBridgeInner}>
              <Orb color={Colors.mythPrimary} size={40} showRings={false} />
              <View style={{ flex: 1 }}>
                <Text style={styles.mythBridgeTitle}>Личный миф</Text>
                <Text style={styles.mythBridgeSub}>
                  У числового маршрута есть ещё одна форма — история, в которой его можно увидеть не как схему, а как личный миф.
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={15} color={Colors.mythPrimary} />
            </View>
          </Pressable>

          {/* Deep CTA */}
          <Pressable
            onPress={handleDeepCta}
            style={({ pressed }) => [styles.depthCta, pressed && { opacity: 0.88 }]}
          >
            <LinearGradient
              colors={[Colors.gold, Colors.goldSoft]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.depthCtaGrad}
            >
              <Text style={styles.depthCtaText}>Продолжить в полном продукте</Text>
              <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
            </LinearGradient>
          </Pressable>
          <Text style={styles.deepCtaNote}>Прототип · не является реальной покупкой</Text>
        </View>

        <Text style={styles.footer}>
          Система «Цифровой Код» — авторский инструмент самоисследования. Альберт Анатольевич Вяземский.{'\n'}
          Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  stickyHeader: {
    backgroundColor: Colors.surfaceDark + 'F5',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, gap: Spacing.xs,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerIdent: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  headerName: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  headerDob: { ...Typography.caption, color: Colors.textMuted },
  prototypePill: {
    backgroundColor: Colors.warning + '15', borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.warning + '30',
    paddingHorizontal: 7, paddingVertical: 2,
  },
  prototypePillText: { ...Typography.label, color: Colors.warning, fontSize: 8 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressText: { ...Typography.caption, color: Colors.textDisabled, fontSize: 10, minWidth: 28 },

  scrollContent: { gap: 0 },
  room: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, gap: Spacing.lg },
  roomDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.lg },
  roomHint: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic' },

  // Room 1
  constellationWrap: { alignItems: 'center', marginVertical: Spacing.sm },
  orbsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orbNode: { alignItems: 'center', gap: 3, flex: 1 },
  orbNum: { fontSize: 15, fontWeight: '700' },
  orbLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  noteText: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontSize: 9, fontStyle: 'italic' },
  bodyText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },

  // Room 3
  sectionSmLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1.2 },

  // Room 4
  resourceRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 8, alignItems: 'center' },
  resourceRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  resourcePlanet: { ...Typography.label, fontSize: 10, marginBottom: 3 },
  resourceLight: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },

  // Room 5
  practiceIntro: {
    ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22,
    borderLeftWidth: 2, borderLeftColor: Colors.gold + '45', paddingLeft: Spacing.md,
  },
  practiceDisclaimer: {
    ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontStyle: 'italic', fontSize: 10,
  },

  // Room 6
  moneyDisclaimer: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18, fontStyle: 'italic' },
  moneyHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  moneyLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  moneyPlanet: { ...Typography.caption, fontWeight: '600', marginTop: 1 },

  // Room 7
  depthHero: {
    backgroundColor: Colors.surface, borderRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.xl, gap: Spacing.md,
  },
  depthHeroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  depthHeroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9 },
  depthHeroTitle: {
    fontSize: 28, fontWeight: '400', color: Colors.textPrimary,
    lineHeight: 36, fontFamily: 'serif',
  },

  mythBridge: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.mythDim,
  },
  mythBridgeInner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg,
  },
  mythBridgeTitle: { ...Typography.subheading, color: Colors.mythPrimary, marginBottom: 4 },
  mythBridgeSub: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },

  depthCta: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  depthCtaGrad: {
    paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  depthCtaText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16 },
  deepCtaNote: {
    ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontSize: 10,
  },

  footer: {
    ...Typography.caption, color: Colors.textDisabled, textAlign: 'center',
    lineHeight: 18, fontSize: 10, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
});
