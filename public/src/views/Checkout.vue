<template>
  <PageWrapper with-padding>
    <ArticlePage title="Checkout">
      <CollapsableSection
        :is-expanded="isStepOpen.addresses"
        @edit-clicked="
          onContinue(
            [shippingErrors, differentBilling ? billingErrors : []],
            'addresses'
          )
        "
      >
        <template v-slot:header>
          <h2 class="subhead">Shipping</h2>
        </template>
        <template v-slot:expanded>
          <ShippingForm
            :show-header="false"
            :form="shippingAddress"
            :error-instance="shippingErrors"
            @last-field-enter="
              if (!differentBilling) {
                onContinue(
                  [shippingErrors, billingErrors],
                  isStepOpen.addresses
                );
              }
            "
            @form-input="setAllStateInObj(shippingAddress, $event)"
          />
          <div class="switch-container">
            <p class="body-text">Different billing address?</p>
            <AvSwitch
              class="switch"
              :value="differentBilling"
              @switch="differentBilling = $event"
            />
          </div>
          <ShippingForm
            v-if="differentBilling"
            class="margin-top"
            :form="billingAddress"
            :error-instance="billingErrors"
            @form-input="setAllStateInObj(billingAddress, $event)"
            @last-field-enter="
              onContinue([shippingErrors, billingErrors], isStepOpen.addresses)
            "
          />
        </template>
        <template v-slot:collapsed>
          <AddressDisplay :address="shippingAddress" />
          <AddressDisplay v-if="differentBilling" :address="billingAddress" />
        </template>
      </CollapsableSection>
      <CollapsableSection
        :is-expanded="isStepOpen.payment"
        @edit-clicked="isStepOpen.payment = !isStepOpen.payment"
      >
        <template v-slot:header>
          <h2 class="subhead">Payment</h2>
        </template>
        <template v-slot:collapsed>
          <div>Collapsed content</div>
        </template>
        <template v-slot:expanded>
          <div>Expanded content</div>
        </template>
      </CollapsableSection>
      <CollapsableSection
        :is-expanded="isStepOpen.discount"
        @edit-clicked="validateDiscountCode(couponCode, true)"
      >
        <template v-slot:header>
          <h2 class="subhead">Discount Code</h2>
        </template>
        <template v-slot:collapsed>
          <div>{{ couponCode.toLowerCase() }}</div>
        </template>
        <template v-slot:expanded>
          <av-input
            dark
            more-padding
            placeholder="Code"
            type="text"
            :value="couponCode"
            @on-input="couponCode = $event"
            @enter="validateDiscountCode(couponCode)"
          />
          <av-errors class="discount-errors" :error-instance="discountErrors" />
        </template>
      </CollapsableSection>
      <div class="itemized-total-container">
        <p class="subhead itemized">Items</p>
        <div class="money">
          <div class="items">
            <div
              v-for="{
                id,
                size,
                strain,
                price,
                quantity,
                product
              } in cartItems"
              :key="id"
              class="individual-item"
            >
              <p class="item-details smaller-font">
                {{ findProductType(product) }} | {{ strain }}
              </p>
              <p class="item-details smaller-font">
                {{ quantity }}
                x ${{ price }}/{{ size }}
              </p>
            </div>
          </div>
        </div>
        <p v-if="fullCoupon" class="subhead itemized">Discounts</p>
        <p v-if="fullCoupon" class="subhead itemized money">
          -{{
            fullCoupon.type === 'percent'
              ? `${fullCoupon.amount}%`
              : `$${fullCoupon.amount}`
          }}
        </p>
        <p class="subhead itemized">Shipping</p>
        <p class="subhead itemized money">$35.00</p>
        <p class="subhead itemized">Tax</p>
        <p class="subhead itemized money">$35.00</p>
        <Divider class="divider" />
        <p class="subhead itemized">Total</p>
        <p class="subhead itemized money">$35.00</p>
      </div>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
h2 {
  font-size: 20px;
  padding: 1rem 0;
}

.switch-container {
  display: grid;
  grid-auto-flow: column;
  margin-top: 2rem;
}

.switch {
  justify-self: end;
}

.margin-top {
  margin-top: 2rem;
}

.discount-errors {
  padding: 1rem 1rem 0 1rem;
}

.itemized-total-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: repeat(5, min-content);
  grid-template-areas:
    'cell1 cell2'
    'cell3 cell4'
    'cell5 cell6'
    'cell7 cell8'
    'divider divider'
    'cell9 cell10';
}

.individual-item {
  text-align: right;
}

.divider {
  grid-area: divider;
  width: calc(100% + 15px);
}

.itemized {
  font-weight: 500;
  padding: 1rem 0;
}

.items {
  padding: 1rem 0;
}

.item-details {
  padding: 0;
}

.smaller-font {
  font-size: 2rem;
}

.money {
  justify-self: end;
}
</style>

<script lang="ts">
import {
  createComponent,
  inject,
  ref,
  Ref,
  computed
} from '@vue/composition-api';
import { useMetadata } from '../use/metadata';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AddressDisplay from '../components/AddressDisplay.vue';
import CollapsableSection from '../components/CollapsableSection.vue';
import { Modules } from '../use/store';
import { IOrders } from '../use/orders';
import setAllStateInObj from '../functions/setState';
import { IFormErrors, useFormErrors } from '../use/form-errors';
import Divider from '../components/Divider.vue';
import { ICart } from '../use/cart';
import { IProducts } from '../use/products';
import workerInstance from '../workers/entry';
import Coupon from '../types/Coupon';
import { proxy } from 'comlink';
import AvInput from '../components/AvInput.vue';
import AvErrors from '../components/AvErrors.vue';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    CollapsableSection,
    ShippingForm,
    AvSwitch,
    AddressDisplay,
    Divider,
    AvInput,
    AvErrors
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Checkout');
    setPageDescription(
      `${process.env.VUE_APP_FULL_NAME}'s Checkout. Here, you can complete your purchase and get ready to have your CBD Flower products shipped directly to your door.`
    );

    const { cartItems } = inject(Modules.cart) as ICart;
    const { products } = inject(Modules.products) as IProducts;

    function findProductType(pId: string) {
      const p = products.value.find(({ id }) => pId === id);
      return p ? p.url : pId;
    }

    const {
      shippingAddress,
      billingAddress,
      differentBilling,
      isStepOpen,
      couponCode
    } = inject(Modules.orders) as IOrders;
    const shippingErrors = useFormErrors();
    const billingErrors = useFormErrors();

    function onContinue(errorInstances: IFormErrors[], step: string) {
      const hasErrors = errorInstances.some((instance) =>
        instance && instance.errors ? instance.errors.value.length > 1 : false
      );
      if (hasErrors) {
        for (const instance of errorInstances) {
          if (instance.errors.value.length > 1) {
            instance.showErrors.value = true;
          }
        }
      } else {
        isStepOpen[step] = !isStepOpen[step];
      }
    }

    const discountErrors = useFormErrors();
    const coupons: Ref<Coupon[]> = ref([]);
    workerInstance.then((instance) =>
      instance.queryDocuments(
        {
          collection: 'coupons',
          queries: [
            {
              fieldPath: 'expirationDate',
              operator: '>' as firebase.firestore.WhereFilterOp,
              compareValue: new Date()
            }
          ]
        },
        proxy((coops) => (coupons.value = coops))
      )
    );
    const fullCoupon = computed(() =>
      coupons.value.find(
        ({ code }) => code.toLowerCase() === couponCode.value.toLowerCase()
      )
    );

    function validateDiscountCode(discountCode: string, isIconClick?: boolean) {
      if (isStepOpen.discount) {
        const isValid = coupons.value
          .map(({ code }) => code.toLowerCase())
          .includes(discountCode.toLowerCase());

        if (isValid) {
          discountErrors.errors.value = [];
          discountErrors.showErrors.value = false;
          onContinue([discountErrors], 'discount');
        } else {
          discountErrors.errors.value = ['Error:', 'Invalid discount code'];
          discountErrors.showErrors.value = true;
          if (isIconClick) {
            setTimeout(
              () => (isStepOpen.discount = !isStepOpen.discount),
              1500
            );
          }
        }
      } else {
        isStepOpen.discount = !isStepOpen.discount;
      }
    }

    return {
      fullCoupon,
      validateDiscountCode,
      discountErrors,
      couponCode,
      findProductType,
      cartItems,
      billingErrors,
      shippingErrors,
      onContinue,
      isStepOpen,
      setAllStateInObj,
      differentBilling,
      shippingAddress,
      billingAddress
    };
  }
});
</script>
