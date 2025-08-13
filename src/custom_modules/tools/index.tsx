import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';

export const ToolsScreen: React.FC = () => {
  const navigation = useNavigation();

  const openDocumentation = (url: string) => {
    Linking.openURL(url);
  };

  const tools = [
    {
      id: 'mortgageCalculator',
      title: 'Mortgage Calculator',
      description: 'Calculate monthly mortgage payments',
      icon: 'Calculator',
      color: '#2563EB',
      backgroundColor: '#EEF2FF',
      route: 'MortgageCalculator',
    },
    {
      id: 'prequalifiedTools',
      title: 'Loan Prequalification',
      description: 'Calculate how much your client can borrow based on income',
      icon: 'BadgeCheck',
      color: '#059669',
      backgroundColor: '#ECFDF5',
      route: 'PrequalifiedLoan',
    },
    {
      id: 'propertyTools',
      title: 'Property Information',
      description: 'Get owner and property details by address',
      icon: 'Home',
      color: '#DC2626',
      backgroundColor: '#FEF2F2',
      route: 'PropertyInfo',
    },
    {
      id: 'expiredListing',
      title: 'Expired Listings',
      description: 'Find expired listings in your target area',
      icon: 'ClockX',
      color: '#EA580C',
      backgroundColor: '#FFF7ED',
      route: 'ExpiredListings',
    },
  ];

  const documentationLinks = [
    {
      title: 'Mortgage Basics',
      description: 'Understanding mortgage calculations and terms',
      url: '',
      icon: 'BookOpen',
    },
    {
      title: 'Real Estate Math',
      description: 'Essential calculations for real estate professionals',
      url: '',
      icon: 'Calculator',
    },
    {
      title: 'Loan Qualification',
      description: 'Guidelines for loan prequalification',
      url: '',
      icon: 'FileText',
    },
  ];

  const renderTool = (tool: any) => {
    const IconComponent = (Icons as any)[tool.icon] || Icons.Calculator;

    return (
      <TouchableOpacity
        key={tool.id}
        style={styles.toolCard}
        onPress={() => {
          navigation.navigate(tool.id as never);
        }}>
        <View style={[styles.toolIcon, { backgroundColor: tool.backgroundColor }]}>
          <IconComponent size={28} color={tool.color} />
        </View>
        <View style={styles.toolContent}>
          <Text style={styles.toolTitle}>{tool.title}</Text>
          <Text style={styles.toolDescription}>{tool.description}</Text>
        </View>
        <View style={styles.toolArrow}>
          <Icons.ChevronRight size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDocLink = (doc: any) => {
    const IconComponent = (Icons as any)[doc.icon] || Icons.BookOpen;

    return (
      <TouchableOpacity key={doc.title} style={styles.docCard} onPress={() => {}}>
        <View style={styles.docIcon}>
          <IconComponent size={20} color="#6B7280" />
        </View>
        <View style={styles.docContent}>
          <Text style={styles.docTitle}>{doc.title}</Text>
          <Text style={styles.docDescription}>{doc.description}</Text>
        </View>
        <Icons.ExternalLink size={16} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Real Estate Calculators</Text>
          <Text style={styles.headerSubtitle}>
            Professional tools to help you serve your clients better
          </Text>
        </View>

        <View style={styles.toolsGrid}>{tools.map(renderTool)}</View>

        <Card style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <Icons.Lightbulb size={24} color="#F59E0B" />
            <Text style={styles.featuredTitle}>Pro Tip</Text>
          </View>
          <Text style={styles.featuredText}>
            Use these calculators during client meetings to provide instant, professional estimates.
            Always recommend clients get pre-approved with a lender for accurate qualification.
          </Text>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Documentation & Resources</Text>
          <Text style={styles.sectionSubtitle}>
            Learn more about real estate calculations and industry standards
          </Text>
        </View>

        <View style={styles.docSection}>{documentationLinks.map(renderDocLink)}</View>

        <Card style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Icons.AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
          </View>
          <Text style={styles.disclaimerText}>
            These calculators provide estimates only. Actual loan terms, payments, and
            qualifications may vary based on lender requirements, credit scores, and other factors.
            Always consult with qualified mortgage professionals for accurate information.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  toolsGrid: {
    marginBottom: 24,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  toolArrow: {
    marginLeft: 8,
  },
  featuredCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 20,
    marginBottom: 24,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  docSection: {
    marginBottom: 24,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  docDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  disclaimerCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 16,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#A16207',
    lineHeight: 16,
  },
});
