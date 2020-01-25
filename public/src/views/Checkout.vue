<template>
  <PageWrapper with-padding>
    <ArticlePage title="Checkout">
      <CollapsableSection
        :is-expanded="isStepOpen.addressesStep"
        @continue-clicked="isStepOpen.addressesStep = false"
        @edit-clicked="isStepOpen.addressesStep = true"
      >
        <template v-slot:header>
          <h2 class="subhead margin-bottom">Shipping</h2>
        </template>
        <template v-slot:expanded>
          <ShippingForm
            :show-header="false"
            :form="shippingAddress"
            @last-field-enter="isStepOpen.addressesStep = false"
            @form-input="setAllStateInObj(shippingAddress, $event)"
          />
          <div class="switch-container">
            <p class="body-text">Different billing address?</p>
            <AvSwitch
              :value="differentBilling"
              class="switch"
              @switch="differentBilling = $event"
            />
          </div>
          <ShippingForm
            v-if="differentBilling"
            class="margin-top"
            :form="billingAddress"
            @form-input="setAllStateInObj(billingAddress, $event)"
            @last-field-enter="isStepOpen.addressesStep = false"
          />
        </template>
        <template v-slot:collapsed>
          <AddressDisplay :address="shippingAddress" />
          <AddressDisplay v-if="differentBilling" :address="billingAddress" />
        </template>
      </CollapsableSection>
      <CollapsableSection
        :is-expanded="isStepOpen.paymentStep"
        @continue-clicked="isStepOpen.paymentStep = false"
        @edit-clicked="isStepOpen.paymentStep = true"
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
        :is-expanded="isStepOpen.couponStep"
        @continue-clicked="isStepOpen.couponStep = false"
        @edit-clicked="isStepOpen.couponStep = true"
      >
        <template v-slot:header>
          <h2 class="subhead">Coupon Codes</h2>
        </template>
        <template v-slot:collapsed>
          <div>Collapsed content</div>
        </template>
        <template v-slot:expanded>
          <div>Expanded content</div>
        </template>
      </CollapsableSection>
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

.margin-bottom {
  margin-bottom: 1rem;
}
</style>

<script lang="ts">
import { createComponent, inject } from '@vue/composition-api';
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

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    CollapsableSection,
    ShippingForm,
    AvSwitch,
    AddressDisplay
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Checkout');
    setPageDescription(
      `${process.env.VUE_APP_FULL_NAME}'s Checkout. Here, you can complete your purchase and get ready to have your CBD Flower products shipped directly to your door.`
    );

    const {
      shippingAddress,
      billingAddress,
      differentBilling,
      isStepOpen
    } = inject(Modules.orders) as IOrders;

    return {
      isStepOpen,
      setAllStateInObj,
      differentBilling,
      shippingAddress,
      billingAddress
    };
  }
});
</script>
