<template>
  <transition name="slide-y">
    <div class="prompt" :class="{ expanded }" v-if="cartItems && cartItems.length > 0">
      <h2 class="subhead checkout">
        <router-link to="/cart">Checkout ></router-link>
      </h2>
      <transition name="fade">
        <av-input
          class="input"
          v-if="canSubscribe && windowWidth > 825 || canSubscribe && expanded"
          @enter="onSubscribe(email)"
          @on-input="email = $event"
          width="100%"
          :inputValue="email"
          placeholder="Subscribe via email and get 10% off today"
        ></av-input>
      </transition>
      <av-button v-if="canSubscribe" class="btn" @btn-click="onSubscribe(email)">{{ btnText }}</av-button>
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
  grid-template-areas: 'input btn checkout';
  grid-template-columns: 350px 103px 1fr;
  grid-column-gap: 1vw;
  align-items: center;
  overflow: hidden;
  transition: all 300ms var(--mat-ease);
}

.btn {
  grid-area: btn;
}

.checkout {
  grid-area: checkout;
  color: white;
  justify-self: end;
}

@media (max-width: 825px) {
  .prompt {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'input input'
      'btn checkout';
  }

  .input {
    grid-area: input;
  }

  .expanded {
    height: 110px;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import AvInput from '../components/AvInput.vue';
import AvButton from '../components/AvButton.vue';

export default Vue.extend({
  components: {
    AvInput,
    AvButton
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    btnText() {
      return this.windowWidth > 825 || this.expanded
        ? 'Subscribe'
        : 'Get 10% Off';
    }
  },
  data() {
    return {
      email: '',
      expanded: false,
      windowWidth: window.innerWidth,
      canSubscribe: true
    };
  },
  beforeMount() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  },
  methods: {
    onSubscribe(event: string) {
      if (this.windowWidth > 825 || this.expanded) {
        console.log(event);
        this.email = '';
        this.expanded = false;
      } else {
        this.expanded = true;
      }
    }
  }
});
</script>