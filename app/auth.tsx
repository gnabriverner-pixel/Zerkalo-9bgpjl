import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLink = async () => {
    if (!email.trim() || !email.includes('@')) {
      showAlert('Введите email', 'Укажите корректный адрес');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const handleMockLogin = () => {
    login(email || 'user@example.com');
    router.replace('/(tabs)');
  };

  const handleGuest = () => {
    login('', true);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, {
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xxl
        }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
          <Text style={styles.backText}>Назад</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.sigil}>
            <Text style={styles.sigilText}>✦</Text>
          </View>
          <Text style={styles.title}>Вход в систему</Text>
          <Text style={styles.subtitle}>
            Сохраняйте разборы и возвращайтесь к ним в любое время
          </Text>
        </View>

        {/* Demo note */}
        <View style={styles.demoBadge}>
          <MaterialIcons name="info-outline" size={14} color={Colors.gold} />
          <Text style={styles.demoText}>ДЕМО-РЕЖИМ · Используйте любой email для входа</Text>
        </View>

        {sent ? (
          /* Sent state */
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <MaterialIcons name="mark-email-read" size={32} color={Colors.gold} />
            </View>
            <Text style={styles.sentTitle}>Ссылка отправлена</Text>
            <Text style={styles.sentBody}>
              Проверьте почту{email ? ` (${email})` : ''} и нажмите на ссылку для входа
            </Text>
            <Pressable style={styles.primaryBtn} onPress={handleMockLogin}>
              <Text style={styles.primaryBtnText}>Войти (демо)</Text>
            </Pressable>
          </View>
        ) : (
          /* Login form */
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email адрес"
                returnKeyType="done"
                onSubmitEditing={handleMagicLink}
              />
            </View>

            <Pressable
              style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
              onPress={handleMagicLink}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Отправляю…' : 'Войти по ссылке на email'}
              </Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>или</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.outlineBtn} onPress={handleGuest}>
              <MaterialIcons name="person-outline" size={18} color={Colors.gold} />
              <Text style={styles.outlineBtnText}>Продолжить как гость</Text>
            </Pressable>
            <Text style={styles.guestNote}>
              В гостевом режиме разборы не сохраняются между сессиями
            </Text>
          </View>
        )}

        {/* Value props */}
        <View style={styles.valueProps}>
          <Text style={styles.valuePropTitle}>Что даёт аккаунт</Text>
          {[
            { icon: 'bookmark', text: 'Сохранённые разборы с быстрым доступом' },
            { icon: 'history', text: 'История расчётов и сравнений' },
            { icon: 'workspace-premium', text: 'Доступ к Большому персональному исследованию' },
          ].map((p, i) => (
            <View key={i} style={styles.valuePropRow}>
              <MaterialIcons name={p.icon as any} size={16} color={Colors.gold} />
              <Text style={styles.valuePropText}>{p.text}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Система «Цифровой Код» — авторский инструмент самоисследования.
          Все интерпретации носят информационно-развлекательный характер.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.xl, gap: Spacing.lg },

  back: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  backText: { ...Typography.bodySmall, color: Colors.textSecondary },

  header: { alignItems: 'center', gap: Spacing.md },
  sigil: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gold + '15',
    borderWidth: 1.5,
    borderColor: Colors.gold + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilText: { fontSize: 22, color: Colors.gold },
  title: { ...Typography.title, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },

  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.gold + '12',
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  demoText: { ...Typography.caption, color: Colors.gold, fontWeight: '600', flex: 1 },

  form: { gap: Spacing.md },
  field: { gap: Spacing.sm },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
    ...Shadows.sm,
  },

  primaryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.gold,
  },
  primaryBtnLoading: { opacity: 0.7 },
  primaryBtnText: { ...Typography.button, color: Colors.surfaceDark, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.caption, color: Colors.textMuted },

  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.gold + '60',
    borderRadius: Radii.lg,
    paddingVertical: 14,
    backgroundColor: Colors.gold + '08',
  },
  outlineBtnText: { ...Typography.button, color: Colors.gold },
  guestNote: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },

  sentCard: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xl },
  sentIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gold + '15',
    borderWidth: 1.5,
    borderColor: Colors.gold + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: { ...Typography.heading, color: Colors.textPrimary },
  sentBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },

  valueProps: { gap: Spacing.sm, backgroundColor: Colors.surfaceAlt, borderRadius: Radii.lg, padding: Spacing.md },
  valuePropTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.xs },
  valuePropRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  valuePropText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 20 },

  disclaimer: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, fontStyle: 'italic', opacity: 0.8 },
});
