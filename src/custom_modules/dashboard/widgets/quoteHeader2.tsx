import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';

const realEstateQuotes = [
  {
    quote: 'Real estate is about the safest investment in the world.',
    author: 'Franklin D. Roosevelt',
  },
  {
    quote: "Buy land, they're not making it anymore.",
    author: 'Mark Twain',
  },
  {
    quote:
      "Real estate investing, even on a very small scale, remains a tried and true means of building an individual's cash flow and wealth.",
    author: 'Robert Kiyosaki',
  },
  {
    quote:
      'Every person who invests in well-selected real estate in a growing section of a prosperous community adopts the surest and safest method of becoming independent.',
    author: 'Theodore Roosevelt',
  },
  {
    quote:
      'Real estate is an imperishable asset, ever increasing in value. It is the most solid security that human ingenuity has devised.',
    author: 'Russell Sage',
  },
  {
    quote: 'The best investment on Earth is earth.',
    author: 'Louis Glickman',
  },
  {
    quote: 'Success in real estate starts when you believe you are worthy of it.',
    author: 'Michael Ferrara',
  },
  {
    quote: 'Real estate is the ultimate wealth builder and the wisest investment anyone can make.',
    author: 'Donald Trump',
  },
  {
    quote: 'In real estate, you make your money when you buy, not when you sell.',
    author: 'Anonymous',
  },
  {
    quote: 'The major fortunes in America have been made in land.',
    author: 'John D. Rockefeller',
  },
];

export default function AllQuotes() {
  return (
    <LinearGradient colors={['#1e3a8a', '#0ea5e9', '#14b8a6']} style={styles.container}>
      <View style={styles.header}>
        <TrendingUp color="#ffffff" size={32} />
        <Text style={styles.headerTitle}>All Inspirational Quotes</Text>
        <Text style={styles.headerSubtitle}>Real Estate Wisdom Collection</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {realEstateQuotes.map((item, index) => (
          <View key={index} style={styles.quoteCard}>
            <Text style={styles.quoteNumber}>#{index + 1}</Text>
            <Text style={styles.quoteText}>"{item.quote}"</Text>
            <View style={styles.authorContainer}>
              <View style={styles.authorLine} />
              <Text style={styles.authorText}>— {item.author}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f2fe',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  quoteNumber: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  authorContainer: {
    alignItems: 'flex-end',
  },
  authorLine: {
    width: 30,
    height: 1,
    backgroundColor: '#3b82f6',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
});
