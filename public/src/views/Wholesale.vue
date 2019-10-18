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
      <h2 class="last">Wholesale Account Application</h2>
      <form v-if="!uid">
        <av-input
          dark
          morePadding
          type="email"
          autocomplete="email"
          placeholder="Email"
          :pattern="emailPattern"
          @on-input="userInfo.email = $event"
          :value="userInfo.email"
        ></av-input>
        <av-input
          dark
          morePadding
          placeholder="Phone Number"
          type="tel"
          autocomplete="tel"
          :value="userInfo.phoneNumber"
          @on-input="userInfo.phoneNumber = $event"
        ></av-input>
        <av-input
          dark
          morePadding
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          @on-input="userInfo.password = $event"
          :value="userInfo.password"
        ></av-input>
      </form>
      <shipping-form v-if="!uid" includeCompany @form-input="shippingForm = $event"></shipping-form>
      <div v-if="!uid" class="switch-container">
        <av-switch class="switch" @switch="differentBilling = $event"></av-switch>
        <p class="billing-question">Different billing address?</p>
      </div>
      <shipping-form
        includeCompany
        isBilling
        v-if="differentBilling && !uid"
        @form-input="billingForm = $event"
      ></shipping-form>
      <p class="errors" v-if="errors.length > 0" :class="{ topMargin: differentBilling }">
        The following fields are required:
        <strong>{{ errors.map((e) => uncamelize(e)).join(', ') }}.</strong>
      </p>
      <p class="user-msg" v-if="uid">
        You are currently signed in with an existing account. You can click the button below to upgrade your account to a wholesale account, or, if you prefer, you can
        <a
          @click="signOut"
        >sign out</a> and create a new wholesale account with a different email.
      </p>
      <av-button
        :class="{ topMargin: differentBilling}"
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="onSubmit"
      >{{ uid ? 'Upgrade to Wholesale Account' : 'Submit' }}</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
form {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1vmax;
  margin: 16px 0;
}

.last {
  margin-bottom: 15px;
}

.switch-container {
  display: flex;
  justify-content: flex-start;
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

.user-msg {
  padding-top: 0;
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
import AvInput from '../components/AvInput.vue';
import uncamelize from '../functions/uncamelize';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage,
    AvSwitch,
    AvButton,
    AvInput
  },
  data() {
    return {
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      fullName: process.env.VUE_APP_FULL_NAME,
      differentBilling: false,
      windowWidth: window.innerWidth,
      userInfo: {
        email: '',
        phoneNumber: '',
        password: ''
      },
      shippingForm: {
        name: '',
        company: '',
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
      errors: [] as string[]
    };
  },
  computed: {
    ...mapState('base', ['wholesaleCatalog']),
    ...mapState('user', ['uid'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    ...mapActions('user', ['signOut']),
    uncamelize,
    capitalizeFirstLetter(text: string) {
      return text.replace(/^\w/, (c) => c.toUpperCase());
    },
    onSubmit() {
      if (this.uid) {
        console.log('upgrade account');
      } else {
        const unrequiredFields = ['company'];
        const userErrors = Object.entries(this.userInfo)
          .filter(([, value]) => !value)
          .map(([key]) => key);

        const shippingErrors = Object.entries(this.shippingForm)
          .filter(([key, value]) => !unrequiredFields.includes(key) && !value)
          .map(([key]) => key);

        const billingErrors = Object.entries(this.shippingForm)
          .filter(([key, value]) => !unrequiredFields.includes(key) && !value)
          .map(([key]) => `billing${this.capitalizeFirstLetter(key)}`);

        this.errors = [
          ...userErrors,
          ...shippingErrors,
          ...(this.differentBilling ? billingErrors : [])
        ];

        if (this.errors.length === 0) {
          console.log(this.shippingForm, this.billingForm, this.userInfo);
        }
      }
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