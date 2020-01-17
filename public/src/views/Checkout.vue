<template>
  <PageWrapper with-padding>
    <ArticlePage title="Checkout">
      <CollapsableSection>
        <template v-slot:expanded>
          <ShippingForm
            :form="shippingForm"
            @form-input="shippingForm = $event"
          />
          <div class="switch-container">
            <p class="body-text">
              Different billing address?
            </p>
            <AvSwitch
              :value="differentBilling"
              class="switch"
              @switch="differentBilling = $event"
            />
          </div>
          <ShippingForm
            v-if="differentBilling"
            class="margin-top"
            :form="billingForm"
            @form-input="billingForm = $event"
          />
        </template>
        <template v-slot:collapsed>
          <AddressDisplay :address="shippingForm"/>
          <AddressDisplay v-if="differentBilling" :address="billingForm"
        /></template>
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
</style>

<script lang="ts">
import { createComponent, ref, reactive } from '@vue/composition-api';
import { useMetadata } from '../use/metadata';
import Address from '../types/Address';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AddressDisplay from '../components/AddressDisplay.vue';
import CollapsableSection from '../components/CollapsableSection.vue';

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

    const differentBilling = ref(false);
    const shippingForm = reactive(new Address());
    const billingForm = reactive(new Address({ isBilling: true }));

    return {
      differentBilling,
      shippingForm,
      billingForm
    };
  }
});
</script>
