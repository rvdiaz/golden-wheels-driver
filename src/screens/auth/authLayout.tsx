import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { theme } from '~/theme/theme';

/**
 * Auth is a full screen in the driver app, not a bottom sheet — nothing is
 * reachable until a driver signs in, so this owns the whole viewport and
 * carries the brand.
 */
export const AuthFormWrapper = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <BodyWrapper>
      <PageSafeContainer>
        {/*
          Keyboard avoidance belongs here, wrapping the ScrollView — the auth
          forms each used to carry their own KeyboardAvoidingView *inside* this
          scroll view, where it can do nothing, so the keyboard covered the
          inputs. One KAV at the top, plain Views below it.
        */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}>
            <View style={styles.logoWrap}>
              <Image
                source={require('/assets/logoSingle1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {header ? <View style={styles.header}>{header}</View> : null}

            <View style={styles.form}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 180,
    height: 84,
  },
  header: {
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
  },
});
