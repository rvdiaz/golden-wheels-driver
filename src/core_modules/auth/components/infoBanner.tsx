import { Flag } from 'lucide-react-native';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Text from '~/codidge_components/UI/text';

// Add this component above your PersonalInformation component
export const InfoBanner = ({ containerStyles }: { containerStyles?: ViewStyle }) => (
  <View style={[infoBannerStyles.container, containerStyles && containerStyles]}>
    <Flag size={16} color="#2563EB" style={infoBannerStyles.icon} />
    <Text style={infoBannerStyles.text}>
      This information is required for MLS data and to process rental applications
    </Text>
  </View>
);

const infoBannerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});
