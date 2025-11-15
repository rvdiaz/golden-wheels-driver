import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser, UserSubscriptionStatus } from '../interface';
import { updateSubscriptionStatus } from '../subscription';

const USER_STORAGE_KEY = 'signinUser';

export const userData = makeVar<(IUser & { loadedFromStorage?: boolean }) | null>(null);

const updateSubscriptionStatusFromUser = (user?: IUser | null) => {
  if (!user || !user.subscription) {
    updateSubscriptionStatus({
      hasActiveSubscription: false,
    });
    return;
  }

  const subscription = user.subscription;
  if (subscription) {
    const endDate = new Date(subscription.endDate);

    updateSubscriptionStatus({
      hasActiveSubscription:
        subscription.status === UserSubscriptionStatus.ACTIVE || endDate > new Date(),
      expiryDate: endDate,
      planName: subscription.productId,
    });
  }
};

(async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      const parsedUser: IUser = JSON.parse(storedUser);
      userData({ ...parsedUser, loadedFromStorage: true });
      updateSubscriptionStatusFromUser(parsedUser);
    }
  } catch (error) {
    console.error('Error loading user from storage', error);
  }
})();

export const updateUser = async (user: IUser | null | string) => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
    userData(user as IUser);
    updateSubscriptionStatusFromUser(user as IUser);
  } catch (error) {
    console.error('Error updating user in storage', error);
  }
};
