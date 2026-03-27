import { useQuery } from '@apollo/client';
import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext } from 'react-hook-form';
import Text from '~/codidge_components/UI/text';
import { getExtraServicesQuery } from './graphql/queries';
import { ENV_Vars } from '~/store/env';
import { IExtraService, Booking } from '~/screens/trips/interfaces';
import { theme } from '~/theme/theme';
import { LoadingSkeleton } from '../../widgets/extraServiceSkeleton';
import { ServiceCard } from '../../widgets/extraServiceCard';

// ─── Main component ───────────────────────────────────────────────────────────

export const ExtraServicesSelection = () => {
  const { data, loading } = useQuery<{
    getExtraServices: IExtraService[];
  }>(getExtraServicesQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
    },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Booking>();

  // Selected IDs stored as array in form
  const selectedIds: string[] = watch('bookingBusinessData.extraServices') ?? [];

  const toggle = (service: IExtraService) => {
    const already = selectedIds.includes(service.id);
    const next = already
      ? selectedIds.filter((id) => id !== service.id)
      : [...selectedIds, service.id];
    setValue('bookingBusinessData.extraServices', next);
  };

  const services = data?.getExtraServices ?? [];

  if (loading) return <LoadingSkeleton />;

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header hint */}
      <View style={s.hint}>
        <View style={s.hintBar} />
        <Text style={s.hintText}>
          Optional add-ons for your trip. You can skip this step if you don't need any extras.
        </Text>
      </View>

      {/* Service list */}
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={selectedIds.includes(service.id)}
          onPress={() => toggle(service)}
        />
      ))}

      {/* Selected summary */}
      {selectedIds.length > 0 && (
        <View style={s.summary}>
          <Text style={s.summaryText}>
            {selectedIds.length} extra{selectedIds.length > 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity onPress={() => setValue('bookingBusinessData.extraServices', [])}>
            <Text style={s.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty state */}
      {!loading && services.length === 0 && (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>No extras available</Text>
          <Text style={s.emptyDesc}>
            No additional services are configured for this service area.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  hint: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  hintBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    alignSelf: 'stretch',
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  empty: {
    paddingTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
  },
});
