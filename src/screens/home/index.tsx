import React from 'react';
import { BodyWrapper } from '~/codidge_components/UI/bodyWrapper';
import { HeaderCallToAction } from './components/header';
import { ScrollView } from 'react-native';
import { CarsCategories } from './components/cars_categories';
import { QuickBook } from './components/quickBooks';

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
        <QuickBook />
        <CarsCategories />
      </ScrollView>
    </BodyWrapper>
  );
};
