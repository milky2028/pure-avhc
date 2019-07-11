<template>
  <transition name="slide-y">
    <div v-if="isDisclaimerShowing" class="disclaimer">
      <div class="text-container">
        <h3>Disclaimer</h3>
        <p>
          Statements on this website have not been evaluated by the
          <abbr
            title="Food and Drug Administration"
          >FDA</abbr>
          . Products distributed by {{ legalName }} are not intended to diagnose, treat, cure, or prevent any disease. Consult your physician before using any hemp supplement. Not intended for use by any person under 18 years of age. By entering, you agree to comply with our
          <router-link class="link" to="privacy-policy">Privacy Policy</router-link>and
          <router-link class="link" to="terms-and-conditions">Terms and Conditions</router-link>.
        </p>
      </div>
      <av-button class="dismiss-btn" icon="close" @btn-click="onDismiss">I understand</av-button>
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
  z-index: 11;
}

h3 {
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
import AvButton from '../components/AvButton.vue';
import AvIconButton from '../components/AvIconButton.vue';

export default Vue.extend({
  components: {
    AvIconButton,
    AvButton
  },
  async mounted() {
    const hasSeenDisclaimer = await idb.get('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      this.setState({ type: 'isDisclaimerShowing', data: true });
    }
  },
  data() {
    return {
      legalName: process.env.VUE_APP_LEGAL_NAME
    };
  },
  computed: {
    ...mapState('base', ['isDisclaimerShowing'])
  },
  methods: {
    ...mapMutations('base', ['setState']),
    onDismiss() {
      this.setState({ type: 'isDisclaimerShowing', data: false });
      try {
        idb.set('hasSeenDisclaimer', true);
      } catch (e) {
        console.error('Error saving to idb');
      }
    }
  }
});
</script>
