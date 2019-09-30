<template>
  <transition name="slide-y">
    <div class="prompt" :class="{ expanded }" v-if="cartItems && cartItems.length > 0">
      <h2 class="subhead checkout">
        <router-link to="/cart">Checkout ></router-link>
      </h2>
      <av-icon-button
        v-if="windowWidth < 835 && expanded"
        class="icon"
        @icon-click="onClose()"
      >close</av-icon-button>
      <transition name="fade">
        <av-input
          type="email"
          autocomplete="email"
          class="input"
          v-if="canSubscribe && windowWidth > 835 || canSubscribe && expanded"
          @enter="onSubscribe(email)"
          @on-input="email = $event"
          :value="email"
          width="100%"
          :showError="formError"
          :pattern="emailPattern"
          placeholder="Subscribe via email and get 10% off today"
          required
        ></av-input>
      </transition>
      <transition name="fade">
        <av-button
          v-if="canSubscribe"
          class="btn"
          @btn-click="onSubscribe(email)"
        >{{ subscribing ? 'Subscribing...' : btnText }}</av-button>
      </transition>
      <transition name="fade">
        <p v-if="formError" class="body-text error">{{ errorMsg }}</p>
      </transition>
      <transition name="fade">
        <p v-if="subscribed" class="body-text msg">Subscribed!</p>
      </transition>
      <transition name="fade">
        <div v-if="!canSubscribe && !subscribed" class="total-container">
          <h2 class="subhead total">Subtotal:&nbsp;</h2>
          <h2 class="subhead total money">${{ subtotal.toFixed(2) }}</h2>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.prompt {
  padding: 12px 16px 12px 16px;
  z-index: 15;
  position: fixed;
  bottom: 0;
  height: 55px;
  background-color: var(--snackbar-color);
  width: 100%;
  box-shadow: var(--basic-shadow);
  display: grid;
  row-gap: 5px;
  grid-template-areas: 'input btn msg checkout';
  grid-template-columns: 360px 140px 1fr 1fr;
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

.total-container {
  grid-area: input;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  justify-self: start;
  align-self: center;
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

.money {
  color: var(--light-accent);
}

.total {
  line-height: 1;
}

@media (max-width: 835px) {
  .prompt {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'btn checkout';
  }

  .expanded {
    height: 140px;
    grid-template-areas:
      'msg icon'
      'input input'
      'btn checkout';
  }

  .icon {
    justify-self: end;
    grid-area: icon;
  }

  .msg {
    grid-area: btn;
  }

  .total-container {
    grid-area: btn;
    flex-direction: column;
  }

  .total {
    font-size: 16px;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import AvInput from '../components/AvInput.vue';
import AvButton from '../components/AvButton.vue';
import AvIconButton from '../components/AvIconButton.vue';
import { setTimeout } from 'timers';
import * as idb from 'idb-keyval';
import WorkerFns from '../types/WorkerFns';

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
      windowWidth: window ? window.innerWidth : 0,
      canSubscribe: true,
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      formError: false,
      errorMsg: 'Invalid email format',
      subscribing: false,
      subscribed: false
    };
  },
  watch: {
    $route() {
      this.expanded = false;
      this.formError = false;
    },
    cartItems(items) {
      if (items.length === 0) {
        this.expanded = false;
      }
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapGetters('cart', ['subtotal']),
    btnText(): string {
      return this.windowWidth < 835 && !this.expanded
        ? 'Get 10% Off'
        : 'Subscribe';
    }
  },
  async beforeMount() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );

    const idbCanSubscribe = (await idb.get('canSubscribe')) as boolean;
    this.canSubscribe = idbCanSubscribe === undefined ? true : idbCanSubscribe;
  },
  methods: {
    ...mapActions('base', ['addFirestoreData']),
    onClose() {
      this.expanded = false;
      this.formError = false;
    },
    async onSubscribe(email: string): Promise<void> {
      if (this.windowWidth > 835 || this.expanded) {
        const reg = new RegExp(this.emailPattern);
        const isValid = reg.test(email);
        if (isValid) {
          this.subscribing = true;
          this.formError = false;

          // @ts-ignore;
          const id = await this.addFirestoreData({
            fn: 'addDocument',
            collection: 'subscribers',
            data: {
              email: this.email
            }
          });

          this.subscribing = false;
          this.email = '';
          this.expanded = false;
          this.canSubscribe = false;
          this.subscribed = true;
          setTimeout(() => (this.subscribed = false), 2500);
          idb.set('canSubscribe', false);
        } else {
          this.formError = true;
        }
      } else {
        this.expanded = true;
      }
    }
  }
});
</script>