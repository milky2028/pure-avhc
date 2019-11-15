<template>
  <transition name="slide-y">
    <div
      v-if="cartItems && cartItems.length > 0"
      class="prompt"
      :class="{ expanded }"
    >
      <h2 class="subhead checkout">
        <router-link to="/checkout">
          Checkout >
        </router-link>
      </h2>
      <AvIconButton
        v-if="windowWidth < 835 && expanded"
        class="icon"
        @icon-click="onClose()"
      >
        close
      </AvIconButton>
      <transition name="fade">
        <AvInput
          v-if="canSubscribe && windowWidth > 835 || canSubscribe && expanded"
          type="email"
          autocomplete="email"
          class="input"
          :value="email"
          width="100%"
          :show-error="formError"
          :pattern="emailPattern"
          placeholder="Subscribe via email and get 10% off today"
          required
          @enter="onSubscribe(email)"
          @on-input="email = $event"
        />
      </transition>
      <transition name="fade">
        <AvButton
          v-if="canSubscribe"
          class="btn"
          @btn-click="onSubscribe(email)"
        >
          {{ subscribing ? 'Subscribing...' : btnText }}
        </AvButton>
      </transition>
      <transition name="fade">
        <p
          v-if="formError"
          class="body-text error"
        >
          {{ errorMsg }}
        </p>
      </transition>
      <transition name="fade">
        <p
          v-if="subscribed"
          class="body-text msg"
        >
          Subscribed!
        </p>
      </transition>
      <transition name="fade">
        <div
          v-if="!canSubscribe && !subscribed"
          class="total-container"
        >
          <h2 class="subhead total">
            Subtotal:
          </h2>
          <h2 class="subhead total money">
            ${{ subtotal.toFixed(2) }}
          </h2>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.prompt {
  padding: 6px 16px 6px 16px;
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
  margin-right: 1ch;
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
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import AvInput from './AvInput.vue';
import AvButton from './AvButton.vue';
import AvIconButton from './AvIconButton.vue';
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
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      formError: false,
      errorMsg: 'Invalid email format',
      subscribing: false,
      subscribed: false,
      btnText: window.innerWidth < 835 ? 'Get 10% Off' : 'Subscribe'
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
    },
    windowWidth(windowWidth: number) {
      this.btnText =
        windowWidth < 835 && !this.expanded ? 'Get 10% Off' : 'Subscribe';
    }
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapState('user', ['uid', 'canSubscribe']),
    ...mapGetters('cart', ['subtotal'])
  },
  async mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );

    const idbCanSubscribe = (await idb.get('canSubscribe')) as boolean;
    this.setState({
      type: 'canSubscribe',
      data: idbCanSubscribe === undefined ? true : idbCanSubscribe
    });
  },
  methods: {
    ...mapActions('base', ['addFirestoreData']),
    ...mapMutations('user', ['setState']),
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

          await this.addFirestoreData({
            fn: 'addDocument',
            collection: 'subscribers',
            data: {
              email: this.email,
              uid: this.uid
            }
          });

          this.subscribing = false;
          this.email = '';
          this.expanded = false;
          this.subscribed = true;
          setTimeout(() => (this.subscribed = false), 2500);
          this.setState({ type: 'canSubscribe', data: false });
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