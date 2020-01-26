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
      <form v-if="!uid">
        <AvInput
          dark
          more-padding
          type="email"
          autocomplete="email"
          placeholder="Email"
          :pattern="emailPattern"
          :value="userInfo.email"
          @on-input="
            userInfo.email = $event;
            checkUserErrors();
          "
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
            }${$event}`;
            checkUserErrors();
          "
        />
        <AvInput
          dark
          more-padding
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          :value="userInfo.password"
          @on-input="
            userInfo.password = $event;
            checkUserErrors();
          "
        />
        <p
          v-if="
            userFormErrors.showErrors.value &&
              userFormErrors.errors.value.length > 1
          "
          class="body-text no-padding errors"
          :class="{ topMargin: differentBilling }"
        >
          <!-- eslint-disable-next-line -->
          <strong v-html="userFormErrors.errors.value.map((e, i) => i === 0 ? e : uncamelize(e)).join('<br>')" />
        </p>
      </form>
      <ShippingForm
        v-if="!uid"
        :form="shippingForm"
        :error-instance="shippingErrors"
        @form-input="setAllStateInObj(shippingForm, $event)"
      />
      <div v-if="!uid" class="switch-container">
        <p class="no-padding billing-question">
          Different billing address?
        </p>
        <AvSwitch class="switch" @switch="differentBilling = $event" />
      </div>
      <ShippingForm
        v-if="differentBilling && !uid"
        :form="billingForm"
        :error-instance="billingErrors"
        @form-input="billingForm = $event"
      />
      <p v-if="uid && !isWholesaleUser" class="no-padding user-msg">
        You are currently signed in with an existing account. You can click the
        button below to upgrade your account to a wholesale account, or, if you
        prefer, you can
        <a @click="signOut">sign out</a> and create a new wholesale account with
        a different email. After your account is created, you will be signed
        out. When you sign in again, your new wholesale account will be active.
      </p>
      <p v-if="isWholesaleUser" class="no-padding user-msg">
        You are already a wholesale user.
      </p>
      <AvButton
        :class="{ topMargin: differentBilling }"
        :full-width="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="onSubmit"
      >
        {{ isWholesaleUser ? 'Sign Out of' : uid ? 'Upgrade to' : 'Create' }}
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
  display: grid;
  grid-auto-flow: column;
  margin: 16px 0;
}

.switch {
  justify-self: end;
}

.topMargin {
  margin-top: 16px;
}

.errors {
  color: var(--warn);
  font-size: 2rem;
}

.user-msg {
  margin-bottom: 16px;
}
</style>

<script lang="ts">
import {
  createComponent,
  ref,
  reactive,
  onMounted,
  inject
} from '@vue/composition-api';
import Address from '../types/Address';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AvButton from '../components/AvButton.vue';
import AvInput from '../components/AvInput.vue';
import post from '../functions/post';
import workerInstance from '../workers/entry';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { ISnackbar } from '../use/snackbar';
import { IUser } from '../use/user';
import { useMetadata } from '../use/metadata';
import { useFormErrors } from '../use/form-errors';
import setAllStateInObj from '../functions/setState';
import uncamelize from '../functions/uncamelize';

export default createComponent({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage,
    AvSwitch,
    AvButton,
    AvInput
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Wholesale');
    setPageDescription(
      'Sign up for a wholesale account today and begin your journey as a CBD entrepreneur. We offer bulk pricing to wholesale customers interested in introducing CBD to their communities in a variety of ways.'
    );

    const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    const fullName = process.env.VUE_APP_FULL_NAME;
    const differentBilling = ref(false);
    const { windowWidth } = useWindowWidth();

    const userFormErrors = useFormErrors();
    const userInfo = reactive({
      email: '',
      phoneNumber: '',
      password: ''
    });

    function checkUserErrors() {
      userFormErrors.errors.value = [
        'The following fields are required:',
        ...Object.entries(userInfo)
          .filter(([, value]) => !value)
          .map(([key]) => key)
      ];
    }
    checkUserErrors();

    const shippingForm = reactive(new Address());
    const shippingErrors = useFormErrors();
    const billingForm = reactive(new Address({ isBilling: true }));
    const billingErrors = useFormErrors();

    const functionsUrl = process.env.VUE_APP_FUNCTIONS_URL;
    const { showSnackbar } = inject(Modules.snackbar) as ISnackbar;
    const { uid, isWholesaleUser, signOut } = inject(Modules.user) as IUser;
    async function onSubmit() {
      if (isWholesaleUser.value) {
        debugger;
        signOut();
        return;
      }

      if (
        shippingErrors.errors.value.length > 1 ||
        billingErrors.errors.value.length > 1 ||
        userFormErrors.errors.value.length > 1
      ) {
        shippingErrors.showErrors.value = true;
        billingErrors.showErrors.value = true;
        userFormErrors.showErrors.value = true;
        return;
      }

      if (uid.value) {
        try {
          showSnackbar('Upgrading...');
          const existingUserPayload = {
            isExistingUser: true,
            uid: uid.value
          };
          await post(
            `${functionsUrl}/createWholesaleUser`,
            existingUserPayload
          );
          signOut();
          showSnackbar('Account upgraded. Sign in to use.', 3500);
        } catch (e) {
          showSnackbar('Error creating wholesale account.', 3500);
        }
      } else {
        showSnackbar('Creating account...');
        try {
          const newUserPayload = {
            isExistingUser: false,
            userInfo: userInfo,
            shippingAddress: shippingForm,
            billingAddress: billingForm
          };
          post(`${functionsUrl}/createWholesaleUser`, newUserPayload)
            .then(() => showSnackbar('Account upgraded. Sign in to use.', 3500))
            .catch(() =>
              showSnackbar('Error creating wholesale account.', 3500)
            );
        } catch (e) {
          showSnackbar('Error creating wholesale account.', 3500);
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

    return {
      setAllStateInObj,
      uid,
      isWholesaleUser,
      wholesaleCatalog,
      onSubmit,
      emailPattern,
      fullName,
      differentBilling,
      windowWidth,
      userInfo,
      shippingForm,
      billingForm,
      shippingErrors,
      billingErrors,
      signOut,
      userFormErrors,
      uncamelize,
      checkUserErrors
    };
  }
});
</script>
