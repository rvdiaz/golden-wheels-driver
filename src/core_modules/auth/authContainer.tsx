import { StyleSheet, View } from 'react-native';
import { FadeTransition } from '~/codidge_components/UI/transitions/fadeIn';
import { theme } from '~/theme/theme';

export const AuthFormWrapper = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View
        style={{
          paddingHorizontal: 20,
        }}>
        {header}
      </View>
      {/* Form Container */}
      <View style={styles.formContainer}>
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
    marginTop: 20,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
  },
});
