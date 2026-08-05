import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { Mail, Phone, ArrowLeft, MessageCircle } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import Text from '~/codidge_components/UI/text';
import { ENV_Vars } from '~/store/env';
import { theme } from '~/theme/theme';
import { TAB_BAR_CLEARANCE } from '~/navigation/bottomBar';
import { getTenantConfigQuery } from './graphql/query';
import { ProcessForm } from '~/codidge_components/formProcessor';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import { LoadingSpinner } from '~/codidge_components/UI/loading/loadingSpinner';

const GOLD = theme.colors.primary;

// ─── Contact info row ─────────────────────────────────────────────────────────

const ContactRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={info.row}>
    <View style={info.iconWrap}>{icon}</View>
    <View style={info.content}>
      <Text style={info.label}>{label}</Text>
      <Text style={info.value}>{value}</Text>
    </View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────

export const ContactSubmissionsScreen = ({ onBack }: { onBack: () => void }) => {
  const { data: tenantConfig, loading } = useQuery(getTenantConfigQuery, {
    variables: { id: ENV_Vars.tenant.tenantId },
  });

  // Mirror the web logic to extract form config from tenant modules
  const tenantData = tenantConfig?.getTenant;
  const contactFormModule = tenantData?.solutions
    ?.flatMap((solution: any) => solution.tenantModules)
    ?.find((module: any) => module.moduleKey === 'contactSubmissions');

  const metaData = contactFormModule ? JSON.parse(contactFormModule.metaData) : [];
  const form = metaData.find((f: any) => f.formId === 'contact');

  // Contact details from tenant
  const phone = tenantData?.phone ?? '';
  const email = tenantData?.email ?? '';

  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header
          contentContainerStyle={{ backgroundColor: 'transparent' }}
          showBack
          title="Contact Us"
          leftWidget={
            <TouchableOpacity onPress={onBack} style={s.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color={theme.colors.secondaryText} />
            </TouchableOpacity>
          }
          titleStyles={{ color: theme.colors.primaryText }}
          onBack={onBack}
        />

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* ── Intro ── */}
          <View style={s.introWrap}>
            <Text style={s.introTitle}>Get In Touch</Text>
            <Text style={s.introSub}>Get in touch for personalized service and custom quotes.</Text>
          </View>

          {/* ── Contact info ── */}
          {(phone || email) && (
            <View style={s.infoCard}>
              {phone ? (
                <ContactRow icon={<Phone size={15} color={GOLD} />} label="Phone" value={phone} />
              ) : null}
              {email ? (
                <ContactRow icon={<Mail size={15} color={GOLD} />} label="Email" value={email} />
              ) : null}
            </View>
          )}

          {/* ── Form card ── */}
          <View style={s.formCard}>
            <View style={s.formHeader}>
              <View style={s.formIconWrap}>
                <MessageCircle size={18} color={GOLD} strokeWidth={1.8} />
              </View>
              <Text style={s.formTitle}>Send us a Message</Text>
            </View>

            {loading ? (
              <View
                style={{
                  height: 250,
                  justifyContent: 'center',
                }}>
                <LoadingSpinner />
              </View>
            ) : form ? (
              <ProcessForm form={form} variant="light" />
            ) : (
              <View style={s.loadingWrap}>
                <Text style={s.unavailableText}>Contact form unavailable.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: TAB_BAR_CLEARANCE, gap: 20 },

  introWrap: { gap: 6 },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primaryTextAccent,
    letterSpacing: -0.3,
  },
  introSub: {
    fontSize: 15,
    color: theme.colors.textColor,
    lineHeight: 20,
  },

  infoCard: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },

  formCard: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.15)',
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    gap: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formIconWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.primaryText,
    letterSpacing: -0.2,
  },

  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 15,
    color: theme.colors.textColor,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.baseGray,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const info = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.cardBorder,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 2 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: theme.colors.textColor,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.primaryText,
  },
});
