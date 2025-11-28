import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import CustomSlider from '~/codidge_components/UI/form/inputs/touchableSlider';
import { theme } from '~/theme/theme';

const IncomeCalculator = () => {
  // Income Targets
  const [targetIncome, setTargetIncome] = useState(100000);
  const [netPerDeal, setNetPerDeal] = useState(6000);
  const [netPerRental, setNetPerRental] = useState(1000);

  // Weekly Activity Volumes
  const [expiredCalls, setExpiredCalls] = useState(0);
  const [fsboCalls, setFsboCalls] = useState(0);
  const [fsboVisits, setFsboVisits] = useState(0);
  const [openHouses, setOpenHouses] = useState(0);
  const [networkEvents, setNetworkEvents] = useState(0);
  const [bizCards, setBizCards] = useState(0);
  const [directCrmAdds, setDirectCrmAdds] = useState(0);
  const [rentalSigns, setRentalSigns] = useState(0);

  // Results
  const [neededClosings, setNeededClosings] = useState(0);
  const [forecastClosings, setForecastClosings] = useState(0);
  const [forecastIncome, setForecastIncome] = useState(0);
  const [pctToGoal, setPctToGoal] = useState(0);

  // Fixed conversion metrics
  const metrics = {
    exp_convos_per100: 15,
    exp_fa_per100: 3,
    exp_close_per100: 1,
    fsbo_convos_per100: 25,
    fsbo_followups_per100: 8,
    fsbo_close_per100: 2,
    visit_contact_per: 1,
    visit_close_per10: 2,
    crm_close_per100: 1,
    cards_close_per250: 1,
    events_contacts_per10: 20,
    oh_contacts_per: 2,
    oh_closings_per10: 1,
    rental_calls_per2: 10,
    rental_clients_per2: 6,
    rental_close_per2: 1,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    compute();
  }, [
    targetIncome,
    netPerDeal,
    netPerRental,
    expiredCalls,
    fsboCalls,
    fsboVisits,
    openHouses,
    networkEvents,
    bizCards,
    directCrmAdds,
    rentalSigns,
  ]);

  const compute = () => {
    const WEEKS_PER_YEAR = 52;

    // Annualize weekly volumes
    const a_expiredCalls = expiredCalls * WEEKS_PER_YEAR;
    const a_fsboCalls = fsboCalls * WEEKS_PER_YEAR;
    const a_fsboVisits = fsboVisits * WEEKS_PER_YEAR;
    const a_openHouses = openHouses * WEEKS_PER_YEAR;
    const a_bizCards = bizCards * WEEKS_PER_YEAR;
    const a_directCrmAdds = directCrmAdds * WEEKS_PER_YEAR;
    const a_rentalSigns = rentalSigns * WEEKS_PER_YEAR;

    // Channel calculations - Sales
    const exp_close = a_expiredCalls * (metrics.exp_close_per100 / 100);
    const fs_close = a_fsboCalls * (metrics.fsbo_close_per100 / 100);
    const visit_close = (a_fsboVisits / 10) * metrics.visit_close_per10;
    const oh_close = (a_openHouses / 10) * metrics.oh_closings_per10;
    const crm_close = (a_directCrmAdds / 100) * metrics.crm_close_per100;
    const cards_close = (a_bizCards / 250) * metrics.cards_close_per250;
    const rental_close = (a_rentalSigns / 2) * metrics.rental_close_per2;

    // Totals
    const sales_closings = exp_close + fs_close + visit_close + oh_close + crm_close + cards_close;
    const total_closings = sales_closings + rental_close;
    const sales_income = sales_closings * netPerDeal;
    const rental_income = rental_close * netPerRental;
    const total_income = sales_income + rental_income;

    const needed = netPerDeal > 0 ? targetIncome / netPerDeal : 0;
    const pct = targetIncome > 0 ? (total_income / targetIncome) * 100 : 0;

    setNeededClosings(needed);
    setForecastClosings(total_closings);
    setForecastIncome(total_income);
    setPctToGoal(Math.min(pct, 999)); // Cap at 999% for display
  };

  const ResultCard = ({ label, value, color, icon: Icon }: any) => (
    <View style={styles.resultCard}>
      <View style={styles.resultLeft}>
        <Icon size={20} color={color} />
        <Text style={styles.resultLabel}>{label}</Text>
      </View>
      <Text style={[styles.resultValue, { color }]}>{value}</Text>
    </View>
  );

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#F59E0B';
    if (percentage >= 50) return '#3B82F6';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Results Section */}
      <View style={[styles.section, styles.resultsSection]}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}>
            <Text style={styles.progressLabel}>Progress to Goal</Text>
            <Text style={[styles.progressPercentage, { color: getProgressColor(pctToGoal) }]}>
              {pctToGoal.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(pctToGoal, 100)}%`,
                  backgroundColor: getProgressColor(pctToGoal),
                },
              ]}
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.info,
              marginLeft: 'auto',
              marginTop: 4,
            }}>
            {formatCurrency(targetIncome)}
          </Text>
        </View>
        <View>
          <ResultCard
            label="Target Closings"
            value={neededClosings.toFixed(1)}
            color="#3B82F6"
            icon={Icons.Target}
          />
          <ResultCard
            label="Forecast Closings"
            value={forecastClosings.toFixed(1)}
            color="#10B981"
            icon={Icons.CheckCircle}
          />
          <ResultCard
            label="Forecast Income"
            value={formatCurrency(forecastIncome)}
            color="#059669"
            icon={Icons.DollarSign}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Income Targets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icons.Target size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Income Targets</Text>
          </View>

          <CustomSlider
            label="Annual Income Goal"
            value={targetIncome}
            onValueChange={setTargetIncome}
            minimumValue={50000}
            maximumValue={500000}
            step={5000}
            prefix="$"
            color="#2563EB"
            formatValue={(v: any) => formatCurrency(v)}
          />

          <CustomSlider
            label="Net per Sale"
            value={netPerDeal}
            onValueChange={setNetPerDeal}
            minimumValue={1000}
            maximumValue={20000}
            step={500}
            prefix="$"
            color="#10B981"
            formatValue={(v: any) => formatCurrency(v)}
          />

          <CustomSlider
            label="Net per Rental"
            value={netPerRental}
            onValueChange={setNetPerRental}
            minimumValue={100}
            maximumValue={5000}
            step={100}
            prefix="$"
            color="#8B5CF6"
            formatValue={(v: any) => formatCurrency(v)}
          />
        </View>

        {/* Weekly Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icons.Activity size={20} color="#F97316" />
            <Text style={styles.sectionTitle}>Weekly Activities</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Set your weekly targets (annual forecast = weekly × 52)
          </Text>

          <View style={styles.activityGroup}>
            <Text style={styles.groupTitle}>📞 Calling Activities</Text>
            <CustomSlider
              label="Expired Calls"
              value={expiredCalls}
              onValueChange={setExpiredCalls}
              minimumValue={0}
              maximumValue={200}
              step={5}
              color="#EF4444"
              suffix=" calls"
            />

            <CustomSlider
              label="FSBO Calls"
              value={fsboCalls}
              onValueChange={setFsboCalls}
              minimumValue={0}
              maximumValue={200}
              step={5}
              color="#F59E0B"
              suffix=" calls"
            />
          </View>

          <View style={styles.activityGroup}>
            <Text style={styles.groupTitle}>🚗 In-Person Activities</Text>
            <CustomSlider
              label="FSBO Visits"
              value={fsboVisits}
              onValueChange={setFsboVisits}
              minimumValue={0}
              maximumValue={50}
              step={1}
              color="#10B981"
              suffix=" visits"
              helperText="Door knocks, not follow-up appointments"
            />

            <CustomSlider
              label="Open Houses"
              value={openHouses}
              onValueChange={setOpenHouses}
              minimumValue={0}
              maximumValue={10}
              step={1}
              color="#06B6D4"
              suffix=" houses"
            />

            <CustomSlider
              label="Network Events"
              value={networkEvents}
              onValueChange={setNetworkEvents}
              minimumValue={0}
              maximumValue={10}
              step={1}
              color="#3B82F6"
              suffix=" events"
            />
          </View>

          <View style={styles.activityGroup}>
            <Text style={styles.groupTitle}>📋 Other Activities</Text>
            <CustomSlider
              label="Business Cards"
              value={bizCards}
              onValueChange={setBizCards}
              minimumValue={0}
              maximumValue={500}
              step={10}
              color="#8B5CF6"
              suffix=" cards"
            />

            <CustomSlider
              label="CRM Direct Adds"
              value={directCrmAdds}
              onValueChange={setDirectCrmAdds}
              minimumValue={0}
              maximumValue={100}
              step={5}
              color="#EC4899"
              suffix=" contacts"
              helperText="Manual CRM additions from other sources"
            />

            <CustomSlider
              label="Rental Signs"
              value={rentalSigns}
              onValueChange={setRentalSigns}
              minimumValue={0}
              maximumValue={20}
              step={1}
              color="#6366F1"
              suffix=" signs"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  metricsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricsButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    marginTop: -8,
  },
  activityGroup: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  resultsSection: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 10,
    marginTop: 10,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },

  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // if not supported, use marginRight instead
  },

  resultLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  resultValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
});

export default IncomeCalculator;
