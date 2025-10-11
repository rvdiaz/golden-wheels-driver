import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { theme } from '~/theme/theme';

export const AuthFormWrapper = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
        }}>
        {header}
      </View>
      {/* Form Container */}
      <View style={[styles.formContainer, { paddingBottom: Math.max(insets.bottom, 0) }]}>
        <View style={styles.contentContainer}>
          <FadeTransition isVisible={true} style={{ flex: 1 }}>
            {children}
          </FadeTransition>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
  },
});
