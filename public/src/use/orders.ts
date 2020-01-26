import { reactive, ref } from '@vue/composition-api';
import Address from '../types/Address';

export function useOrders() {
  // const paymentInfo = reactive({});
  const shippingAddress = reactive(new Address());
  const differentBilling = ref(false);
  const billingAddress = reactive(new Address({ isBilling: true }));
  const isStepOpen = reactive({
    addresses: true,
    payment: true,
    coupon: true
  });

  return { shippingAddress, billingAddress, differentBilling, isStepOpen };
}

export type IOrders = ReturnType<typeof useOrders>;
