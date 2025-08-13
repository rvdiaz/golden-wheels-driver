import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp, ParamListBase } from '@react-navigation/native';
import { NotificationButton } from '~/components/NotificationButton';

type ScreenOptionsProps = {
  navigation: BottomTabNavigationProp<ParamListBase, string>;
  route: RouteProp<ParamListBase, string>;
  theme: any;
};

export const TopBar = ({ navigation, route }: ScreenOptionsProps): BottomTabNavigationOptions => {
  const isDashboard = route.name.toLowerCase() === 'dashboard';
  const IconProfile = Icons.UserCircle;

  return {
    headerTitle: isDashboard ? '' : route.name, // center empty
    headerLeft: () =>
      isDashboard && (
        <View style={styles.headerLeft}>
          <Text style={styles.leftText} numberOfLines={1}>
            {isDashboard ? 'Welcome, John' : route.name}
          </Text>
        </View>
      ),

    headerRight: () =>
      isDashboard && (
        <View style={styles.headerRight}>
          <NotificationButton navigation={navigation} />
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}>
            <IconProfile size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    headerTitleAlign: 'center',
  };
};

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 16, // matches app padding
  },
  leftText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  profileButton: {
    marginLeft: 20,
  },
});
