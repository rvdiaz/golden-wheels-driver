import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp, ParamListBase } from '@react-navigation/native';
import { NotificationButton } from '~/components/NotificationButton';
import { ModuleKeys } from '~/store/interface';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type ScreenOptionsProps = {
  navigation: BottomTabNavigationProp<ParamListBase, string>;
  route: RouteProp<ParamListBase, string>;
  theme: any;
};

export const TopBar = ({ navigation, route }: ScreenOptionsProps): BottomTabNavigationOptions => {
  const isDashboard = route.name.toLowerCase() === 'dashboard';
  const IconProfile = Icons.UserCircle;

  return {
    headerTitle: isDashboard ? '' : route.name,
    headerTitleAlign: 'center',

    headerLeft: () =>
      isDashboard && (
        <View style={styles.headerLeft}>
          <Text style={styles.leftText} numberOfLines={1}>
            Welcome, John
          </Text>
        </View>
      ),
    headerRight: () => (
      <View style={styles.headerRight}>
        <NotificationButton navigation={navigation} />
        <TouchableOpacity
          onPress={() => navigation.navigate(ModuleKeys.profile)}
          style={styles.profileButton}>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientCircle}>
            <IconProfile size={26} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 16,
  },
  leftText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'HelveticaNeue-Medium',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 12,
  },
  profileButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  gradientCircle: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
