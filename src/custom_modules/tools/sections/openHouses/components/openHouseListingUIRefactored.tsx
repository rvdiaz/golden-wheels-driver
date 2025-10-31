import { useState } from 'react';
import { OpenHouseListing, OpenHouseListingStatus } from '../interfaces';
import {
  Calendar,
  FileText,
  MapPin,
  Send,
  Users,
  XCircle,
  Home,
  Bed,
  Bath,
} from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { ActivityIndicator, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import { Badge } from './badge';
import { theme } from '~/theme/theme';

interface IOpenHouseListingProps {
  listing: OpenHouseListing;
  onRequestBooking: (
    listingId: OpenHouseListing,
    requestedDate: string,
    requestedTime: string,
    requestMessage: string
  ) => Promise<boolean>;
  onDeleteListing: (listingId: string) => Promise<boolean>;
  selected: boolean;
  setSelected: (listing: OpenHouseListing | null) => void;
  isLoading?: boolean;
}

export const OpenHouseListingCardRefactored = (props: IOpenHouseListingProps) => {
  const { listing, onRequestBooking, onDeleteListing, isLoading, selected, setSelected } = props;
  const user = useReactiveVar(userData);

  const [requestMessage, setRequestMessage] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const primaryColor = theme?.colors.primary;

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const hadError = await onDeleteListing(id);
    if (!hadError) {
      setConfirmingDelete(false);
    }
    setIsDeleting(false);
  };

  const handleRequestBooking = async () => {
    const hadError = await onRequestBooking(listing, requestedDate, requestedTime, requestMessage);
    if (hadError) {
      return;
    }
    setRequestedDate('');
    setRequestedTime('');
    setRequestMessage('');
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Enhanced Property Header Section */}
        <View style={styles.propertySection}>
          {/* Property Image */}
          <View style={styles.imageContainer}>
            {listing.imageUrl ? (
              <Image
                source={{ uri: listing.imageUrl }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Home color="#9ca3af" size={40} />
                <Text style={styles.imagePlaceholderText}>No Image</Text>
              </View>
            )}

            {/* Status Badge Overlay */}
            <View style={styles.statusBadgeContainer}>
              {listing.status === OpenHouseListingStatus.ACTIVE ? (
                <Badge text="Available" variant="success" />
              ) : (
                <Badge text="Unavailable" variant="warning" />
              )}
            </View>
          </View>

          {/* Property Details */}
          <View style={styles.propertyDetails}>
            {/* Price Section */}
            {listing.mlsListingPrice && (
              <View style={styles.priceSection}>
                <Text style={styles.price}>{formatPrice(listing.mlsListingPrice)}</Text>
              </View>
            )}

            {/* Address Section */}
            <View style={styles.addressSection}>
              <View style={styles.addressRow}>
                <MapPin color="#6b7280" size={18} />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressMain}>{listing.address}</Text>
                  {listing.city && listing.state && listing.zipCode && (
                    <Text style={styles.addressSecondary}>
                      {listing.city}, {listing.state} {listing.zipCode}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Property Features */}
            {(listing.bedrooms || listing.bathrooms || listing.yearBuilt) && (
              <View style={styles.featuresContainer}>
                {listing.bedrooms && (
                  <View style={styles.feature}>
                    <Bed color="#6b7280" size={16} />
                    <Text style={styles.featureText}>{listing.bedrooms} Beds</Text>
                  </View>
                )}
                {listing.bathrooms && (
                  <View style={styles.feature}>
                    <Bath color="#6b7280" size={16} />
                    <Text style={styles.featureText}>{listing.bathrooms} Baths</Text>
                  </View>
                )}
                {listing.yearBuilt && (
                  <View style={styles.feature}>
                    <Calendar color="#6b7280" size={16} />
                    <Text style={styles.featureText}>Built {listing.yearBuilt}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Agent and MLS Info */}
            <View style={styles.metaInfoContainer}>
              <View style={styles.metaInfoRow}>
                <View style={styles.metaInfo}>
                  <FileText color="#9ca3af" size={14} />
                  <Text style={styles.metaLabel}>MLS #</Text>
                  <Text style={styles.metaValue}>{listing.mlsNumber}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaInfo}>
                  <Users color="#9ca3af" size={14} />
                  <Text style={styles.metaLabel}>Agent</Text>
                  <Text style={styles.metaValue}>{listing.mlsAgentFullName}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {listing.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{listing.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Booking Form Section - unchanged */}
        {!!selected ? (
          <View style={styles.bookingForm}>
            <Text style={styles.bookingFormTitle}>Request Open House Time Slot</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Preferred Date</Text>
                <InputField
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={requestedDate}
                  onChangeText={setRequestedDate}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Preferred Time</Text>
                <InputField
                  style={styles.input}
                  placeholder="HH:MM"
                  value={requestedTime}
                  onChangeText={setRequestedTime}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            <View>
              <Text style={styles.label}>Message to Publisher (Optional)</Text>
              <InputField
                style={[styles.input, styles.textArea]}
                placeholder="Any additional notes or special requests..."
                value={requestMessage}
                onChangeText={setRequestMessage}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, styles.buttonFlex]}
                onPress={() => handleRequestBooking()}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Send color="#fff" size={16} />
                    <Text style={styles.buttonText}>Send Request</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                onPress={() => setSelected(null)}>
                <Text style={styles.buttonOutlineText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : user?.id !== listing.ownerId && listing.status === OpenHouseListingStatus.ACTIVE ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline, styles.actionButton]}
            onPress={() => setSelected(listing)}>
            <Calendar color={primaryColor} size={16} />
            <Text style={styles.buttonOutlineText}>Request Time Slot</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!confirmingDelete && user?.id === listing.ownerId && (
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger, styles.actionButton]}
                onPress={() => setConfirmingDelete(true)}
                disabled={isDeleting}>
                <XCircle color="#fff" size={16} />
                <Text style={styles.buttonText}>Delete Listing</Text>
              </TouchableOpacity>
            )}
            {!!confirmingDelete && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                  onPress={() => handleDelete(listing.id)}
                  disabled={isDeleting}>
                  <XCircle color="#fff" size={16} />
                  <Text style={styles.buttonText}>Confirm Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                  onPress={() => setConfirmingDelete(false)}
                  disabled={isDeleting}>
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardContent: {
    backgroundColor: '#fff',
  },
  propertySection: {
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f9fafb',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  propertyDetails: {
    padding: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  addressSection: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  addressMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  metaInfoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e5e7eb',
  },
  metaLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  bookingForm: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    gap: 16,
    backgroundColor: '#fafafa',
  },
  bookingFormTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionButton: {
    margin: 16,
    marginTop: 0,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
});
