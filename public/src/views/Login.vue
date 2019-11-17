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
            class="sign-in-icon google"
            src="../assets/img/google.svg"
            alt="Google icon"
          />Sign in with Google
        </button>
        <button
          class="sign-in-btn facebook"
          @click="onProviderLogin('facebook')"
        >
          <span>
            <img
              class="sign-in-icon"
              src="../assets/img/facebook.svg"
              alt="Facebook icon"
            />
          </span>
          <span>Sign in with Facebook</span>
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
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvInput from '../components/AvInput.vue';
import AvButton from '../components/AvButton.vue';
import AvSwitch from '../components/AvSwitch.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvInput,
    AvButton,
    AvSwitch
  },
  data() {
    return {
      email: '',
      password: '',
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      emailError: '',
      windowWidth: window.innerWidth,
      createAnAccount: false,
      passwordErrorMsg: '',
      resettingPassword: false
    };
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  },
  computed: {
    ...mapState('user', ['uid'])
  },
  watch: {
    uid(id: string) {
      if (id) {
        this.$router.push('/orders');
      }
    }
  },
  methods: {
    ...mapMutations('base', ['showSnackbar', 'closeSnackbar']),
    ...mapActions('base', ['getFirestoreData']),
    ...mapActions('user', [
      'loginWithEmail',
      'createAccountWithEmailAndPassword',
      'signInWithProvider',
      'sendPasswordResetEmail'
    ]),
    async resetPassword() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        this.emailError = '';
        this.showSnackbar('Sending...');
        try {
          await this.sendPasswordResetEmail(this.email);
          this.showSnackbar('Sent!');
          this.closeSnackbar();
          this.resettingPassword = false;
        } catch (e) {
          this.closeSnackbar();
          this.emailError = e;
        }
      } else {
        this.emailError = 'Invalid email format';
      }
    },
    async onProviderLogin(provider: string) {
      try {
        const uid = await this.signInWithProvider(provider);
        const workerMsg: WorkerFns = {
          collection: 'userExtras',
          fn: 'getDocumentById',
          payload: { documentId: uid },
          targetModule: 'user'
        };
        this.getFirestoreData(workerMsg);
        this.passwordErrorMsg = '';
      } catch (e) {
        this.passwordErrorMsg = e;
      }
    },
    async onLogin() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        this.emailError = '';
        this.showSnackbar('Authenticating...');
        if (this.createAnAccount) {
          try {
            await this.createAccountWithEmailAndPassword({
              email: this.email,
              password: this.password
            });
            this.closeSnackbar();
            this.passwordErrorMsg = '';
          } catch (e) {
            this.closeSnackbar();
            this.passwordErrorMsg = e;
          }
        } else {
          try {
            const uid = await this.loginWithEmail({
              email: this.email,
              password: this.password
            });
            this.closeSnackbar();
            this.passwordErrorMsg = '';
            const workerMsg: WorkerFns = {
              collection: 'userExtras',
              fn: 'getDocumentById',
              payload: { documentId: uid },
              targetModule: 'user'
            };
            this.getFirestoreData(workerMsg);
          } catch (e) {
            this.closeSnackbar();
            this.passwordErrorMsg = e;
          }
        }
      } else {
        this.emailError = 'Invalid email format';
      }
    }
  }
});
</script>
