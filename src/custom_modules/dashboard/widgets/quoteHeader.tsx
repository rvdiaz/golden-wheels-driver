import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Card } from '~/components/Card';
import { TrendingUp } from 'lucide-react-native';

export function QuoteWidget() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const realEstateQuotes = [
    {
      text: 'My potential is limitless.',
      author: 'Daily Affirmation',
    },
    {
      text: 'Every expert was once a beginner. Every pro was once an amateur.',
      author: 'Robin Sharma',
    },
    {
      text: 'Success in real estate starts when you believe you are worthy of it.',
      author: 'Real Estate Wisdom',
    },
    {
      text: 'The best investment on earth is earth.',
      author: 'Louis Glickman',
    },
    {
      text: "Don't wait to buy real estate. Buy real estate and wait.",
      author: 'Will Rogers',
    },
    {
      text: 'Your network is your net worth in real estate.',
      author: 'Industry Insight',
    },
    {
      text: "Dreams don't work unless you do.",
      author: 'John C. Maxwell',
    },
    {
      text: "Location, location, location isn't about geography - it's about opportunity.",
      author: 'Real Estate Pro',
    },
  ];

  const rotateQuote = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % realEstateQuotes.length);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      rotateQuote();
    }, 10000); // Auto-rotate every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentQuote = realEstateQuotes[currentQuoteIndex];

  return (
    <Card style={styles.bannerCard}>
      <TrendingUp size={32} style={styles.quoteIcon} />
      <Animated.View style={[styles.bannerText, { opacity: fadeAnim }]}>
        <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
        <View style={styles.authorContainer}>
          <View style={styles.authorLine} />
          <Text style={styles.authorText}>— {currentQuote.author}</Text>
        </View>
      </Animated.View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    marginBottom: 24,
    padding: 24,
    overflow: 'hidden',
  },
  bannerText: {
    flex: 1,
    paddingRight: 16,
  },
  quoteIcon: {
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
