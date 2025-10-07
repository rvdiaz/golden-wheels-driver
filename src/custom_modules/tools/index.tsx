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

export const ToolsScreen: React.FC = () => {
  const navigation = useNavigation();

  const currentUserData = useReactiveVar(userData);

  const userTools =
    currentUserData?.modules.find((mod) => mod.moduleKey === ModuleKeys.tools)?.modules ?? [];

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

    return (
      <TouchableOpacity
        key={tool.moduleKey}
        style={[styles.toolCard, { backgroundColor: tool?.backgroundColor ?? '#FFF' }]}
        onPress={() => {
          if (!comingSoon) {
            navigation.navigate(tool.moduleKey as never);
          }
        }}>
        <View
          style={[
            styles.toolIcon,
            { backgroundColor: iconBackgroundColor },
            comingSoon && styles.toolCardDisabled,
          ]}>
          <IconComponent size={28} color={iconColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.toolTitle, comingSoon && styles.toolCardDisabled]}>
            {tool?.label ?? ''}
          </Text>
          {comingSoon && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
              <Icons.Clock size={16} color="#FFF" />
            </View>
          )}
        </View>
        <Text style={[styles.toolDescription]}>{tool?.description ?? ''}</Text>
      </TouchableOpacity>
    );
  };

  const availableTools = currentTools.filter((too) => too.available);

  // Split tools into two columns for masonry effect
  const leftColumn = availableTools.filter((_, index) => index % 2 === 0);
  const rightColumn = availableTools.filter((_, index) => index % 2 === 1);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Real Estate Tools</Text>
          <Text style={styles.headerSubtitle}>
            Professional tools to help you serve your clients better
          </Text>
        </View>

        <View style={styles.masonryContainer}>
          <View style={styles.column}>{leftColumn.map((tool) => renderTool(tool))}</View>
          <View style={styles.column}>{rightColumn.map((tool) => renderTool(tool))}</View>
        </View>
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
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
});
