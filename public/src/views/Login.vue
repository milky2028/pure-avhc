<template>
  <page-wrapper withPadding>
    <article-page title="Login">
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
        :fullWidth="windowWidth < 825"
        :long="windowWidth > 825"
        class="btn"
        @btn-click="onLogin"
      >Login</av-button>
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

.btn {
  margin-top: 15px;
}

@media (max-width: 825px) {
  .field {
    width: 100%;
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
import { mapActions } from 'vuex';

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
  methods: {
    ...mapActions('user', [
      'loginWithEmail',
      'createAccountWithEmailAndPassword'
    ]),
    onLogin() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        this.emailError = false;
        if (this.createAnAccount) {
          // @ts-ignore;
          this.createAccountWithEmailAndPassword({
            email: this.email,
            password: this.password
          }).catch(() => (this.passwordError = true));
        } else {
          // @ts-ignore;
          this.loginWithEmail({
            email: this.email,
            password: this.password
          }).catch(() => {
            // TODO: Parse error messages into something better for users?
            // console.log(errorMsg);
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