import { StyleSheet, View } from 'react-native';

export const AuthFormWrapper = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
        }}>
        {header ?? <View></View>}
      </View>
      {/* Form Container */}
      <>{children}</>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
