<template>
  <PageWrapper with-padding>
    <ArticlePage title="Login">
      <p class="sign-in-helper">
        If you have a
        <a href="https://purecbdexchange.com">purecbdexchange.com</a> account,
        you may also use it to sign in here.
      </p>
      <form>
        <AvInput
          dark
          more-padding
          use-native-field-error
          type="email"
          autocomplete="email"
          class="field"
          placeholder="Email"
          :pattern="emailPattern"
          :show-error="Boolean(emailError)"
          :error-msg="emailError"
          :value="email"
          @on-input="email = $event"
          @enter="resettingPassword ? resetPassword() : onLogin()"
        />
        <AvInput
          v-if="!resettingPassword"
          dark
          more-padding
          use-native-field-error
          class="field"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          :error-msg="passwordErrorMsg"
          :show-error="Boolean(passwordErrorMsg)"
          :value="password"
          @on-input="password = $event"
          @enter="resettingPassword ? resetPassword() : onLogin()"
        />
      </form>
      <p v-if="!resettingPassword" class="reset-password">
        <a @click="resettingPassword = true">Reset Password?</a>
      </p>
      <div v-if="!resettingPassword" class="account-create">
        <AvSwitch :value="createAnAccount" @switch="createAnAccount = $event" />
        <p>Create an account?</p>
      </div>
      <AvButton
        :full-width="windowWidth < 835"
        :long="windowWidth > 835"
        class="btn"
        @btn-click="resettingPassword ? resetPassword() : onLogin()"
      >
        {{ resettingPassword ? 'Reset Password' : 'Login' }}
      </AvButton>
      <div v-if="!resettingPassword" class="sign-in-container">
        <button class="sign-in-btn" @click="onProviderLogin('google')">
          <img
            loading="lazy"
            class="sign-in-icon google"
            src="../assets/img/google.svg"
            alt="Google icon"
          />Log in with Google
        </button>
        <button
          class="sign-in-btn facebook"
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
          <span>Log in with Facebook</span>
        </button>
      </div>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
.field {
  width: 35vw;
  margin-top: 10px;
}

.account-create {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-items: start;
}

p {
  margin-left: 15px;
  padding: 0;
}

.reset-password {
  margin-left: 5px;
  font-weight: bold;
  font-size: 14px;
}

.sign-in-helper {
  margin-left: 0;
  font-size: 14px;
}

.btn {
  margin-top: 15px;
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
  margin-top: 15px;
  height: 40px;
  border-radius: var(--rounded-corner);
  box-shadow: var(--basic-shadow);
  font-weight: bold;
}

.sign-in-icon {
  width: 18px;
  margin-right: 15px;
  padding-top: 2px;
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
import { createComponent, ref, watch, inject } from '@vue/composition-api';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { IUser } from '../use/user';
import { ISnackbar } from '../use/snackbar';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvInput from '../components/AvInput.vue';
import AvSwitch from '../components/AvSwitch.vue';
import AvButton from '../components/AvButton.vue';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvInput,
    AvButton,
    AvSwitch
  },
  setup(_, ctx) {
    const { windowWidth } = useWindowWidth();

    const {
      uid,
      sendPasswordResetEmail,
      signInWithProvider,
      createAccountWithEmailAndPassword,
      signInWithEmail
    } = inject(Modules.user) as IUser;
    watch(() => {
      if (uid.value) {
        ctx.root.$router.push('/orders');
      }
    });

    const { showSnackbar, hideSnackbar } = inject(
      Modules.snackbar
    ) as ISnackbar;
    async function resetPassword() {
      if (emailReg.test(email.value)) {
        emailError.value = '';
        showSnackbar('Sending...');
        try {
          await sendPasswordResetEmail(email.value);
          showSnackbar('Sent!');
          hideSnackbar();
          resettingPassword.value = false;
        } catch (e) {
          hideSnackbar();
          emailError.value = e;
        }
      } else {
        emailError.value = 'Invalid email format';
      }
    }

    async function onProviderLogin(provider: string) {
      try {
        await signInWithProvider(provider);
        passwordErrorMsg.value = '';
      } catch (e) {
        passwordErrorMsg.value = e;
      }
    }

    const email = ref('');
    const password = ref('');
    const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    const emailReg = new RegExp(emailPattern);
    const emailError = ref('');
    const passwordErrorMsg = ref('');
    const createAnAccount = ref(false);
    const resettingPassword = ref(false);
    async function onLogin() {
      if (emailReg.test(email.value)) {
        emailError.value = '';
        showSnackbar('Authenticating...');
        if (createAnAccount.value) {
          try {
            await createAccountWithEmailAndPassword(
              email.value,
              password.value
            );
            hideSnackbar();
            passwordErrorMsg.value = '';
          } catch (e) {
            hideSnackbar();
            passwordErrorMsg.value = e;
          }
        } else {
          try {
            await signInWithEmail(email.value, password.value);
            hideSnackbar();
            passwordErrorMsg.value = '';
          } catch (e) {
            hideSnackbar();
            passwordErrorMsg.value = e;
          }
        }
      } else {
        emailError.value = 'Invalid email format';
      }
    }

    return {
      email,
      password,
      emailPattern,
      emailError,
      windowWidth,
      createAnAccount,
      passwordErrorMsg,
      resettingPassword,
      uid,
      resetPassword,
      onProviderLogin,
      onLogin
    };
  }
});
</script>
