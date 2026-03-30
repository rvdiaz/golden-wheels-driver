import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Trash2, ArrowLeft } from 'lucide-react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { BottomSheetModal } from '~/components/bottomSheetModal';
import Text from '~/codidge_components/UI/text';
import { usePersonalInfo } from '../personalInfo/hooks/useCustomer';
import { StepConfirm, StepWarning } from './subComponents';

const RED = '#EF4444';
const RED_DIM = 'rgba(239,68,68,0.12)';
const RED_BORDER = 'rgba(239,68,68,0.25)';

// ─── Main Component button ───────────────────────────────────────────────────────────

export const AccountDeletionScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <BodyWrapper>
      <PageSafeContainer>
        <Header
          contentContainerStyle={{
            backgroundColor: 'transparent',
          }}
          titleStyles={{
            color: '#FFF',
          }}
          leftWidget={
            <TouchableOpacity onPress={onBack} style={trigger.iconBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          }
          title="Account Deletion"
          showBack
        />
        <View
          style={{
            margin: 16,
          }}>
          <AccountDeletionModal />
        </View>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

// ─── Trigger button ───────────────────────────────────────────────────────────

export const AccountDeletionModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { handleDeleteProfile, loadingDeletion } = usePersonalInfo();

  const handleOpen = () => {
    setStep(1);
    setOpen(true);
  };
  const handleClose = () => {
    setStep(1);
    setOpen(false);
  };

  const handleDelete = async () => {
    await handleDeleteProfile();
    handleClose();
  };

  return (
    <>
      {/* Trigger row */}
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.75} style={trigger.row}>
        <View style={trigger.iconWrap}>
          <Trash2 size={17} color={RED} strokeWidth={1.8} />
        </View>
        <Text style={trigger.label}>Delete Account</Text>
      </TouchableOpacity>

      {/* Sheet */}
      <BottomSheetModal
        visible={open}
        onClose={handleClose}
        hideClose
        scrollable={false}
        heightFraction={step === 1 ? 0.72 : 0.62}
        contentStyle={{ paddingHorizontal: 0, paddingTop: 0 }}>
        {step === 1 ? (
          <StepWarning onCancel={handleClose} onContinue={() => setStep(2)} />
        ) : (
          <StepConfirm
            onBack={() => setStep(1)}
            onDelete={handleDelete}
            loading={loadingDeletion}
          />
        )}
      </BottomSheetModal>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const trigger = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: RED_DIM,
    borderWidth: 1,
    borderColor: RED_BORDER,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: RED,
  },
});
