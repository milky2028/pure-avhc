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
          v-if="
            (canSubscribe && windowWidth > 835) || (canSubscribe && expanded)
          "
          type="email"
          autocomplete="email"
          class="input"
          :value="email"
          width="100%"
          :show-error="formError"
          :pattern="emailPattern"
          placeholder="Subscribe via email and get 10% off today"
          required
          @enter="onSubscribe()"
          @on-input="email = $event"
        />
      </transition>
      <transition name="fade">
        <AvButton v-if="canSubscribe" class="btn" @btn-click="onSubscribe()">
          {{ subscribing ? 'Subscribing...' : btnText }}
        </AvButton>
      </transition>
      <transition name="fade">
        <p v-if="formError" class="body-text error">
          {{ errorMsg }}
        </p>
      </transition>
      <transition name="fade">
        <p v-if="subscribed" class="body-text msg">
          Subscribed!
        </p>
      </transition>
      <transition name="fade">
        <div v-if="!canSubscribe && !subscribed" class="total-container">
          <h2 class="subhead total">
            Subtotal:
          </h2>
          <h2 class="subhead total money">${{ subtotal.toFixed(2) }}</h2>
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
  grid-column-gap: 3rem;
  align-items: center;
  overflow: hidden;
  transition: all 300ms var(--mat-ease);
}

.input {
  grid-area: input;
}

.btn {
  grid-area: btn;
}

.checkout {
  grid-area: checkout;
  color: white;
  justify-self: end;
  font-size: 22px;
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
import AvInput from './AvInput.vue';
import AvButton from './AvButton.vue';
import AvIconButton from './AvIconButton.vue';
import { get, set } from 'idb-keyval';
import {
  ref,
  computed,
  onMounted,
  watch,
  createComponent,
  inject
} from '@vue/composition-api';
import workerInstance from '../workers/entry';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { IUser } from '../use/user';
import { ICart } from '../use/cart';

export default createComponent({
  components: {
    AvInput,
    AvButton,
    AvIconButton
  },
  setup(_, ctx) {
    const { windowWidth } = useWindowWidth();

    const expanded = ref(false);
    const btnText = computed(() =>
      windowWidth.value < 835 && !expanded.value ? 'Get 10% Off' : 'Subscribe'
    );

    const { cartItems, subtotal } = inject(Modules.cart) as ICart;
    watch(() => {
      if (cartItems.value.length === 0) {
        expanded.value = false;
      }
    });

    const { uid, canSubscribe } = inject(Modules.user) as IUser;
    onMounted(async () => {
      const idbCanSubscribe = (await get('canSubscribe')) as boolean;
      canSubscribe.value =
        idbCanSubscribe === undefined ? true : idbCanSubscribe;
    });

    const formError = ref(false);
    function onClose() {
      expanded.value = false;
      formError.value = false;
    }

    watch(
      () => ctx.root.$route,
      () => onClose()
    );

    const subscribing = ref(false);
    const subscribed = ref(false);
    const errorMsg = ref('Invalid email format');
    const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    const email = ref('');
    async function onSubscribe() {
      if (windowWidth.value > 835 || expanded.value) {
        const reg = new RegExp(emailPattern);
        const isValid = reg.test(email.value);
        if (isValid) {
          subscribing.value = true;
          formError.value = false;

          (await workerInstance)
            .addDocument('subscribers', {
              email: email.value,
              uid: uid
            })
            .then(() => {
              subscribing.value = false;
              email.value = '';
              expanded.value = false;
              subscribed.value = true;
              setTimeout(() => (subscribed.value = false), 3500);
              canSubscribe.value = false;
              set('canSubscribe', false);
            });
        } else {
          formError.value = true;
        }
      } else {
        expanded.value = true;
      }
    }

    return {
      email,
      expanded,
      windowWidth,
      emailPattern,
      cartItems,
      uid,
      canSubscribe,
      subtotal,
      formError,
      onClose,
      errorMsg,
      subscribing,
      subscribed,
      btnText,
      onSubscribe
    };
  }
});
</script>
