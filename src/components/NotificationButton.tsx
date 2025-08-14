import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ModuleKeys } from '~/store/interface';

export const NotificationButton = ({ navigation }: any) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(ModuleKeys.notifications)}>
      <Ionicons name="notifications-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};
