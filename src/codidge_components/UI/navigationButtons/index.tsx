import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';

export interface INavigationSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: ReactNode;
    replacementWidget?: ReactNode;
    onClick: () => void;
  }[];
}

export const ProfileNavigationSection = ({ sections }: { sections: INavigationSection[] }) => {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          {/* Category Title */}
          {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

          {/* Navigation Items */}
          <View>
            {section.items.map((item, itemIndex) => {
              const isLastItem = itemIndex === section.items.length - 1;

              if (item.replacementWidget) {
                return <View key={item.id}>{item.replacementWidget}</View>;
              }

              return (
                <TouchableOpacity key={item.id} onPress={() => item.onClick()} activeOpacity={0.7}>
                  <View style={styles.itemContent}>
                    {/* Left Icon */}
                    <View style={styles.leftIconContainer}>{item.icon}</View>

                    {/* Text */}
                    <Text style={styles.itemText}>{item.label}</Text>

                    {/* Right Chevron */}
                    <View style={styles.chevronContainer}>
                      <Icons.ChevronRight size={24} />
                    </View>
                  </View>

                  {/* Bottom Border - not shown for last item */}
                  {!isLastItem && <View style={styles.itemBorder} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737373',
    textTransform: 'uppercase',
    paddingTop: 10,
    paddingBottom: 8,
  },

  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 48,
  },
  leftIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  chevronContainer: {
    marginLeft: 8,
  },
  itemBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
    marginLeft: 60, // Aligned with text start
  },
  iconPlaceholder: {
    fontSize: 20,
  },
});
