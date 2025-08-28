import React from 'react';
import { IMlsListingItemResponse } from '../../interfaces';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/OutlineButton';
import { Share } from 'lucide-react-native';
import PropertyListingCard from './listingItem';

export const ExpiredListingResults = ({
  expListings,
  dispose,
}: {
  expListings: IMlsListingItemResponse[];
  dispose: () => void;
}) => {
  if (expListings.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
        <Header title="Mortgage Results" rightText="Close" rightAction={dispose} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center',
              marginBottom: 8,
            }}>
            No Results Found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 20,
            }}>
            We couldn't find any expired listings matching your criteria. Try adjusting your search
            parameters.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'flex-end' }}>
      <Header title="Mortgage Results" rightText="Close" rightAction={dispose} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {expListings.map((list) => (
          <PropertyListingCard
            key={list.listingId}
            listing={list}
            onPress={(listRes) => {
              console.log();
            }}
          />
        ))}
      </ScrollView>
      {/* <View
        style={{
          paddingVertical: 10,
        }}>
        <PrimaryButton
          size={ButtonSize.LARGE}
          style={{
            paddingVertical: 16,
            marginHorizontal: 16,
          }}
          title="Send Results"
          onPress={() => {}}
          rightWidget={<Share size={16} color="#FFF" style={{ marginLeft: 10 }} />}
        />
      </View> */}
    </SafeAreaView>
  );
};
