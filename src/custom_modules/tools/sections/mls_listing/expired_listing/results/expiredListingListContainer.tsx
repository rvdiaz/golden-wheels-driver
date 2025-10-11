import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import PropertyDetailScreen from './expiredListingScreen';
import ExpiredListingCard from './expiredListingCard';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const { width: screenWidth } = Dimensions.get('window');

interface PropertyListScreenProps {
  expListings: any[]; // Your listings array
  loadMore: () => void;
  dispose: () => void;
  loadingMore: boolean;
}

const ExpiredListingContainer: React.FC<PropertyListScreenProps> = ({
  expListings,
  dispose,
  loadMore,
  loadingMore,
}) => {
  const [selectedListing, setSelectedListing] = useState(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(0)).current;

  const handleCardPress = (listing: any) => {
    setSelectedListing(listing);

    // Start the transition animation
    Animated.parallel([
      // Slide the detail screen in from the right
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Scale the image for the hero transition
      Animated.timing(imageScaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {});
  };

  const handleCloseDetail = () => {
    // Animate back to list
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedListing(null);
    });
  };

  return (
    <PageSafeContainer style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Main List View */}
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -screenWidth], // Slide list to the left
              }),
            },
          ],
        }}>
        <Header title="Listings" onBack={dispose} showBack={true} />
        <FlatList
          data={expListings}
          keyExtractor={(item) => item.listingId}
          renderItem={({ item }) => (
            <ExpiredListingCard key={item.listingId} listing={item} onPress={handleCardPress} />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore} // 👈 load more when reaching bottom
          onEndReachedThreshold={0.5} // 0.5 = trigger when 50% before end
          ListFooterComponent={loadingMore ? <ActivityIndicator size="large" /> : null}
        />
      </Animated.View>

      {/* Detail Screen Overlay */}
      {selectedListing && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenWidth, 0], // Slide detail in from the right
                }),
              },
            ],
          }}>
          <PropertyDetailScreen
            listing={selectedListing}
            onClose={handleCloseDetail}
            imageAnimatedValue={imageScaleAnim}
          />
        </Animated.View>
      )}
    </PageSafeContainer>
  );
};

export default ExpiredListingContainer;
