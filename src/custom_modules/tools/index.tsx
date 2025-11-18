import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Icons from 'lucide-react-native';
import { IFeatureModule, ModuleKeys } from '~/store/interface';
import { theme } from '~/theme/theme';
import { useReactiveVar } from '@apollo/client';
import { userData } from '~/store/user';
import Text from '~/codidge_components/UI/text';
import { localToolModules } from '~/store/helpers';
import { subscriptionStatusData, paywallVisibility } from '~/store/subscription';
import { LinearGradient } from 'expo-linear-gradient';

export const ToolsScreen: React.FC = () => {
  const { hasActiveSubscription: hasSubscription } = useReactiveVar(subscriptionStatusData);
  const navigation = useNavigation();
  const currentUserData = useReactiveVar(userData);

  const userToolsConfig = currentUserData?.modules.find(
    (mod) => mod.moduleKey === ModuleKeys.tools
  );

  const layout = JSON.parse(userToolsConfig?.metaData);
  const moduleLayout = layout.moduleLayout || {};
  const columns = layout.columns || 2;

  const userTools = userToolsConfig?.modules ?? [];
  const currentTools = [...userTools, ...localToolModules];

  // Function to adjust color opacity
  const adjustColorOpacity = (color: string, opacity: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      return color.replace(/rgba?\(([^)]+)\)/, (match, values) => {
        const parts = values.split(',').map((v: string) => v.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      });
    }
    return `rgba(0, 0, 0, ${opacity})`;
  };

  const renderTool = (tool: IFeatureModule) => {
    let IconComponent = Icons.Calculator;
    if (tool.icon && (Icons as any)[tool.icon]) {
      IconComponent = (Icons as any)[tool.icon];
    } else {
      console.warn('Icon not found for', tool.icon);
    }

    const iconColor = tool?.color ?? '#000';
    const iconBackgroundColor = adjustColorOpacity(iconColor, 0.15);
    const comingSoon = tool.comingSoon;
    
    // Check if tool requires subscription and user doesn't have it
    const requiresSubscription = tool.subscriptionRequired;
    const isLocked = requiresSubscription && !hasSubscription;

    const handleToolPress = () => {
      
      if (isLocked) {
        // Show paywall for locked tools
        paywallVisibility(true);
      } else {
        // Navigate normally for unlocked tools
        navigation.navigate(tool.moduleKey as never);
      }
    };

    return (
      <TouchableOpacity
        key={tool.moduleKey}
        style={[
          styles.toolCard,
          { backgroundColor: tool?.backgroundColor ?? '#FFF' },
          isLocked && !comingSoon && styles.lockedCard
        ]}
        onPress={handleToolPress}
      >
        {/* Premium badge overlay */}
        {isLocked && !comingSoon && (
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.info]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBadgeGradient}
            >
              <Icons.Crown size={12} color="#FFF" />
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </LinearGradient>
          </View>
        )}

        <View
          style={[
            styles.toolIcon,
            { backgroundColor: iconBackgroundColor },
            (comingSoon || isLocked) && styles.toolCardDisabled,
          ]}
        >
          {isLocked && !comingSoon && (
            <View style={styles.lockOverlay}>
              <Icons.Lock size={18} color={theme.colors.primary} />
            </View>
          )}
          <IconComponent 
            size={28} 
            color={iconColor} 
            style={isLocked && !comingSoon  && { opacity: 0.5 }}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[
            styles.toolTitle,
            (comingSoon || isLocked) && styles.toolCardDisabled
          ]}>
            {tool?.label ?? ''}
          </Text>
          
          {comingSoon && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
              <Icons.Clock size={16} color="#FFF" />
            </View>
          )}
        </View>

        <Text style={[
          styles.toolDescription,
          isLocked && !comingSoon  && styles.lockedDescription
        ]}>
          {tool?.description ?? ''}
        </Text>

        {/* Upgrade button for locked tools */}
        {isLocked && !comingSoon &&  (
          <View style={styles.upgradeButtonContainer}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.info]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upgradeButton}
            >
              <Icons.Sparkles size={14} color="#FFF" />
              <Text style={styles.upgradeButtonText}>Upgrade to Unlock</Text>
              <Icons.ChevronRight size={14} color="#FFF" />
            </LinearGradient>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const availableTools = currentTools.filter((too) => too.available);

  // Assign column & order from metadata
  const modulesWithPosition = availableTools.map((tool, index) => ({
    ...tool,
    column: moduleLayout[tool.moduleKey]?.column ?? (index % columns) + 1,
    order: moduleLayout[tool.moduleKey]?.order ?? index,
  }));

  // Divide into columns
  const columnsData = [];
  for (let i = 1; i <= columns; i++) {
    columnsData.push(
      modulesWithPosition.filter((tool) => tool.column === i).sort((a, b) => a.order - b.order)
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Real Estate Tools</Text>
          <Text style={styles.headerSubtitle}>
            Professional tools to help you serve your clients better
          </Text>
        </View>

        {layout.layout === 'masonry' ? (
          // ✅ Masonry layout with multiple columns
          <View style={{ flexDirection: 'row' }}>
            {columnsData.map((column, colIndex) => (
              <View key={colIndex} style={{ flex: 1, paddingHorizontal: 4 }}>
                {column.map((tool) => renderTool(tool))}
              </View>
            ))}
          </View>
        ) : (
          // ✅ Fallback: Single column layout
          <View>{availableTools.map((tool) => renderTool(tool))}</View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 4,
  },
  toolCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'visible',
  },
  lockedCard: {
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  lockedDescription: {
    opacity: 0.7,
  },
  toolCardDisabled: {
    opacity: 0.6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  comingSoonBadge: {
    backgroundColor: 'orange',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  premiumBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    zIndex: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  upgradeButtonContainer: {
    marginTop: 8,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  upgradeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
});