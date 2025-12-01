import { useState } from 'react';
import { BalancePurchaseModalView } from './balancePurchaseModalView';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useInAppProductsList } from '~/custom_modules/iap/hooks/useSubscriptionPlanList';

export const BalancePurchaseModalStub = () => {
  const [visible, setvisible] = useState(false);
  const { inApproducts } = useInAppProductsList();

  if (inApproducts.length === 0) {
    return <></>;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setvisible(true);
        }}
        activeOpacity={0.7}>
        <Icons.Plus size={20} color="#2B7FFF" />
      </TouchableOpacity>

      <BalancePurchaseModalView
        visible={visible}
        onClose={() => setvisible(false)}
        products={[]}
        balanceOptions={inApproducts}
        currentBalance={0}
        requestPurchase={(sku) => {
          console.log(':::::');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
