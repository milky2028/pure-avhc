<template>
  <page-wrapper withPadding>
    <article-page title="Login">
      <p class="sign-in-helper">
        You may also use your
        <a href="https://purecbdexchange.com">purecbdexchange.com</a> account to sign in here.
      </p>
      <av-input
        required
        darkBackground
        morePadding
        useNativeFieldError
        type="email"
        autocomplete="email"
        class="field"
        placeholder="Email"
        :pattern="emailPattern"
        @on-input="email = $event"
        :showError="emailError"
        errorMsg="Invalid email format"
        :value="email"
      ></av-input>
      <av-input
        required
        darkBackground
        morePadding
        useNativeFieldError
        class="field"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        :errorMsg="passwordErrorMsg"
        @on-input="password = $event"
        @enter="onLogin"
        :showError="passwordError"
        :value="password"
      ></av-input>
      <div class="account-create">
        <av-switch :value="createAnAccount" @switch="createAnAccount = $event"></av-switch>
        <p>Create an account?</p>
      </div>
      <av-button
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        class="btn"
        @btn-click="onLogin"
      >Login</av-button>
      <div class="sign-in-container">
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
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvInput,
    AvButton,
    AvSwitch
  },
  beforeMount() {
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
      emailError: false,
      passwordError: false,
      windowWidth: window.innerWidth,
      createAnAccount: false,
      passwordErrorMsg: 'Invalid email/password combination'
    };
  },
  computed: {
    ...mapState('user', ['userId'])
  },
  watch: {
    userId(uid: string) {
      if (uid) {
        this.$router.push('/orders');
      }
    }
  },
  methods: {
    ...mapActions('user', [
      'loginWithEmail',
      'createAccountWithEmailAndPassword',
      'signInWithProvider'
    ]),
    onProviderLogin(provider: string) {
      this.signInWithProvider(provider)
        .then(() => (this.passwordError = false))
        .catch((e: string) => {
          this.passwordErrorMsg = e;
          this.passwordError = true;
        });
    },
    onLogin() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        this.emailError = false;
        if (this.createAnAccount) {
          // @ts-ignore;
          this.createAccountWithEmailAndPassword({
            email: this.email,
            password: this.password
          })
            .then(() => (this.passwordError = false))
            .catch((e: string) => {
              this.passwordErrorMsg = e;
              this.passwordError = true;
            });
        } else {
          // @ts-ignore;
          this.loginWithEmail({
            email: this.email,
            password: this.password
          })
            .then(() => (this.passwordError = false))
            .catch((e: string) => {
              this.passwordErrorMsg = e;
              this.passwordError = true;
            });
        }
      } else {
        this.emailError = true;
      }
    }
  }
});
</script>