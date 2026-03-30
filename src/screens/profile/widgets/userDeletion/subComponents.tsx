import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { AlertTriangle, ShieldAlert, X, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';

const RED = '#EF4444';
const RED_DIM = 'rgba(239,68,68,0.12)';
const RED_BORDER = 'rgba(239,68,68,0.25)';

// ─── Warning item ─────────────────────────────────────────────────────────────

const WarningItem = ({ text }: { text: string }) => (
  <View style={warn.row}>
    <View style={warn.dot} />
    <Text style={warn.text}>{text}</Text>
  </View>
);

// ─── Step 1 — Warning ─────────────────────────────────────────────────────────

export const StepWarning = ({
  onCancel,
  onContinue,
}: {
  onCancel: () => void;
  onContinue: () => void;
}) => (
  <View style={step.wrapper}>
    {/* Icon */}
    <View style={step.iconWrap}>
      <AlertTriangle size={32} color={RED} strokeWidth={1.8} />
    </View>

    <Text style={step.title}>Delete Account?</Text>
    <Text style={step.desc}>
      This action is permanent and cannot be undone. All your data will be deleted, including:
    </Text>

    {/* Warning list */}
    <View style={warn.card}>
      <WarningItem text="Your profile and account information" />
      <WarningItem text="All booking history and records" />
      <WarningItem text="Saved payment methods" />
      <WarningItem text="Preferences and settings" />
    </View>

    {/* Actions */}
    <View style={step.actions}>
      <TouchableOpacity onPress={onCancel} style={step.cancelBtn} activeOpacity={0.75}>
        <Text style={step.cancelLabel}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onContinue} activeOpacity={0.8} style={{ flex: 1 }}>
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={step.continueBtn}>
          <Text style={step.continueBtnLabel}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Step 2 — Final confirmation ──────────────────────────────────────────────

export const StepConfirm = ({
  onBack,
  onDelete,
  loading,
}: {
  onBack: () => void;
  onDelete: () => void;
  loading: boolean;
}) => {
  const [text, setText] = useState('');
  const canDelete = text === 'DELETE' && !loading;

  return (
    <View style={step.wrapper}>
      <View style={[step.iconWrap, { backgroundColor: 'rgba(220,38,38,0.15)' }]}>
        <ShieldAlert size={32} color="#DC2626" strokeWidth={1.8} />
      </View>

      <Text style={step.title}>Final Confirmation</Text>
      <Text style={step.desc}>
        Type <Text style={step.deleteWord}>DELETE</Text> below to permanently delete your account.
      </Text>

      {/* Input */}
      <View style={confirm.inputWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type DELETE here"
          placeholderTextColor="rgba(255,255,255,0.25)"
          autoCapitalize="characters"
          autoCorrect={false}
          style={confirm.input}
        />
      </View>

      {/* Actions */}
      <View style={step.actions}>
        <TouchableOpacity onPress={onBack} style={step.cancelBtn} activeOpacity={0.75}>
          <ArrowLeft size={15} color="rgba(255,255,255,0.6)" />
          <Text style={step.cancelLabel}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          disabled={!canDelete}
          activeOpacity={0.8}
          style={{ flex: 1, opacity: canDelete ? 1 : 0.4 }}>
          <LinearGradient
            colors={['#DC2626', '#991B1B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={step.continueBtn}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={step.continueBtnLabel}>Delete Forever</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const warn = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: RED,
    marginTop: 6,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(239,68,68,0.85)',
    lineHeight: 19,
  },
});

const confirm = StyleSheet.create({
  inputWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 2,
    padding: 0,
    margin: 0,
  },
});

const step = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: RED_DIM,
    borderWidth: 1,
    borderColor: RED_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteWord: {
    fontWeight: '700',
    color: RED,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  continueBtnLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
