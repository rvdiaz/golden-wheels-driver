import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export const NotificationButton = ({ navigation }: any) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <Ionicons name="notifications-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};
