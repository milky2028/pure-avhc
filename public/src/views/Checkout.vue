<template>
  <PageWrapper with-padding>
    <ArticlePage title="Checkout">
      <CollapsableSection
        :is-expanded="isStepOpen.login"
        @edit-clicked="onContinue([loginErrors], 'login')"
      >
        <template v-slot:header>
          <h2 class="subhead">Login</h2>
        </template>
        <template v-slot:collapsed>
          <p class="body-text sub-font ptop pbottom">
            {{
              email
                ? `Logged in as`
                : 'You are not signed in. Sign in, create an account, or checkout anonymously.'
            }}
            <router-link v-if="email" class="body-text basic-link" to="/orders">
              {{ email }}.
            </router-link>
          </p>
        </template>
        <template v-slot:expanded>
          <a
            v-if="email"
            class="body-text sub-font ptop pbottom basic-link"
            @click="signOut()"
          >
            Sign out
          </a>
          <Login v-if="!email" />
        </template>
      </CollapsableSection>
      <CollapsableSection
        :is-expanded="isStepOpen.addresses"
        @edit-clicked="
          onContinue(
            [shippingErrors, differentBilling ? billingErrors : null],
            'addresses'
          )
        "
      >
        <template v-slot:header>
          <h2 class="subhead">Shipping</h2>
        </template>
        <template v-slot:constant>
          <AvSelector
            class="mb"
            label="Shipping Options"
            :options="shippingOptions"
            loop-key="id"
            display-key="display"
            value-key="type"
            :bound-prop="selectedShippingOption.type"
            @select-change="setShippingOption($event)"
          />
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
            @form-input="Object.assign(shippingAddress, $event)"
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
            @form-input="Object.assign(billingAddress, $event)"
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
          <div>
            <h3 class="body-text">
              Card: {{ formatCardNumber(payment.cardNumber, true) }}
            </h3>
            <h3 class="body-text">
              Expiration Date: {{ payment.expiryMonth }}/{{
                payment.expiryYear
              }}
            </h3>
          </div>
        </template>
        <template v-slot:expanded>
          <div>
            <AvInput
              class="mb"
              dark
              more-padding
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="Credit Card Number"
              :value="formatCardNumber(payment.cardNumber)"
              @on-input="payment.cardNumber = $event.replace(/ /g, '')"
            />
            <div class="mb split-grid">
              <AvInputSelector
                dark
                placeholder="Expiration Month"
                autocomplete="cc-exp-month"
                :options="months"
                :value="payment.expiryMonth"
                @on-select="payment.expiryMonth = $event"
              />
              <AvInputSelector
                dark
                placeholder="Expiration Year"
                autocomplete="cc-exp-year"
                :options="years"
                :value="payment.expiryYear"
                @on-select="payment.expiryYear = $event"
              />
            </div>
            <AvInput
              dark
              more-padding
              type="text"
              inputmode="numeric"
              autocomplete="cc-csc"
              placeholder="Security Code"
              pattern="\d{3,4}"
              :value="payment.securityCode"
              @on-input="payment.securityCode = $event"
            />
          </div>
        </template>
      </CollapsableSection>
      <CollapsableSection
        :is-expanded="isStepOpen.discount"
        @edit-clicked="validateDiscountCode(couponCode, true)"
      >
        <template v-slot:header>
          <h2
            class="subhead"
            :class="{ marginBottom: fullCoupon && !isStepOpen.discount }"
          >
            Discount Code
          </h2>
        </template>
        <template v-slot:collapsed>
          <chip v-if="fullCoupon" @remove-clicked="couponCode = ''">
            {{ fullCoupon.code }}
          </chip>
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
        <div v-if="fullCoupon" class="chip-and-percent-container">
          <p v-if="fullCoupon" class="subhead itemized money">
            -{{
              fullCoupon.type === 'percent'
                ? `${fullCoupon.amount}%`
                : `$${fullCoupon.amount}`
            }}
          </p>
          <chip v-if="fullCoupon" @remove-clicked="couponCode = ''">
            {{ fullCoupon.code }}
          </chip>
        </div>
        <p class="subhead itemized">Shipping</p>
        <p class="subhead itemized money">
          ${{ selectedShippingOption.price }}
        </p>
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

.split-grid {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
}

.switch {
  justify-self: end;
}

.margin-top {
  margin-top: 2rem;
}

.marginBottom {
  margin-bottom: 1rem;
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

.chip-and-percent-container {
  display: grid;
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
  defineComponent,
  ref,
  inject,
  Ref,
  computed
} from '@vue/composition-api';
import { useMetadata } from '../use/metadata';
import { Modules } from '../use/store';
import { IOrders } from '../use/orders';
import { IFormErrors, useFormErrors } from '../use/form-errors';
import { ICart } from '../use/cart';
import { IProducts } from '../use/products';
import { proxy } from 'comlink';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvInput from '../components/AvInput.vue';
import AvInputSelector from '../components/AvInputSelector.vue';
import AvSelector from '../components/AvSelector.vue';
import AvErrors from '../components/AvErrors.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AddressDisplay from '../components/AddressDisplay.vue';
import CollapsableSection from '../components/CollapsableSection.vue';
import Divider from '../components/Divider.vue';
import workerInstance from '../workers/entry';
import Coupon from '../types/Coupon';
import Chip from '../components/Chip.vue';
import Login from '../components/Login.vue';
import { IUser } from '../use/user';

export default defineComponent({
  components: {
    Chip,
    PageWrapper,
    ArticlePage,
    CollapsableSection,
    ShippingForm,
    AvSwitch,
    AddressDisplay,
    Divider,
    AvInput,
    AvErrors,
    Login,
    AvInputSelector,
    AvSelector
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
      payment,
      shippingAddress,
      setShippingOption,
      selectedShippingOption,
      shippingOptions,
      billingAddress,
      differentBilling,
      isStepOpen,
      couponCode
    } = inject(Modules.orders) as IOrders;
    const shippingErrors = useFormErrors();
    const billingErrors = useFormErrors();

    function formatCardNumber(cardNumber: string, useStars = false) {
      const match = cardNumber.replace(/ /g, '').match(/.{1,4}/g);

      if (match?.length === 4 && useStars) {
        match[0] = '****';
        match[1] = '****';
        match[2] = '****';
      }

      return match?.join(' ');
    }

    const months = [
      { displayValue: '01', value: '01', key: 0 },
      { displayValue: '02', value: '02', key: 1 },
      { displayValue: '03', value: '03', key: 2 },
      { displayValue: '04', value: '04', key: 3 },
      { displayValue: '05', value: '05', key: 4 },
      { displayValue: '06', value: '06', key: 5 },
      { displayValue: '07', value: '07', key: 6 },
      { displayValue: '08', value: '08', key: 7 },
      { displayValue: '09', value: '09', key: 8 },
      { displayValue: '10', value: '10', key: 9 },
      { displayValue: '11', value: '11', key: 10 },
      { displayValue: '12', value: '12', key: 11 }
    ];

    const thisYear = new Date().getFullYear();
    const years = [];
    for (let i = thisYear; i < thisYear + 15; i++) {
      years.push({ displayValue: String(i), value: String(i), key: i });
    }

    function onContinue(errorInstances: IFormErrors[], step: string) {
      const hasErrors = errorInstances.some(
        (instance) => instance?.errors?.value.length > 1
      );
      if (hasErrors) {
        for (const instance of errorInstances) {
          if (instance?.errors?.value.length > 1) {
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

    function validateDiscountCode(discountCode: string, isIconClick = false) {
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

    const loginErrors = useFormErrors();

    const { email, signOut } = inject(Modules.user) as IUser;

    return {
      setShippingOption,
      shippingOptions,
      years,
      months,
      formatCardNumber,
      selectedShippingOption,
      payment,
      signOut,
      email,
      loginErrors,
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
      differentBilling,
      shippingAddress,
      billingAddress
    };
  }
});
</script>
