import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleKeys } from '~/store/interface';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { theme } from '~/theme/theme';
import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { moduleScreens } from '~/store/config';
import { NotificationButton } from '~/core_modules/notifications/widgets/notificationButton';

interface CustomHeaderProps {
  navigation: any;
  route: ModuleKeys;
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string;
  widgetComponent?: React.ReactNode;
  widgetBackgroundColor?: string;
  borderRadius?: number;
  headerHeight?: number;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  route,
  backgroundColor = '#ffffff',
  textColor = '#fff',
  widgetComponent,
  widgetBackgroundColor,
  borderRadius = 24,
  headerHeight = 56,
}) => {
  const userInfo = useReactiveVar(userData);

  const insets = useSafeAreaInsets();
  const isDashboard = route === ModuleKeys.dashboard;
  const IconProfile = Icons.UserCircle;
  const today = moment().format('dddd, DD MMMM');

  const module: any = moduleScreens[route];
  const RightHeader = module.rightHeader;
  const BottomHeader = module.bottomHeader;

  return (
    <View style={styles.container}>
      {/* Header Background - dynamically sized */}
      <View
        style={[
          styles.headerBackground,
          {
            paddingTop: insets.top,
            backgroundColor,
            paddingHorizontal: 16,
            minHeight: headerHeight + insets.top,
          },
        ]}>
        {/* Main Header Content */}
        <View style={[styles.headerContent, { height: headerHeight }]}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {isDashboard && (
              <Text style={styles.dateText} numberOfLines={1}>
                {today}
              </Text>
            )}
            {isDashboard ? (
              <Text style={[styles.welcomeText, { color: textColor }]} numberOfLines={1}>
                {`Welcome, ${userInfo?.firstName}`}
              </Text>
            ) : (
              <Text
                style={[styles.welcomeText, { color: textColor, fontSize: 30 }]}
                numberOfLines={1}>
                {route}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <NotificationButton navigation={navigation} />
            <IconButton
              onPress={() => navigation.navigate(ModuleKeys.profile)}
              variant="plain"
              style={styles.profileButton}
              icon={<IconProfile size={22} color="#FFF" />}
            />
          </View>
        </View>

        {/* Bottom Header - measure its height */}
        <View style={{ marginBottom: 30 }}>{BottomHeader && <BottomHeader />}</View>
      </View>

      {/* Widget Area - dynamically sized with overlapping border radius */}
      {widgetComponent && (
        <View
          style={[
            styles.widgetContainer,
            {
              backgroundColor: widgetBackgroundColor || theme.colors.bodyBackground,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              marginTop: -borderRadius, // Fallback to borderRadius if height not measured yet
            },
          ]}></View>
      )}

      {/* Curved bottom section - only show if no widgets */}
      {!widgetComponent && (
        <View
          style={[
            styles.curvedBottom,
            {
              backgroundColor: theme.colors.bodyBackground,
              borderTopEndRadius: borderRadius,
              borderTopLeftRadius: borderRadius,
              height: borderRadius,
              marginTop: -borderRadius,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
  },
  headerBackground: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
  },
  dateText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'SF Pro',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'SF Pro',
  },
  profileButton: {
    borderRadius: 50,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  widgetContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  widgetContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    // No fixed height - let content determine height
  },
  curvedBottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
