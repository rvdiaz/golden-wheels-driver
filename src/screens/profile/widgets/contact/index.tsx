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
import { getTenantConfigQuery } from './graphql/query';
import { ProcessForm } from '~/codidge_components/formProcessor';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';

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
              <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          }
          titleStyles={{ color: '#FFF' }}
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
              <PageLoading />
            ) : form ? (
              <ProcessForm form={form} variant="dark" />
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
  content: { padding: 20, gap: 20 },

  introWrap: { gap: 6 },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: -0.3,
  },
  introSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },

  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },

  formCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.15)',
    borderRadius: 16,
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
    borderRadius: 10,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.2,
  },

  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 2 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
});
