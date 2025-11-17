import { X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import Text from '~/codidge_components/UI/text';
import { useQuoteManager } from '../customHooks/useQuoteManager';

export const QuoteWidget = () => {
  const { currentQuote, isVisible, isLoading, closeQuote } = useQuoteManager();

  // Don't render anything if loading
  if (isLoading) {
    return (
      <Card style={styles.bannerCard}>
        <View style={[styles.bannerContent, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#CBCFF0" />
        </View>
      </Card>
    );
  }

  // Don't render if not visible or no quote
  if (!isVisible || !currentQuote) {
    return null;
  }

  return (
    <Card style={styles.bannerCard}>
      <View style={styles.bannerContent}>
        {/* Image on the left */}
        <Image source={require('assets/home-hand.png')} style={styles.bannerImage} />

        {/* Quote content and close button */}
        <View style={styles.contentContainer}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText} numberOfLines={3}>
              "{currentQuote.text}"
            </Text>
            <Text style={styles.authorText}>— {currentQuote.author}</Text>
          </View>

          <TouchableOpacity
            onPress={closeQuote}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X color={'#CBCFF0'} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#39238A',
    paddingVertical: 12,
    paddingRight: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  bannerImage: {
    width: 73,
    height: 63,
    marginRight: 12,
    marginLeft: -12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quoteContainer: {
    flex: 1,
    gap: 8,
    paddingRight: 8,
  },
  quoteText: {
    color: '#CBCFF0',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  authorText: {
    color: '#CBCFF0',
    fontSize: 12,
    opacity: 0.9,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
