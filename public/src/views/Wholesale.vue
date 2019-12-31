<template>
  <PageWrapper with-padding>
    <ArticlePage title="Wholesale">
      <p>
        {{ fullName }} provides wholesale purchasing options and pricing to
        customers seeking to buy hemp and CBD products in large quantities.
        <strong
          >Wholesale purchasing options are only available to customers making
          purchases larger than $1,000.</strong
        >
        If your cart total exceeds this amount, and you've been upgraded to a
        whoelsale account, wholesale discounts will automatically be applied.
      </p>
      <p>
        Account managers are provided to wholesale customers to assist in
        completing transactions and to ensure that the process goes smoothly. To
        get started, take a look at our wholesale catalog and fill out the form
        below.
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
          >Wholesale Catalog</a
        >
      </p>
      <h2 class="last">
        Wholesale Account Application
      </h2>
      <form v-if="!uid && !accountCreated">
        <AvInput
          dark
          more-padding
          type="email"
          autocomplete="email"
          placeholder="Email"
          :pattern="emailPattern"
          :value="userInfo.email"
          @on-input="userInfo.email = $event"
        />
        <AvInput
          dark
          more-padding
          placeholder="Phone Number"
          type="tel"
          autocomplete="tel"
          :value="userInfo.phoneNumber"
          @on-input="
            userInfo.phoneNumber = `${
              userInfo.phoneNumber.startsWith('+') ? '' : '+'
            }${$event}`
          "
        />
        <AvInput
          dark
          more-padding
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          :value="userInfo.password"
          @on-input="userInfo.password = $event"
        />
      </form>
      <ShippingForm
        v-if="!uid && !accountCreated"
        include-company
        @form-input="shippingForm = $event"
      />
      <div v-if="!uid && !accountCreated" class="switch-container">
        <AvSwitch class="switch" @switch="differentBilling = $event" />
        <p class="no-padding billing-question">
          Different billing address?
        </p>
      </div>
      <ShippingForm
        v-if="differentBilling && !uid"
        include-company
        is-billing
        @form-input="billingForm = $event"
      />
      <p v-if="uid && !isWholesaleUser" class="no-padding user-msg">
        You are currently signed in with an existing account. You can click the
        button below to upgrade your account to a wholesale account, or, if you
        prefer, you can
        <a @click="signOut">sign out</a> and create a new wholesale account with
        a different email. After your account is created, you'll be signed out.
        When you sign in again, your new wholesale account will be active.
      </p>
      <p v-if="isWholesaleUser || accountCreated" class="no-padding user-msg">
        {{ completionMsg }}
      </p>
      <p
        v-if="errors.length > 0"
        class="no-padding errors"
        :class="{ topMargin: differentBilling }"
      >
        <!-- eslint-disable-next-line -->
        <strong v-if="purifier" v-html="errors.map((err) => purifier.sanitize(err)).join('<br>')" />
      </p>
      <AvButton
        :class="{ topMargin: differentBilling }"
        :full-width="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="onSubmit"
      >
        {{
          isWholesaleUser
            ? 'Sign Out of'
            : uid
            ? 'Upgrade to'
            : accountCreated
            ? 'Login to'
            : 'Create'
        }}
        Wholesale Account
      </AvButton>
    </ArticlePage>
  </PageWrapper>
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
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AvButton from '../components/AvButton.vue';
import AvInput from '../components/AvInput.vue';
import uncamelize from '../functions/uncamelize';
import post from '../functions/post';
import {
  createComponent,
  ref,
  reactive,
  onMounted,
  inject,
  Ref
} from '@vue/composition-api';
import workerInstance from '../workers/entry';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { ISnackbar } from '../use/snackbar';
import { IUser } from '../use/user';
import capitalizeFirstLetter from '../functions/capitalizeFirstLetter';
import { useMetadata } from '../use/metadata';

export default createComponent({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage,
    AvSwitch,
    AvButton,
    AvInput
  },
  setup(_, ctx) {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Wholesale');
    setPageDescription(
      'Sign up for a wholesale account today and begin your journey as a CBD entrepreneur. We offer bulk pricing to wholesale customers interested in introducing CBD to their communities in a variety of ways.'
    );

    const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    const fullName = process.env.VUE_APP_FULL_NAME;
    const differentBilling = ref(false);
    const { windowWidth } = useWindowWidth();
    const accountCreated = ref(false);
    const completionMsg = ref('You are already a wholesale user.');

    const userInfo = reactive({
      email: '',
      phoneNumber: '',
      password: ''
    });

    const shippingForm = reactive({
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });

    const billingForm = reactive({
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });

    const errors = ref([] as string[]);
    const functionsUrl = process.env.VUE_APP_FUNCTIONS_URL;
    const { showSnackbar, snackbarMsg, hideSnackbar } = inject(
      Modules.snackbar
    ) as ISnackbar;
    const { uid, isWholesaleUser, signOut } = inject(Modules.user) as IUser;
    async function onSubmit() {
      errors.value = [];
      if (accountCreated.value) {
        ctx.root.$router.push('/login');
      } else if (isWholesaleUser.value) {
        signOut();
      } else if (uid.value) {
        try {
          snackbarMsg.value = 'Upgrading...';
          const existingUserPayload = {
            isExistingUser: true,
            uid
          };
          await post(
            `${functionsUrl}/createWholesaleUser`,
            existingUserPayload
          );
          signOut();
          showSnackbar('Account upgraded', 3500);
        } catch (e) {
          hideSnackbar();
          errors.value.push('Error upgrading account');
        }
      } else {
        const unrequiredFields = ['company'];
        const userErrors = Object.entries(userInfo)
          .filter(([, value]) => !value)
          .map(([key]) => key);

        const shippingErrors = Object.entries(shippingForm)
          .filter(
            ([key, value]) =>
              !unrequiredFields.includes(key) && !value && key !== 'isBilling'
          )
          .map(([key]) => key);

        const billingErrors = Object.entries(billingForm)
          .filter(
            ([key, value]) =>
              !unrequiredFields.includes(key) && !value && key !== 'isBilling'
          )
          .map(([key]) => `billing${capitalizeFirstLetter(key)}`);

        errors.value = [
          ...(userErrors.length > 0 ||
          shippingErrors.length > 0 ||
          (differentBilling && billingErrors.length > 0)
            ? ['The following fields are required:']
            : []),
          ...userErrors,
          ...shippingErrors,
          ...(differentBilling ? billingErrors : [])
        ].map((e) => uncamelize(e));

        if (errors.value.length === 0) {
          showSnackbar('Creating account...');
          try {
            const newUserPayload = {
              isExistingUser: false,
              userInfo: userInfo,
              shippingAddress: shippingForm,
              billingAddress: billingForm
            };
            post(`${functionsUrl}/createWholesaleUser`, newUserPayload).then(
              () => {
                showSnackbar('Account created', 3500);
                accountCreated.value = true;
                completionMsg.value =
                  'Your wholesale account has been created. Log in to use your new wholesale account.';
              }
            );
          } catch (e) {
            hideSnackbar();
            errors.value.push('Error creating account');
          }
        }
      }
    }

    const wholesaleCatalog = ref('');
    onMounted(async () => {
      const catalogs = (await (await workerInstance).queryDocuments({
        collection: 'wholesaleCatalog',
        limit: 1,
        orderBy: {
          field: 'date',
          direction: 'desc'
        }
      })) as { id: string; url: string }[];
      wholesaleCatalog.value = catalogs[0].url;
    });

    const purifier: Ref<null | {}> = ref(null);
    import('dompurify').then((importRes) => (purifier.value = importRes));

    return {
      uid,
      isWholesaleUser,
      wholesaleCatalog,
      onSubmit,
      emailPattern,
      fullName,
      differentBilling,
      windowWidth,
      accountCreated,
      completionMsg,
      userInfo,
      shippingForm,
      billingForm,
      errors,
      purifier
    };
  }
});
</script>
