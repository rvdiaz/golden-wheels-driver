import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { getCustomerBookingQuery } from '../graphql/queries';
import { Booking } from '../interfaces';
import { ENV_Vars } from '~/store/env';
import {
  addBookingMutation,
  createPaymentIntentMutation,
  updateBookingMutation,
} from '../graphql/mutation';
import { userData } from '~/store/user';

export const useCustomerTrips = ({ skipQueries }: { skipQueries?: boolean }) => {
  const user = useReactiveVar(userData);

  const { data: customerBookings, loading: loadingTrips } = useQuery<{
    getCustomerBooking: Booking[];
  }>(getCustomerBookingQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
      customerId: user?.id,
    },
    fetchPolicy: 'network-only',
    skip: skipQueries || !user?.id,
  });

  const [addTrip, { loading: loadingTripCreation }] = useMutation<{
    addBooking: Booking;
  }>(addBookingMutation);

  const [updateTrip, { loading: loadingTripUpdate }] = useMutation<{
    updateBooking: Booking;
  }>(updateBookingMutation);

  const [createPaymentIntentFn, { loading: loadingPaymentProcessment }] = useMutation<{
    createPaymentIntent: {
      clientSecret: string;
      stripeCustomerId: string;
      ephemeralKey: string;
    };
  }>(createPaymentIntentMutation);

  const handleAddTrip = async ({
    tenant,
    booking,
  }: {
    tenant: any; // replace with TenantData
    booking: any; // replace with BookingInput
  }) => {
    const response = await addTrip({
      variables: {
        tenant,
        booking,
      },
    });

    return response.data?.addBooking;
  };

  const handlePaymentIntent = async ({
    tenant,
    bookingId,
    customerId,
  }: {
    tenant: any;
    bookingId: string;
    customerId: string;
  }) => {
    const response = await createPaymentIntentFn({
      variables: {
        tenant,
        bookingId,
        customerId,
      },
    });

    return response.data?.createPaymentIntent;
  };

  const handleUpdateTrip = async ({
    tenant,
    bookingId,
    booking,
  }: {
    tenant: any; // replace with TenantData
    bookingId: string;
    booking: any; // replace with BookingUpdateInput
  }) => {
    const response = await updateTrip({
      variables: {
        tenant,
        bookingId,
        booking,
      },
    });

    console.log(':::update', response.data?.updateBooking);

    return response.data?.updateBooking;
  };

  const tripLists = customerBookings?.getCustomerBooking ?? [];

  return {
    tripLists,
    loadingTrips,
    handleAddTrip,
    handleUpdateTrip,
    handlePaymentIntent,
    loadingTripCreation,
    loadingTripUpdate,
    createPaymentIntentMutation,
    loadingPaymentProcessment,
  };
};
