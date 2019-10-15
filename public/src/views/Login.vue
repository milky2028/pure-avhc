<template>
  <page-wrapper withPadding>
    <article-page title="Login">
      <p class="sign-in-helper">
        If you have a
        <a href="https://purecbdexchange.com">purecbdexchange.com</a> account, you may also use it to sign in here.
      </p>
      <av-input
        dark
        morePadding
        useNativeFieldError
        type="email"
        autocomplete="email"
        class="field"
        placeholder="Email"
        :pattern="emailPattern"
        @on-input="email = $event"
        @enter="resettingPassword ? resetPassword() : onLogin()"
        :showError="Boolean(emailError)"
        :errorMsg="emailError"
        :value="email"
      ></av-input>
      <av-input
        dark
        morePadding
        useNativeFieldError
        v-if="!resettingPassword"
        class="field"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        :errorMsg="passwordErrorMsg"
        @on-input="password = $event"
        @enter="resettingPassword ? resetPassword() : onLogin()"
        :showError="Boolean(passwordErrorMsg)"
        :value="password"
      ></av-input>
      <p class="reset-password" v-if="!resettingPassword">
        <a @click="resettingPassword = true">Reset Password?</a>
      </p>
      <div class="account-create" v-if="!resettingPassword">
        <av-switch :value="createAnAccount" @switch="createAnAccount = $event"></av-switch>
        <p>Create an account?</p>
      </div>
      <av-button
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        class="btn"
        @btn-click="resettingPassword ? resetPassword() : onLogin()"
      >{{ resettingPassword ? 'Reset Password' : 'Login' }}</av-button>
      <div v-if="!resettingPassword" class="sign-in-container">
        <button class="sign-in-btn" @click="onProviderLogin('google')">
          <img class="sign-in-icon google" src="../assets/img/google.svg" alt="Google icon" />Sign in with Google
        </button>
        <button class="sign-in-btn facebook" @click="onProviderLogin('facebook')">
          <span>
            <img class="sign-in-icon" src="../assets/img/facebook.svg" alt="Facebook icon" />
          </span>
          <span>Sign in with Facebook</span>
        </button>
      </div>
    </article-page>
  </page-wrapper>
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

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvInput,
    AvButton,
    AvSwitch
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
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
    ...mapMutations('base', ['setState']),
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
        this.setState({ type: 'snackbarMsg', data: 'Sending...' });
        try {
          await this.sendPasswordResetEmail(this.email);
          this.setState({ type: 'snackbarMsg', data: 'Sent!' });
          setTimeout(() => {
            this.setState({ type: 'snackbarMsg', data: '' });
          }, 3000);
          this.resettingPassword = false;
        } catch (e) {
          this.setState({ type: 'snackbarMsg', data: '' });
          this.emailError = e;
        }
      } else {
        this.emailError = 'Invalid email format';
      }
    },
    async onProviderLogin(provider: string) {
      try {
        await this.signInWithProvider(provider);
        this.passwordErrorMsg = '';
      } catch (e) {
        this.passwordErrorMsg = e;
      }
    },
    async onLogin() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        this.emailError = '';
        this.setState({ type: 'snackbarMsg', data: 'Authenticating...' });
        if (this.createAnAccount) {
          try {
            await this.createAccountWithEmailAndPassword({
              email: this.email,
              password: this.password
            });
            this.setState({ type: 'snackbarMsg', data: '' });
            this.passwordErrorMsg = '';
          } catch (e) {
            this.passwordErrorMsg = e;
          }
        } else {
          try {
            await this.loginWithEmail({
              email: this.email,
              password: this.password
            });
            this.setState({ type: 'snackbarMsg', data: '' });
            this.passwordErrorMsg = '';
          } catch (e) {
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