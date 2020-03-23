import { reactive, ref } from '@vue/composition-api';
import Address from '../types/Address';
import workerInstance from '@/workers/entry';
import { proxy } from 'comlink';
import { set } from 'idb-keyval';
import ShippingOption from '@/types/ShippingOption';

export function useOrders() {
  const payment = reactive({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    securityCode: ''
  });
  const shippingAddress = reactive(new Address());

  const selectedShippingOption = reactive(new ShippingOption());
  const shippingOptions = ref([] as ShippingOption[]);

  function setShippingOption(type: string) {
    const fullShippingOption = shippingOptions.value.find(
      ({ type: oType }) => oType === type
    );

    Object.assign(selectedShippingOption, fullShippingOption);
  }

  function loadShippingOptions(): Promise<void> {
    return new Promise((resolve) =>
      workerInstance.then((instance) =>
        instance.getDocuments(
          'shippingOptions',
          proxy((wShippingOptions) => {
            shippingOptions.value = wShippingOptions;
            set('shippingOptions', shippingOptions.value);
            resolve();
          })
        )
      )
    );
  }

  loadShippingOptions().then(() => setShippingOption('standard'));

  const differentBilling = ref(false);
  const billingAddress = reactive(new Address({ isBilling: true }));
  const couponCode = ref('');

  const isStepOpen: Record<string, boolean> = reactive({
    login: true,
    addresses: true,
    payment: true,
    discount: false
  });

  return {
    payment,
    shippingAddress,
    selectedShippingOption,
    setShippingOption,
    shippingOptions,
    billingAddress,
    differentBilling,
    couponCode,
    isStepOpen
  };
}

export type IOrders = ReturnType<typeof useOrders>;
