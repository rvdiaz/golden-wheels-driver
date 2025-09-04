import { useMutation, useReactiveVar } from '@apollo/client';
import { addFollowUpMutation } from '../graphql/mutations';
import { getUserFollowUpsQuery } from '../graphql/queries';
import { IFollowUpResponse } from '../interfaces';
import { userData } from '~/store/user';
import moment from 'moment';

interface UseAddFollowUpProps {
  tenantId: string;
  onCompleted?: () => void;
}

const today = moment().format('YYYY-MM-DD');
const fifteenDaysLater = moment().add(15, 'days').format('YYYY-MM-DD');

export const useAddFollowUp = ({ tenantId, onCompleted }: UseAddFollowUpProps) => {
  const customer = useReactiveVar(userData);

  const [mutate, { loading, error }] = useMutation(addFollowUpMutation, {
    update: (cache, { data }) => {
      if (!data?.createUserFollowUp) return;

      const newFollowUp = data.createUserFollowUp;

      const variables = {
        tenant: { tenantId },
        input: {
          userId: customer?.id,
          dateFrom: today,
          dateTo: fifteenDaysLater,
        },
      };

      try {
        const existingData = cache.readQuery<{ getUserFollowUps: IFollowUpResponse }>({
          query: getUserFollowUpsQuery,
          variables,
        });

        if (existingData?.getUserFollowUps) {
          cache.writeQuery({
            query: getUserFollowUpsQuery,
            variables,
            data: {
              getUserFollowUps: {
                ...existingData.getUserFollowUps,
                followUps: [...(existingData.getUserFollowUps.followUps || []), newFollowUp],
              },
            },
          });
        }
      } catch (err) {
        console.log('Cache read/write skipped (no existing data yet)', err);
      }
    },
    onError: (err) => {
      console.log('Follow-up mutation error:', err);
    },
    onCompleted: () => {
      onCompleted?.();
    },
  });

  return {
    addFollowUp: mutate,
    addingFollowUp: loading,
    addFollowUpError: error,
  };
};
