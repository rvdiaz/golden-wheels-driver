import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { User, Mail, Phone, ArrowLeft } from 'lucide-react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { theme } from '~/theme/theme';
import { usePersonalInfo } from './hooks/useCustomer';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Avatar } from './widgets/accountAvatar';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PhoneInput from '~/codidge_components/UI/form/inputs/phoneNumberInput';

const GOLD = theme.colors.primary;

// ─── Main screen ──────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  phone: string;
  preferenceLanguage: string;
}

export const PersonalInfo = ({ onBack }: { onBack: () => void }) => {
  const { user, loadingUpdate, handleUpdateProfile } = usePersonalInfo();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    await handleUpdateProfile(data);
    reset();
  };

  return (
    <BodyWrapper>
      <PageSafeContainer style={styles.container}>
        <Header
          contentContainerStyle={{
            backgroundColor: 'transparent',
          }}
          titleStyles={{
            color: '#FFF',
          }}
          leftWidget={
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          }
          title="Personal Info"
          showBack
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* ── Avatar section ── */}
          {/*  <View style={styles.avatarSection}>
            <Avatar
              imageUrl={user?.image?.url}
              name={user?.name}
              uploading={false}
              onPress={() => {}}
            />
            <Text style={styles.avatarHint}>Tap to change profile photo</Text>
          </View> */}

          {/* ── Read-only info ── */}
          <View style={styles.section}>
            <Text style={sec.title}>Account</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Mail size={14} color={GOLD} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Editable fields ── */}
          <View style={styles.section}>
            <Text style={sec.title}>Details</Text>

            <View
              style={{
                gap: 10,
              }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    variant="dark"
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Your full name"
                    icon={<User size={16} color={GOLD} />}
                    errorMessage={errors.name?.message}
                    error={!!errors.name?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    variant="dark"
                    label="Phone"
                    value={value}
                    onChangeValue={onChange}
                    placeholder="+1 (555) 000-0000"
                    errorMessage={errors.phone?.message}
                    error={!!errors.phone?.message}
                  />
                )}
              />

              {/*  <Controller
                name="preferenceLanguage"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField
                    label="Preferred Language"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. English, Spanish"
                    icon={<Globe size={16} color={GOLD} />}
                  />
                )}
              /> */}
            </View>
          </View>

          <PrimaryButton
            size={ButtonSize.LARGE}
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            loading={loadingUpdate}
            disabled={!isDirty}
            style={styles.saveBtn}
          />
        </ScrollView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const sec = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: GOLD,
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    gap: 24,
    paddingBottom: 48,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  avatarHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  section: {
    gap: 0,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  saveBtn: {
    marginTop: 8,
  },
});
