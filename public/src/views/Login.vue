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
        errorMsg="Invalid email/password combination"
        @on-input="password = $event"
        @enter="login"
        :showError="passwordError"
        :value="password"
      ></av-input>
      <av-button
        :fullWidth="windowWidth < 825"
        :long="windowWidth > 825"
        class="btn"
        @btn-click="login"
      >Login</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.field {
  width: 35vw;
  margin-top: 10px;
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
import { mapActions } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvInput,
    AvButton
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
      windowWidth: window.innerWidth
    };
  },
  methods: {
    ...mapActions('user', ['loginWithEmail']),
    login() {
      const emailReg = new RegExp(this.emailPattern);
      if (emailReg.test(this.email)) {
        // @ts-ignore;
        this.loginWithEmail({
          email: this.email,
          password: this.password
        }).catch(() => (this.passwordError = true));
      } else {
        this.emailError = true;
      }
    }
  }
});
</script>