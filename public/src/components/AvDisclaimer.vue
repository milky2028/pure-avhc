<template>
  <transition name="slide-y">
    <div v-if="isDisclaimerShowing" class="disclaimer">
      <div class="text-container">
        <h3>Disclaimer</h3>
        <p>
          THIS SITE IS STILL UNDER CONSTRUCTION. PLEASE USE
          <a
            style="color: green"
            href="https://purecbdexchange.com/"
            target="_blank"
            rel="noopener noreferrer"
            >PURECBDEXCHANGE.COM</a
          >
          UNTIL THIS SITE IS COMPLETE.
        </p>
        <!-- TODO: Put this back -->
        <!-- <p>
          Statements on this website have not been evaluated by the
          <abbr title="Food and Drug Administration">FDA</abbr>
          . Products distributed by {{ legalName }} are not intended to
          diagnose, treat, cure, or prevent any disease. Consult your physician
          before using any hemp supplement. Not intended for use by any person
          under 18 years of age. By entering, you agree to comply with our
          <router-link class="link" to="privacy-policy">
            Privacy Policy </router-link
          >and
          <router-link class="link" to="terms-and-conditions">
            Terms and Conditions </router-link
          >.
        </p> -->
      </div>
      <AvButton class="dismiss-btn" icon="close" @btn-click="hideDisclaimer">
        I understand
      </AvButton>
    </div>
  </transition>
</template>

<style scoped>
.disclaimer {
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: fixed;
  background-color: var(--snackbar-color);
  height: min-content;
  width: 375px;
  left: 75px;
  bottom: 75px;
  border-radius: var(--rounded-corner);
  box-shadow: var(--basic-shadow);
  color: white;
  font-family: var(--mukta-malar);
  z-index: 21;
}

h3 {
  font-size: 2rem;
  font-weight: bold;
}

p {
  font-size: 14px;
  line-height: 1.2;
}

.text-container {
  margin-bottom: 16px;
}

.dismiss-btn {
  align-self: flex-end;
}

@media (max-width: 835px) {
  .disclaimer {
    bottom: 0;
    left: 0;
    width: 100vw;
    border-radius: 0;
  }
}
</style>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api';
import AvButton from './AvButton.vue';
import { Modules } from '../use/store';
import { IDisclaimer } from '../use/disclaimer';

export default defineComponent({
  components: {
    AvButton
  },
  setup() {
    const legalName = process.env.VUE_APP_LEGAL_NAME;
    const { isDisclaimerShowing, hideDisclaimer } = inject(
      Modules.disclaimer
    ) as IDisclaimer;

    return { legalName, isDisclaimerShowing, hideDisclaimer };
  }
});
</script>
