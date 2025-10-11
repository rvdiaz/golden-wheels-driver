import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import {
  Search,
  Building,
  Info,
  Eye,
  Phone,
  Mail,
  User,
  Clock,
  ShieldCheck,
  ShieldX,
  Send,
  AlertTriangle,
  Gavel,
  TrendingDown,
  X,
} from 'lucide-react-native';
import {
  ComparableSale,
  ForeclosureProperty,
  generateMockComparableSales,
  generateMockForeclosureProperties,
  generateMockOwnerData,
  OwnerData,
} from './mocked';

export const ForeClosuresPage = () => {
  const navigation = useNavigation();

  const [zipCode, setZipCode] = useState<string>('');
  const [foreclosureStage, setForeclosureStage] = useState<string>('all');
  const [maxAuctionDate, setMaxAuctionDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [foreclosureProperties, setForeclosureProperties] = useState<ForeclosureProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<ForeclosureProperty | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [comparableSales, setComparableSales] = useState<ComparableSale[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [customTextMessage, setCustomTextMessage] = useState<string>('');
  const [sendingText, setSendingText] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      alert('Please enter a ZIP code');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const properties = generateMockForeclosureProperties(
        zipCode,
        foreclosureStage,
        maxAuctionDate
      );
      setForeclosureProperties(properties);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching foreclosures:', error);
      alert('Error searching foreclosures');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDetails = async (property: ForeclosureProperty) => {
    setSelectedProperty(property);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const ownerInfo = generateMockOwnerData(property);
      const comparables = generateMockComparableSales(property);

      setOwnerData(ownerInfo);
      setComparableSales(comparables);
      setShowDetails(true);
    } catch (error) {
      console.error('Error getting property details:', error);
      alert('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Pre-Foreclosure':
        return { bg: '#fef3c7', text: '#ca8a04', border: '#fcd34d' };
      case 'Auction':
        return { bg: '#fed7aa', text: '#c2410c', border: '#fdba74' };
      case 'REO/Bank Owned':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Pre-Foreclosure':
        return AlertTriangle;
      case 'Auction':
        return Gavel;
      case 'REO/Bank Owned':
        return Building;
      default:
        return Clock;
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmail || !customMessage.trim()) return;

    setSendingEmail(true);
    try {
      // TODO: Replace with Apollo mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Email sent successfully!');
      setShowEmailModal(false);
      setSelectedEmail('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendText = async () => {
    if (!selectedPhone || !customTextMessage.trim()) return;

    setSendingText(true);
    try {
      // TODO: Replace with Apollo mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Text message sent successfully!');
      setShowTextModal(false);
      setSelectedPhone('');
      setCustomTextMessage('');
    } catch (error) {
      console.error('Error sending text:', error);
      alert('Error sending text message');
    } finally {
      setSendingText(false);
    }
  };

  const renderBadge = (text: string, colors?: { bg: string; text: string; border: string }) => {
    const badgeStyle = colors
      ? {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }
      : {};
    const textStyle = colors ? { color: colors.text } : {};

    return (
      <View style={[styles.badge, badgeStyle]}>
        <Text style={[styles.badgeText, textStyle]}>{text}</Text>
      </View>
    );
  };

  const renderStageModal = () => (
    <Modal
      visible={showStageModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowStageModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Foreclosure Stage</Text>
            <TouchableOpacity onPress={() => setShowStageModal(false)}>
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            {['all', 'Pre-Foreclosure', 'Auction', 'REO/Bank Owned'].map((stage) => (
              <TouchableOpacity
                key={stage}
                style={styles.modalOption}
                onPress={() => {
                  setForeclosureStage(stage);
                  setShowStageModal(false);
                }}>
                <Text
                  style={[
                    styles.modalOptionText,
                    foreclosureStage === stage && styles.modalOptionTextActive,
                  ]}>
                  {stage === 'all' ? 'All Stages' : stage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  if (showDetails && selectedProperty) {
    return (
      <PageSafeContainer>
        <Header title="Property Details" showBack={true} onBack={() => setShowDetails(false)} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Property Address */}
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsAddress}>{selectedProperty.address}</Text>
            <Text style={styles.detailsSubtext}>
              {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
            </Text>
          </View>

          {/* Property Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Building color="#7c3aed" size={20} />
              <Text style={styles.cardTitle}>Property Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Case Number</Text>
                  <Text style={styles.detailValue}>{selectedProperty.caseNumber}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Foreclosure Stage</Text>
                  {renderBadge(
                    selectedProperty.foreclosureStage,
                    getStageColor(selectedProperty.foreclosureStage)
                  )}
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Auction Date</Text>
                  <Text style={styles.detailValue}>{selectedProperty.auctionDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Original Loan</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedProperty.originalLoanAmount)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Current Balance</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedProperty.currentBalance)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Estimated Value</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(selectedProperty.estimatedValue)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Minimum Bid</Text>
                  <Text style={styles.detailValue}>
                    {selectedProperty.minimumBid
                      ? formatCurrency(selectedProperty.minimumBid)
                      : 'TBD'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Property Type</Text>
                  <Text style={styles.detailValue}>{selectedProperty.propertyType}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Owner Information */}
          {ownerData && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <User color="#7c3aed" size={20} />
                <Text style={styles.cardTitle}>Owner Information</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.ownerSection}>
                  <Text style={styles.detailLabel}>Owner Name</Text>
                  <Text style={styles.detailValue}>{ownerData.ownerName}</Text>
                </View>

                <View style={styles.ownerSection}>
                  <Text style={styles.detailLabel}>Phone Numbers</Text>
                  {ownerData.phoneNumbers.map((phone: any, index: number) => (
                    <View key={index} style={styles.contactItem}>
                      <View style={styles.contactInfo}>
                        <Phone color="#6b7280" size={16} />
                        <Text style={styles.contactText}>{phone.number}</Text>
                        {renderBadge(phone.type)}
                        {phone.onDoNotCall ? (
                          <View style={[styles.badge, styles.badgeDanger]}>
                            <ShieldX color="#dc2626" size={12} />
                            <Text style={[styles.badgeText, styles.badgeTextDanger]}>DNC</Text>
                          </View>
                        ) : (
                          <View style={[styles.badge, styles.badgeSuccess]}>
                            <ShieldCheck color="#16a34a" size={12} />
                            <Text style={[styles.badgeText, styles.badgeTextSuccess]}>Safe</Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.buttonSmall,
                          styles.buttonOutline,
                          phone.onDoNotCall && styles.buttonDisabled,
                        ]}
                        onPress={() => {
                          setSelectedPhone(phone.number);
                          setCustomTextMessage(
                            `Hi ${ownerData.ownerName}, I'm a local real estate professional and I noticed your property at ${selectedProperty.address} is in foreclosure. I may be able to help you explore your options. Would you be interested in discussing this? This is not a solicitation.`
                          );
                          setShowTextModal(true);
                        }}
                        disabled={phone.onDoNotCall}>
                        <Send color="#7c3aed" size={14} />
                        <Text style={styles.buttonOutlineText}>Text</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <View style={styles.ownerSection}>
                  <Text style={styles.detailLabel}>Email Addresses</Text>
                  {ownerData.emailAddresses.map((email: any, index: number) => (
                    <View key={index} style={styles.contactItem}>
                      <View style={styles.contactInfo}>
                        <Mail color="#6b7280" size={16} />
                        <Text style={styles.contactText}>{email.email}</Text>
                        {renderBadge(email.type)}
                      </View>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonSmall, styles.buttonOutline]}
                        onPress={() => {
                          setSelectedEmail(email.email);
                          setCustomMessage(
                            `Dear ${ownerData.ownerName},\n\nI hope this email finds you well. My name is [Your Name] and I'm a local real estate professional. I noticed your property at ${selectedProperty.address} is currently in foreclosure proceedings.\n\nI understand this can be a stressful situation, and I wanted to reach out to see if there might be ways I can help you explore your options. Whether that's discussing a potential sale, connecting you with resources, or simply providing information about the process, I'm here to help.\n\nIf you'd like to have a confidential conversation about your situation, please feel free to reply to this email or call me directly. There's no obligation and no pressure - just a genuine offer to help if I can.\n\nBest regards,\n[Your Name]\n[Your Contact Information]`
                          );
                          setShowEmailModal(true);
                        }}>
                        <Mail color="#7c3aed" size={14} />
                        <Text style={styles.buttonOutlineText}>Email</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Occupancy Status</Text>
                    <Text style={styles.detailValue}>{ownerData.occupancyStatus}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Estimated Equity</Text>
                    <Text style={styles.detailValue}>
                      {formatCurrency(ownerData.equityEstimate)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Comparable Sales */}
          {comparableSales.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TrendingDown color="#7c3aed" size={20} />
                <Text style={styles.cardTitle}>Recent Comparable Sales</Text>
              </View>
              <View style={styles.cardContent}>
                {comparableSales.map((comp, index) => (
                  <View key={index} style={styles.compCard}>
                    <View style={styles.compHeader}>
                      <Text style={styles.compAddress}>{comp.address}</Text>
                      {renderBadge(`${comp.distance} miles`)}
                    </View>
                    <View style={styles.compDetails}>
                      <Text style={styles.compDetailText}>Sale: {comp.saleDate}</Text>
                      <Text style={styles.compDetailText}>
                        {comp.bedrooms}/{comp.bathrooms} bed/bath
                      </Text>
                      <Text style={styles.compDetailText}>{comp.sqft.toLocaleString()} sq ft</Text>
                      <Text style={styles.compDetailText}>{comp.daysOnMarket} DOM</Text>
                    </View>
                    <View style={styles.compPriceSection}>
                      <Text style={styles.compPrice}>{formatCurrency(comp.salePrice)}</Text>
                      <Text style={styles.compPricePerSqft}>
                        ${Math.round(comp.salePrice / comp.sqft)}/sq ft
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* MLS History */}
          {ownerData && ownerData.mlsHistory && ownerData.mlsHistory.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Building color="#3b82f6" size={20} />
                <Text style={styles.cardTitle}>MLS Listing History</Text>
              </View>
              <View style={styles.cardContent}>
                {ownerData.mlsHistory.map((listing: any, index: number) => (
                  <View key={index} style={styles.mlsCard}>
                    <View style={styles.mlsHeader}>
                      <View style={styles.mlsBadges}>
                        {renderBadge(listing.listingType)}
                        {renderBadge(listing.id)}
                        {renderBadge(
                          listing.status,
                          listing.status === 'Sold' || listing.status === 'Leased'
                            ? { bg: '#dcfce7', text: '#16a34a', border: '#86efac' }
                            : { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }
                        )}
                      </View>
                      <View style={styles.mlsPriceSection}>
                        <Text style={styles.mlsPrice}>
                          {listing.listingType === 'For Rent'
                            ? `${formatCurrency(listing.listPrice)}/mo`
                            : formatCurrency(listing.listPrice)}
                        </Text>
                        {listing.finalPrice && (
                          <Text style={styles.mlsFinalPrice}>
                            Final:{' '}
                            {listing.listingType === 'For Rent'
                              ? `${formatCurrency(listing.finalPrice)}/mo`
                              : formatCurrency(listing.finalPrice)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.mlsDetails}>
                      <View style={styles.mlsDetailItem}>
                        <Text style={styles.mlsDetailLabel}>Listed Date</Text>
                        <Text style={styles.mlsDetailValue}>{listing.listDate}</Text>
                      </View>
                      <View style={styles.mlsDetailItem}>
                        <Text style={styles.mlsDetailLabel}>End Date</Text>
                        <Text style={styles.mlsDetailValue}>{listing.endDate}</Text>
                      </View>
                      <View style={styles.mlsDetailItem}>
                        <Text style={styles.mlsDetailLabel}>Days on Market</Text>
                        <Text style={styles.mlsDetailValue}>{listing.daysOnMarket} days</Text>
                      </View>
                      <View style={styles.mlsDetailItem}>
                        <Text style={styles.mlsDetailLabel}>Agent</Text>
                        <Text style={styles.mlsDetailValue}>{listing.agent}</Text>
                      </View>
                    </View>
                    <View style={styles.mlsFooter}>
                      <Text style={styles.mlsBrokerage}>{listing.brokerage}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Info Alert */}
          <View style={styles.alert}>
            <Info color="#3b82f6" size={16} />
            <Text style={styles.alertText}>
              Real owner data and MLS history would come from licensed data providers and must be
              used in compliance with local real estate laws and regulations.
            </Text>
          </View>
        </ScrollView>

        {/* Email Modal */}
        <Modal
          visible={showEmailModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEmailModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.modalLarge]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send Email to Property Owner</Text>
                <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                  <X color="#6b7280" size={24} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalLabel}>To: {selectedEmail}</Text>
                <Text style={[styles.modalLabel, styles.mt16]}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea, styles.mt8]}
                  value={customMessage}
                  onChangeText={setCustomMessage}
                  multiline
                  numberOfLines={12}
                  placeholderTextColor="#9ca3af"
                />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                  onPress={() => setShowEmailModal(false)}>
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonPrimary,
                    styles.buttonFlex,
                    (!customMessage.trim() || sendingEmail) && styles.buttonDisabled,
                  ]}
                  onPress={handleSendEmail}
                  disabled={sendingEmail || !customMessage.trim()}>
                  {sendingEmail ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Send Email</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Text Modal */}
        <Modal
          visible={showTextModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTextModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send Text Message</Text>
                <TouchableOpacity onPress={() => setShowTextModal(false)}>
                  <X color="#6b7280" size={24} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalLabel}>To: {selectedPhone}</Text>
                <Text style={[styles.modalLabel, styles.mt16]}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea, styles.mt8]}
                  value={customTextMessage}
                  onChangeText={setCustomTextMessage}
                  multiline
                  numberOfLines={6}
                  maxLength={160}
                  placeholderTextColor="#9ca3af"
                />
                <Text style={styles.charCount}>{customTextMessage.length}/160 characters</Text>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                  onPress={() => setShowTextModal(false)}>
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonPrimary,
                    styles.buttonFlex,
                    (!customTextMessage.trim() || sendingText) && styles.buttonDisabled,
                  ]}
                  onPress={handleSendText}
                  disabled={sendingText || !customTextMessage.trim()}>
                  {sendingText ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Send Text</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </PageSafeContainer>
    );
  }

  return (
    <PageSafeContainer>
      <Header
        title="Foreclosures"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Search color="#7c3aed" size={20} />
            <Text style={styles.cardTitle}>Search Foreclosure Properties</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ZIP Code *</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="Enter ZIP code"
                maxLength={5}
                keyboardType="number-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foreclosure Stage</Text>
              <TouchableOpacity style={styles.selectButton} onPress={() => setShowStageModal(true)}>
                <Text style={styles.selectButtonText}>
                  {foreclosureStage === 'all' ? 'All Stages' : foreclosureStage}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max Auction Date</Text>
              <TextInput
                style={styles.input}
                value={maxAuctionDate}
                onChangeText={setMaxAuctionDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                (loading || !zipCode.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleSearch}
              disabled={loading || !zipCode.trim()}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Search color="#fff" size={16} />
                  <Text style={styles.buttonText}>Search Foreclosures</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        {showResults && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Building color="#7c3aed" size={20} />
              <Text style={styles.cardTitle}>Foreclosure Properties Found</Text>
              {renderBadge(`${foreclosureProperties.length} properties`)}
            </View>
            <View style={styles.cardContent}>
              {foreclosureProperties.length === 0 ? (
                <View style={styles.emptyState}>
                  <AlertTriangle color="#d1d5db" size={48} />
                  <Text style={styles.emptyStateTitle}>No foreclosures found</Text>
                  <Text style={styles.emptyStateText}>Try adjusting your search criteria.</Text>
                </View>
              ) : (
                foreclosureProperties.map((property) => {
                  const StageIcon = getStageIcon(property.foreclosureStage);
                  const stageColors = getStageColor(property.foreclosureStage);

                  return (
                    <View key={property.id} style={styles.propertyCard}>
                      <View style={styles.propertyHeader}>
                        <View style={[styles.propertyIcon, { backgroundColor: stageColors.bg }]}>
                          <StageIcon color={stageColors.text} size={20} />
                        </View>
                        <View style={styles.flex1}>
                          <Text style={styles.propertyAddress}>{property.address}</Text>
                          <Text style={styles.propertyLocation}>
                            {property.city}, {property.state} {property.zipCode}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.propertyDetails}>
                        <View style={styles.propertyDetailItem}>
                          <Text style={styles.propertyDetailLabel}>Case Number</Text>
                          <Text style={styles.propertyDetailValue}>{property.caseNumber}</Text>
                        </View>
                        <View style={styles.propertyDetailItem}>
                          <Text style={styles.propertyDetailLabel}>Current Balance</Text>
                          <Text style={styles.propertyDetailValue}>
                            {formatCurrency(property.currentBalance)}
                          </Text>
                        </View>
                        <View style={styles.propertyDetailItem}>
                          <Text style={styles.propertyDetailLabel}>Estimated Value</Text>
                          <Text style={styles.propertyDetailValue}>
                            {formatCurrency(property.estimatedValue)}
                          </Text>
                        </View>
                        <View style={styles.propertyDetailItem}>
                          <Text style={styles.propertyDetailLabel}>Auction Date</Text>
                          <Text style={styles.propertyDetailValue}>{property.auctionDate}</Text>
                        </View>
                      </View>

                      <View style={styles.propertyBadges}>
                        {renderBadge(property.foreclosureStage, stageColors)}
                        {renderBadge(`${property.bedrooms} bed, ${property.bathrooms} bath`)}
                        {renderBadge(`${property.sqft.toLocaleString()} sq ft`)}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.buttonOutline,
                          styles.mt16,
                          loading && styles.buttonDisabled,
                        ]}
                        onPress={() => handleGetDetails(property)}
                        disabled={loading}>
                        <Eye color="#7c3aed" size={16} />
                        <Text style={styles.buttonOutlineText}>Get Details</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* Info Alert */}
        <View style={styles.alert}>
          <Info color="#3b82f6" size={16} />
          <Text style={styles.alertText}>
            This tool helps you find foreclosure properties with complete owner information and
            comparable sales data. Use the "Get Details" button to access skip trace data, contact
            information, and market analysis for each property.
          </Text>
        </View>
      </ScrollView>

      {renderStageModal()}
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#111827',
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
  buttonPrimary: {
    backgroundColor: '#7c3aed',
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
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonFlex: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  badgeTextSuccess: {
    color: '#16a34a',
  },
  badgeTextDanger: {
    color: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  propertyCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  propertyIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  propertyAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  propertyDetails: {
    gap: 12,
    marginBottom: 12,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyDetailLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  propertyDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  propertyBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mt16: {
    marginTop: 16,
  },
  mt8: {
    marginTop: 8,
  },
  alert: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  detailsHeader: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailsAddress: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailsSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  ownerSection: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  contactText: {
    fontSize: 14,
    color: '#111827',
  },
  compCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  compHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  compDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  compDetailText: {
    fontSize: 13,
    color: '#6b7280',
  },
  compPriceSection: {
    alignItems: 'flex-end',
  },
  compPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7c3aed',
  },
  compPricePerSqft: {
    fontSize: 13,
    color: '#6b7280',
  },
  mlsCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  mlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mlsBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  mlsPriceSection: {
    alignItems: 'flex-end',
  },
  mlsPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  mlsFinalPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
    marginTop: 2,
  },
  mlsDetails: {
    gap: 8,
    marginBottom: 12,
  },
  mlsDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mlsDetailLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  mlsDetailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  mlsFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  mlsBrokerage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalLarge: {
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    padding: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  modalOptionTextActive: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
});
