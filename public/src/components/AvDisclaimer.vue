<template>
  <transition name="fade">
    <div v-if="isDisclaimerShowing" class="disclaimer">
      <h3>Disclaimer</h3>
      <p>
        Statements on this website have not been evaluated by the FDA. Products distributed by {{ legalName }} are not intended to diagnose, treat, cure, or prevent any disease. Consult your physician before using any hemp supplement. Not intended for use by any person under 18 years of age. By entering, you agree to comply with our
        <router-link class="link" to="privacy-policy">Privacy Policy</router-link>and
        <router-link class="link" to="terms-and-conditions">Terms and Conditions</router-link>.
        <!-- <button @click="onDismiss">Dismiss</button> -->
      </p>
    </div>
  </transition>
</template>

<style scoped>
.disclaimer {
  padding: 16px;
  position: fixed;
  background-color: var(--snackbar-color);
  height: 220px;
  width: 375px;
  left: 75px;
  bottom: 75px;
  border-radius: 5px;
  box-shadow: var(--basic-shadow);
  color: white;
  font-family: var(--mukta-malar);
}

h3 {
  font-weight: bold;
}

p {
  font-size: 14px;
  line-height: 1.2;
}

@media (max-width: 825px) {
  .disclaimer {
    bottom: 0;
    left: 0;
    width: 100vw;
    border-radius: 0;
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import * as idb from 'idb-keyval';

export default Vue.extend({
  beforeMount() {
    // this.isDisclaimerShowing = false;
  },
  data() {
    return {
      isDisclaimerShowing: true,
      legalName: process.env.VUE_APP_LEGAL_NAME
    };
  },
  methods: {
    onDismiss() {
      this.isDisclaimerShowing = false;
      try {
        idb.set('hasSeenDisclaimer', true);
      } catch (e) {
        console.error('Error saving to idb');
      }
    }
  }
});
</script>
