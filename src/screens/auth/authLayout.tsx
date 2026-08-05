import { Image, ScrollView, StyleSheet, View } from 'react-native';
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
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
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
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
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
