<template>
  <div class="pbottom">
    <p class="body-text sign-in-helper">
      If you have a
      <a
        class="basic-link"
        href="https://purecbdexchange.com"
        target="_blank"
        rel="noopener noreferrer"
        >purecbdexchange.com</a
      >
      account, you may also use it to sign in here.
    </p>
    <form>
      <AvInput
        dark
        more-padding
        type="email"
        autocomplete="email"
        class="mt field"
        placeholder="Email"
        :pattern="emailPattern"
        :value="email"
        @on-input="email = $event"
        @enter="resettingPassword ? resetPassword() : onLogin()"
      />
      <AvInput
        v-if="!resettingPassword"
        dark
        more-padding
        class="mt field"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        :value="password"
        @on-input="password = $event"
        @enter="resettingPassword ? resetPassword() : onLogin()"
      />
    </form>
    <av-error class="error" :error-instance="loginErrors" />
    <p v-if="!resettingPassword" class="body-text basic-link reset-password">
      <a @click="resettingPassword = true">Reset Password?</a>
    </p>
    <div v-if="!resettingPassword" class="mt account-create">
      <p class="body-text">Create an account?</p>
      <AvSwitch :value="createAnAccount" @switch="createAnAccount = $event" />
    </div>
    <AvButton
      long
      :full-width="windowWidth < 835"
      class="mt"
      @btn-click="resettingPassword ? resetPassword() : onLogin()"
    >
      {{ resettingPassword ? 'Reset Password' : 'Login' }}
    </AvButton>
    <div v-if="!resettingPassword" class="sign-in-container">
      <button class="mt sign-in-btn" @click="onProviderLogin('google')">
        <img
          loading="lazy"
          class="sign-in-icon google"
          src="../assets/img/google.svg"
          alt="Google icon"
        />Continue with Google
      </button>
      <button
        class="mt sign-in-btn facebook"
        @click="onProviderLogin('facebook')"
      >
        <span>
          <img
            loading="lazy"
            class="sign-in-icon"
            src="../assets/img/facebook.svg"
            alt="Facebook icon"
          />
        </span>
        <span>Continue with Facebook</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 835px) {
  .account-create {
    max-width: 35vw;
  }
}

.article-inject {
  padding: 2rem 0;
}

.field {
  width: 35vw;
}

.account-create {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

p {
  padding: 0 !important;
}

.reset-password {
  margin-left: 5px;
  font-weight: bold;
  font-size: 14px !important;
}

.sign-in-helper {
  margin-left: 0;
  font-size: 14px !important;
}

.sign-in-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sign-in-btn {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 270px;
  height: 40px;
  border-radius: 19px;
  box-shadow: var(--basic-shadow);
  font-weight: bold;
}

.sign-in-icon {
  width: 18px;
  margin-right: 15px;
  margin-top: -2px;
}

.google {
  width: 23px;
}

.facebook {
  color: white;
  background-color: #3b5998;
}

img {
  border-radius: 4px;
}

.sign-in-btn:active {
  filter: brightness(90%);
}

.error {
  padding: 1rem;
}

@media (max-width: 835px) {
  .field {
    width: 100%;
  }

  .sign-in-btn {
    width: 100%;
  }

  .sign-in-container {
    align-items: center;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, inject } from '@vue/composition-api';
import { useMetadata } from '../use/metadata';
import { Modules } from '../use/store';
import { useFormErrors } from '../use/form-errors';
import { useWindowWidth } from '../use/window-width';
import { ISnackbar } from '../use/snackbar';
import { IUser } from '../use/user';
import AvInput from '../components/AvInput.vue';
import AvError from '../components/AvErrors.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AvButton from '../components/AvButton.vue';

export default defineComponent({
  components: {
    AvInput,
    AvButton,
    AvSwitch,
    AvError
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Login');
    setPageDescription(
      'Log in to your Pure CBD Exchange or Aspen Valley Hemp Company account here to change addresses, payment methods, or get tracking numbers.'
    );
    const { windowWidth } = useWindowWidth();

    const resettingPassword = ref(false);
    const email = ref('');
    const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    const emailReg = new RegExp(emailPattern);

    const {
      uid,
      sendPasswordResetEmail,
      signInWithProvider,
      createAccountWithEmailAndPassword,
      signInWithEmail
    } = inject(Modules.user) as IUser;

    const loginErrors = useFormErrors();

    const { showSnackbar, hideSnackbar } = inject(
      Modules.snackbar
    ) as ISnackbar;
    async function resetPassword() {
      if (emailReg.test(email.value)) {
        loginErrors.errors.value = ['Error:'];
        showSnackbar('Sending...');
        try {
          await sendPasswordResetEmail(email.value);
          showSnackbar('Sent!');
          hideSnackbar();
          resettingPassword.value = false;
        } catch (e) {
          hideSnackbar();
          loginErrors.errors.value.push(e.message ? e.message : e);
          loginErrors.showErrors.value = true;
        }
      } else {
        loginErrors.errors.value.push('Invalid email format');
        loginErrors.showErrors.value = true;
      }
    }

    async function onProviderLogin(provider: string) {
      try {
        await signInWithProvider(provider);
        loginErrors.errors.value = ['Error:'];
      } catch (e) {
        loginErrors.errors.value.push(e);
        loginErrors.showErrors.value = true;
      }
    }

    const password = ref('');
    const createAnAccount = ref(false);
    async function onLogin() {
      loginErrors.showErrors.value = false;
      loginErrors.errors.value = ['Error:'];
      if (emailReg.test(email.value)) {
        showSnackbar('Authenticating...');
        if (createAnAccount.value) {
          try {
            await createAccountWithEmailAndPassword(
              email.value,
              password.value
            );
            hideSnackbar();
            loginErrors.errors.value = ['Error:'];
          } catch (e) {
            hideSnackbar();
            loginErrors.errors.value.push(e.message ? e.message : e);
            loginErrors.showErrors.value = true;
          }
        } else {
          try {
            await signInWithEmail(email.value, password.value);
            hideSnackbar();
            loginErrors.errors.value = ['Error:'];
          } catch (e) {
            hideSnackbar();
            loginErrors.errors.value.push(e.message ? e.message : e);
            loginErrors.showErrors.value = true;
          }
        }
      } else {
        loginErrors.errors.value.push('Invalid email format');
        loginErrors.showErrors.value = true;
      }
    }

    return {
      loginErrors,
      email,
      password,
      emailPattern,
      windowWidth,
      createAnAccount,
      resettingPassword,
      uid,
      resetPassword,
      onProviderLogin,
      onLogin
    };
  }
});
</script>
