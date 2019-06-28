<template>
  <nav class="nav" :class="isNavbarExpanded ? 'expanded' : ''">
    <transition name="fade">
      <av-icon-button
        class="icon"
        v-if="!isNavbarExpanded"
        @icon-click="isNavbarExpanded = !isNavbarExpanded"
      >menu</av-icon-button>
    </transition>
    <transition name="fade">
      <av-icon-button
        class="icon"
        v-if="isNavbarExpanded"
        @icon-click="isNavbarExpanded = !isNavbarExpanded"
      >close</av-icon-button>
    </transition>
    <router-link class="logo-link" to="/">
      <h1 class="logo-text" v-if="toolbarLogo.type === 'text'">{{ toolbarLogo.text }}</h1>
      <img v-if="toolbarLogo.type === 'image'" :src="toolbarLogo.url" :alt="toolBarLogo.alt">
    </router-link>
    <div class="right-nav-container">
      <av-icon-button>
        <router-link to="/cart">shopping_cart</router-link>
      </av-icon-button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  padding: 8px 12px;
  width: 100%;
  color: white;
  position: fixed;
  height: 55px;
  background-color: var(--primary-color);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  display: grid;
  grid-template-rows: 39px 1fr;
  grid-template-columns: 24px 1fr 24px;
  grid-template-areas: 'menu logo right';
  align-items: center;
  transition: all 100ms var(--mat-ease);
}

.expanded {
  height: 40vh;
}

.logo-link {
  padding-top: 3px;
  grid-area: logo;
  align-self: center;
  justify-self: center;
  transition: color 100ms var(--mat-ease);
}

.logo-link:hover,
.logo-link:focus {
  color: var(--accent-color);
}

.logo-text {
  font-family: var(--elianto);
  font-size: 28px;
  font-weight: 400;
}

.icon {
  grid-area: menu;
}

.right-nav-container {
  grid-area: right;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms var(--mat-ease);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from '../components/AvIconButton.vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({
  components: {
    AvIconButton
  },
  data() {
    return {
      isNavbarExpanded: false
    };
  },
  computed: {
    ...mapState('base', ['toolbarLogo'])
  },
  methods: {
    ...mapActions('base', ['getAppBase'])
  },
  async beforeMount() {
    await this.getAppBase();
  }
});
</script>
