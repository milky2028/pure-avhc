<template>
  <page-wrapper withPadding>
    <article-page title="Wholesale">
      <p>
        {{ fullName }} provides wholesale purchasing options and pricing to customers seeking to buy hemp and CBD products in large quantities.
        <strong>Wholesale purchasing options are only available to customers making purchases larger than $1,000.</strong> If your cart total exceeds this amount, and you've been upgraded to a whoelsale account, wholesale discounts will automatically be applied.
      </p>
      <p>
        Account managers are provided to wholesale customers to assist in completing transactions and to ensure that the process goes smoothly. To get started, take a look at our wholesale catalog and fill out the form below.
        <strong>
          If you have any questions, please feel free to
          <router-link to="/support">contact support</router-link>.
        </strong>
      </p>
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
      <form v-if="!uid && !accountCreated">
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
          @on-input="userInfo.phoneNumber = `${userInfo.phoneNumber.startsWith('+') ? '' : '+'}${$event}`"
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
      <shipping-form
        v-if="!uid && !accountCreated"
        includeCompany
        @form-input="shippingForm = $event"
      ></shipping-form>
      <div v-if="!uid && !accountCreated" class="switch-container">
        <av-switch class="switch" @switch="differentBilling = $event"></av-switch>
        <p class="no-padding billing-question">Different billing address?</p>
      </div>
      <shipping-form
        includeCompany
        isBilling
        v-if="differentBilling && !uid"
        @form-input="billingForm = $event"
      ></shipping-form>
      <p class="no-padding user-msg" v-if="uid && !isWholesaleUser">
        You are currently signed in with an existing account. You can click the button below to upgrade your account to a wholesale account, or, if you prefer, you can
        <a
          @click="signOut"
        >sign out</a> and create a new wholesale account with a different email. After your account is created, you'll be signed out. When you sign in again, your new wholesale account will be active.
      </p>
      <p class="no-padding user-msg" v-if="isWholesaleUser || accountCreated">{{ completionMsg }}</p>
      <p
        class="no-padding errors"
        v-if="errors.length > 0"
        :class="{ topMargin: differentBilling }"
      >
        <strong v-html="errors.join('<br>')"></strong>
      </p>
      <av-button
        :class="{ topMargin: differentBilling}"
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="onSubmit"
      >{{ isWholesaleUser ? 'Sign Out of' : uid ? 'Upgrade to' : accountCreated ? 'Login to' : 'Create' }} Wholesale Account</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.no-padding {
  padding-top: 0;
}

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
  margin-left: 16px;
}

.topMargin {
  margin-top: 16px;
}

.errors {
  color: var(--warn);
  margin-bottom: 16px;
}

.user-msg {
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
import { mapActions, mapState, mapMutations } from 'vuex';
import post from '../functions/post';

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
      accountCreated: false,
      completionMsg: `You're already a wholesale user.`,
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
    ...mapState('base', ['wholesaleCatalog', 'functionsUrl']),
    ...mapState('user', ['uid', 'isWholesaleUser'])
  },
  methods: {
    ...mapMutations('base', ['showSnackbar', 'closeSnackbar']),
    ...mapActions('base', ['getFirestoreData']),
    ...mapActions('user', ['signOut']),
    uncamelize,
    capitalizeFirstLetter(text: string) {
      return text.replace(/^\w/, (c) => c.toUpperCase());
    },
    async onSubmit() {
      this.errors = [];
      if (this.accountCreated) {
        this.$router.push('/login');
      } else if (this.isWholesaleUser) {
        this.signOut();
      } else if (this.uid) {
        try {
          this.showSnackbar('Upgrading...');
          const existingUserPayload = {
            isExistingUser: true,
            uid: this.uid
          };
          await post(
            `${this.functionsUrl}/createWholesaleUser`,
            existingUserPayload
          );
          this.signOut();
          this.showSnackbar('Account upgraded');
          setTimeout(() => this.closeSnackbar(), 3500);
        } catch (e) {
          this.closeSnackbar();
          this.errors.push('Error upgrading account');
          throw new Error(e);
        }
      } else {
        const unrequiredFields = ['company'];
        const userErrors = Object.entries(this.userInfo)
          .filter(([, value]) => !value)
          .map(([key]) => key);

        const shippingErrors = Object.entries(this.shippingForm)
          .filter(
            ([key, value]) =>
              !unrequiredFields.includes(key) && !value && key !== 'isBilling'
          )
          .map(([key]) => key);

        const billingErrors = Object.entries(this.billingForm)
          .filter(
            ([key, value]) =>
              !unrequiredFields.includes(key) && !value && key !== 'isBilling'
          )
          .map(([key]) => `billing${this.capitalizeFirstLetter(key)}`);

        this.errors = [
          ...(userErrors.length > 0 ||
          shippingErrors.length > 0 ||
          (this.differentBilling && billingErrors.length > 0)
            ? ['The following fields are required:']
            : []),
          ...userErrors,
          ...shippingErrors,
          ...(this.differentBilling ? billingErrors : [])
        ].map((e) => uncamelize(e));

        if (this.errors.length === 0) {
          this.showSnackbar('Creating account...');
          try {
            const newUserPayload = {
              isExistingUser: false,
              userInfo: this.userInfo,
              shippingAddress: this.shippingForm,
              billingAddress: this.billingForm
            };
            await post(
              `${this.functionsUrl}/createWholesaleUser`,
              newUserPayload
            );
            this.showSnackbar('Account created');
            this.accountCreated = true;
            this.completionMsg =
              'Your wholesale account has been created. Log in to use your new wholesale account.';
            setTimeout(() => this.closeSnackbar(), 3500);
          } catch (e) {
            this.closeSnackbar();
            this.errors.push('Error creating account');
            throw new Error(e);
          }
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