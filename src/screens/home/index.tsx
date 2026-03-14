import React from 'react';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { HeaderCallToAction } from './components/header';
import { DEMO_OPTIONS, QuickBook } from './components/quick_book';
import { ScrollView, View } from 'react-native';
import { CarsCategories, MOCK_CATEGORIES } from './components/cars_categories';

export const HomeScreen = () => {
  return (
    <BodyWrapper gradientCoverage={0.3} imageHeight={0.42}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          gap: 24,
        }}>
        <HeaderCallToAction
          title="Discover Your Next Adventure"
          subtitle="Curated for every traveler"
          buttonLabel="Book a Trip"
          onPress={() => {}}
        />
        <QuickBook
          options={DEMO_OPTIONS} // or omit for demo data
        />
        <CarsCategories
          categories={MOCK_CATEGORIES}
          onSelect={(id) => console.log('selected:', id)}
        />
      </ScrollView>
    </BodyWrapper>
  );
};
