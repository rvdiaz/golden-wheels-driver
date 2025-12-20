import { useQuery, useReactiveVar } from '@apollo/client';
import { getUser, userData } from '../user';
import { ITenant } from './interface';
import { getTenantQuery } from '../graphql/queries';
import { useEffect, useState } from 'react';

export const useTenant = () => {
  const userInfo = useReactiveVar(userData);
  const [loadingUs, setLoading] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      setLoading(true);
      await getUser();
      setLoading(false);
    };
    getUserFromStorage();
  }, []);

  const { data, loading } = useQuery<{ getTenant: ITenant }>(getTenantQuery, {
    variables: {
      tenantID: userInfo?.activeTenantId,
    },
    skip: !userInfo?.userID, // ⬅️ Run only when userID exists
  });

  return {
    tenantInfo: data?.getTenant,
    loading: loading || loadingUs,
    userInfo,
  };
};
