<template>
  <page-wrapper withPadding>
    <article-page title="Wholesale">
      <p>
        {{ fullName }} provides wholesale purchasing options and pricing to customers seeking to buy hemp and CBD products in large quantities.
        <strong>Wholesale purchasing options are only available to customers making purchases larger than $1,000.</strong>
      </p>
      <p>Account managers are provided to wholesale customers to assist in completing transactions and to ensure that the process goes smoothly. To get started, take a look at our wholesale catalog and fill out the form below.</p>
      <p>
        <a
          v-if="wholesaleCatalog && wholesaleCatalog.length > 0"
          target="_blank"
          rel="noopener noreferrer"
          type="application/pdf"
          :href="wholesaleCatalog[0].url"
        >Wholesale Catalog</a>
      </p>
      <h2 class="last">Wholesale Application</h2>
      <shipping-form includeCompany @form-input="shippingForm = $event"></shipping-form>
      <div class="switch-container">
        <av-switch class="switch" @switch="differentBilling = $event"></av-switch>
        <p class="billing-question">Different billing address?</p>
      </div>
      <shipping-form includeCompany isBilling v-if="differentBilling"></shipping-form>
      <p class="errors" v-if="errors.length > 0" :class="{ topMargin: differentBilling }">
        The following fields are required:
        <strong>{{ errors.map((e) => uncamelize(e)).join(', ') }}.</strong>
      </p>
      <av-button
        :class="{ topMargin: differentBilling}"
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="onSubmit"
      >Submit</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.last {
  margin-bottom: 15px;
}

.switch-container {
  display: flex;
  justify-content: start;
  margin: 16px 0;
}

.billing-question {
  padding: 0;
  margin-left: 16px;
}

.topMargin {
  margin-top: 16px;
}

.errors {
  padding-top: 0;
  color: var(--warn);
  margin-bottom: 16px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AvButton from '../components/AvButton.vue';
import uncamelize from '../functions/uncamelize';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage,
    AvSwitch,
    AvButton
  },
  data() {
    return {
      fullName: process.env.VUE_APP_FULL_NAME,
      differentBilling: false,
      windowWidth: window.innerWidth,
      shippingForm: {
        email: '',
        name: '',
        company: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      billingForm: {
        name: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      errors: []
    };
  },
  computed: {
    ...mapState('base', ['wholesaleCatalog'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    uncamelize,
    capitalizeFirstLetter(text: string) {
      return text.replace(/^\w/, (c) => c.toUpperCase());
    },
    onSubmit() {
      const unrequiredFields = ['company'];
      const unrequiredBillingFields = [
        ...unrequiredFields,
        'email',
        'phoneNumber'
      ];
      const form = {
        ...this.shippingForm,
        ...(this.differentBilling ? this.billingForm : {})
      };

      const shippingErrors = Object.entries(this.shippingForm)
        .filter(([key, value]) => !unrequiredFields.includes(key) && !value)
        .map(([key]) => key);

      const billingErrors = Object.entries(this.shippingForm)
        .filter(
          ([key, value]) => !unrequiredBillingFields.includes(key) && !value
        )
        .map(([key]) => `billing${this.capitalizeFirstLetter(key)}`);

      this.errors = [
        ...shippingErrors,
        ...(this.differentBilling ? billingErrors : [])
      ];
    }
  },
  mounted() {
    this.getFirestoreData({
      fn: 'queryDocuments',
      collection: 'wholesaleCatalog',
      limit: 1,
      orderBy: {
        field: 'date',
        direction: 'desc'
      }
    });

    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>