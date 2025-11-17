import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { IQuote, quotes } from '../data/quotes';

interface QuoteState {
  currentQuote: IQuote | null;
  isVisible: boolean;
  isLoading: boolean;
}

const STORAGE_KEYS = {
  LAST_CLOSED_DATE: '@quote_widget_last_closed',
  LAST_SHOWN_DATE: '@quote_widget_last_shown',
  LAST_QUOTE_INDEX: '@quote_widget_last_index',
};

export const useQuoteManager = () => {
  const [state, setState] = useState<QuoteState>({
    currentQuote: null,
    isVisible: false,
    isLoading: true,
  });

  useEffect(() => {
    initializeQuote();
  }, []);

  const initializeQuote = async () => {
    try {
      const today = new Date().toDateString();

      // Get stored data
      const [lastClosedDate, lastShownDate, lastQuoteIndex] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LAST_CLOSED_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SHOWN_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_QUOTE_INDEX),
      ]);

      // Check if user closed the widget today
      if (lastClosedDate === today) {
        setState({
          currentQuote: null,
          isVisible: false,
          isLoading: false,
        });
        return;
      }

      // Determine which quote to show
      let quoteIndex: number;

      if (lastShownDate === today && lastQuoteIndex !== null) {
        // Same day, show the same quote
        quoteIndex = parseInt(lastQuoteIndex, 10);
      } else {
        // New day, get next quote
        quoteIndex = getNextQuoteIndex(lastQuoteIndex);

        // Save the new quote index and date
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.LAST_SHOWN_DATE, today),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_QUOTE_INDEX, quoteIndex.toString()),
        ]);
      }

      setState({
        currentQuote: quotes[quoteIndex],
        isVisible: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error initializing quote:', error);
      // Fallback to first quote if there's an error
      setState({
        currentQuote: quotes[0],
        isVisible: true,
        isLoading: false,
      });
    }
  };

  const getNextQuoteIndex = (lastIndex: string | null): number => {
    if (lastIndex === null) {
      // First time showing a quote, start with a random one
      return Math.floor(Math.random() * quotes.length);
    }

    const previousIndex = parseInt(lastIndex, 10);
    // Simply cycle through quotes
    return (previousIndex + 1) % quotes.length;
  };

  const closeQuote = async () => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CLOSED_DATE, today);

      setState((prev) => ({
        ...prev,
        isVisible: false,
      }));
    } catch (error) {
      console.error('Error saving close state:', error);
    }
  };

  const resetQuoteWidget = async () => {
    // Utility function to reset the widget (useful for testing)
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LAST_CLOSED_DATE,
        STORAGE_KEYS.LAST_SHOWN_DATE,
        STORAGE_KEYS.LAST_QUOTE_INDEX,
      ]);
      await initializeQuote();
    } catch (error) {
      console.error('Error resetting quote widget:', error);
    }
  };

  return {
    currentQuote: state.currentQuote,
    isVisible: state.isVisible,
    isLoading: state.isLoading,
    closeQuote,
    resetQuoteWidget,
  };
};
