<template>
  <transition name="slide-y">
    <div class="prompt" v-if="cartItems && cartItems.length > 0">
      <h2 class="subhead checkout">
        <router-link to="/cart">Checkout ></router-link>
      </h2>
      <av-input class="subscribe" width="350px" placeholder="Email: Get 10% off today"></av-input>
    </div>
  </transition>
</template>

<style scoped>
.prompt {
  padding: 8px 16px 12px 16px;
  z-index: 15;
  position: fixed;
  bottom: 0;
  height: 55px;
  background-color: var(--snackbar-color);
  width: 100%;
  box-shadow: var(--basic-shadow);
  display: grid;
  grid-template-areas: 'main';
  align-items: center;
}

.checkout {
  grid-area: main;
  color: white;
  justify-self: end;
}

.subscribe {
  grid-area: main;
  justify-self: start;
  grid-area: main;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import AvInput from '../components/AvInput.vue';

export default Vue.extend({
  components: {
    AvInput
  },
  computed: {
    ...mapState('cart', ['cartItems'])
  }
});
</script>