<template>
  <transition name="slide-y">
    <div class="prompt" :class="{ expanded }" v-if="cartItems && cartItems.length > 0">
      <h2 class="subhead checkout">
        <router-link to="/cart">Checkout ></router-link>
      </h2>
      <av-icon-button
        v-if="windowWidth < 825 && expanded"
        class="icon"
        @icon-click="expanded = false"
      >close</av-icon-button>
      <transition name="fade">
        <av-input
          class="input"
          v-if="canSubscribe && windowWidth > 825 || canSubscribe && expanded"
          @enter="onSubscribe(email)"
          @on-input="email = $event"
          :value="email"
          width="100%"
          :error="formError"
          :pattern="emailPattern"
          placeholder="Subscribe via email and get 10% off today"
          required
        ></av-input>
      </transition>
      <transition name="fade">
        <av-button v-if="canSubscribe" class="btn" @btn-click="onSubscribe(email)">{{ btnText }}</av-button>
      </transition>
      <transition name="fade">
        <p v-if="formError" class="body-text error">{{ errorMsg }}</p>
      </transition>
      <transition name="fade">
        <p v-if="subscribed" class="body-text msg">Subscribed!</p>
      </transition>
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
  grid-template-areas: 'input btn msg checkout';
  grid-template-columns: 350px 140px 1fr 1fr;
  grid-column-gap: 1vw;
  align-items: center;
  overflow: hidden;
  transition: all 300ms var(--mat-ease);
}

.input {
  grid-area: input;
}

.btn {
  grid-area: btn;
  min-width: 140px;
}

.checkout {
  grid-area: checkout;
  color: white;
  justify-self: end;
}

.msg {
  justify-self: start;
  grid-area: input;
  color: white;
}

.error {
  grid-area: msg;
  color: var(--warn);
}

@media (max-width: 825px) {
  .prompt {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'msg icon'
      'input input'
      'btn checkout';
  }

  .expanded {
    height: 140px;
  }

  .icon {
    justify-self: end;
    grid-area: icon;
  }

  .msg {
    grid-area: btn;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import AvInput from '../components/AvInput.vue';
import AvButton from '../components/AvButton.vue';
import AvIconButton from '../components/AvIconButton.vue';
import { setTimeout } from 'timers';
import * as idb from 'idb-keyval';

export default Vue.extend({
  components: {
    AvInput,
    AvButton,
    AvIconButton
  },
  data() {
    return {
      email: '',
      expanded: false,
      windowWidth: window.innerWidth,
      canSubscribe: true,
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      formError: false,
      errorMsg: 'Invalid email format',
      btnText: window.innerWidth > 825 ? 'Subscribe' : 'Get 10% Off',
      subscribed: false
    };
  },
  computed: {
    ...mapState('cart', ['cartItems'])
  },
  async beforeMount() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 825) {
        this.btnText = 'Get 10% Off';
      } else {
        this.btnText = 'Subscribe';
      }
    });

    const idbCanSubscribe = await idb.get('canSubscribe');
    this.canSubscribe = idbCanSubscribe === undefined ? true : idbCanSubscribe;
  },
  methods: {
    onSubscribe(email: string) {
      if (this.windowWidth > 825 || this.expanded) {
        const reg = new RegExp(this.emailPattern);
        const isValid = reg.test(email);
        if (isValid) {
          this.btnText = 'Subscribing...';
          this.formError = false;

          // TODO: Replace this with actual API call promise
          setTimeout(() => {
            console.log(email);
            this.email = '';
            this.expanded = false;
            this.canSubscribe = false;
            this.subscribed = true;
            setTimeout(() => (this.subscribed = false), 2500);
            idb.set('canSubscribe', false);
          }, 3000);
        } else {
          this.formError = true;
        }
      } else {
        this.expanded = true;
        this.btnText = 'Subscribe';
      }
    }
  }
});
</script>