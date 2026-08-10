import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { getDriverBookingsQuery } from '../graphql/queries';
import { updateDriverStatusMutation } from '../graphql/mutation';
import { mapCodidgeBookings, ICodidgeBooking } from '../graphql/mapCodidgeBooking';
import { ENV_Vars } from '~/store/env';
import { userData } from '~/store/user';

// Compatibility shim — driver app no longer uses customer-side mutations.
// Components still importing this hook will compile without errors.
export const useCustomerTrips = ({ skipQueries }: { skipQueries?: boolean } = {}) => {
  const user = useReactiveVar(userData);

  const {
    data: driverBookings,
    loading: loadingTrips,
    refetch: refetchTripList,
  } = useQuery<{ getDriverBookings: ICodidgeBooking[] }>(getDriverBookingsQuery, {
    variables: { tenantID: ENV_Vars.TENANT_ID },
    fetchPolicy: 'network-only',
    skip: skipQueries || !user?.id,
  });

  const [updateStatusFn, { loading: loadingTripUpdate }] = useMutation(updateDriverStatusMutation);

  const tripLists = mapCodidgeBookings(driverBookings?.getDriverBookings);

  // Stubs for customer-only operations not available in driver app
  const handleAddTrip = async () => undefined;
  const handleUpdateTrip = async () => undefined;
  const handlePaymentIntent = async () => undefined;
  const handleTripCancellation = async () => undefined;

  return {
    tripLists,
    refetchTripList,
    loadingTrips,
    handleAddTrip,
    handleUpdateTrip,
    handlePaymentIntent,
    handleTripCancellation,
    loadingTripCancellation: false,
    loadingTripCreation: false,
    loadingTripUpdate,
    loadingPaymentProcessment: false,
    createPaymentIntentMutation: null,
  };
};
