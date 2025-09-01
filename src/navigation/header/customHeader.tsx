import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationButton } from '~/components/NotificationButton';
import { ModuleKeys } from '~/store/interface';
import IconButton from '~/codidge_components/UI/button/IconButton';
import { theme } from '~/theme/theme';
import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { moduleScreens } from '~/store/config';

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
  // Remove widgetHeight since we'll calculate it dynamically
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
  const [widgetHeight, setWidgetHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const isDashboard = route === ModuleKeys.dashboard;
  const IconProfile = Icons.UserCircle;
  const today = moment().format('dddd, DD MMMM');

  const module: any = moduleScreens[route];
  const RightHeader = module.rightHeader;
  const BottomHeader = module.bottomHeader;

  // Handle widget layout measurement
  const handleWidgetLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setWidgetHeight(height);
  };

  // Handle BottomHeader layout measurement
  const [bottomHeaderHeight, setBottomHeaderHeight] = useState(0);
  const handleBottomHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setBottomHeaderHeight(height);
  };

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
            // Dynamic height calculation:
            // - Basic header height
            // - Bottom header height (if exists)
            // - Half of widget height (for overlap effect)
            // - Extra padding
            minHeight: headerHeight + bottomHeaderHeight + widgetHeight / 2 + 30 + insets.top,
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
            <Text style={[styles.welcomeText, { color: textColor }]} numberOfLines={1}>
              {isDashboard ? `Welcome, ${userInfo?.email}` : route}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <NotificationButton badgeCount={2} navigation={navigation} />
            <IconButton
              onPress={() => navigation.navigate(ModuleKeys.profile)}
              variant="plain"
              style={styles.profileButton}
              icon={<IconProfile size={22} color="#FFF" />}
            />
          </View>
        </View>

        {/* Bottom Header - measure its height */}
        {BottomHeader && (
          <View onLayout={handleBottomHeaderLayout}>
            <BottomHeader />
          </View>
        )}
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
              // Dynamic margin - half of widget height for overlap
              marginTop: -(widgetHeight / 2 || borderRadius), // Fallback to borderRadius if height not measured yet
            },
          ]}>
          {/* Widget content wrapper - measures its own height */}
          <View style={styles.widgetContent} onLayout={handleWidgetLayout}>
            {widgetComponent}
          </View>
        </View>
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
