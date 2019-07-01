<template>
  <nav class="nav" :class="isNavbarExpanded ? 'expanded' : ''">
    <transition name="fade">
      <av-icon-button class="icon" v-if="!isNavbarExpanded" @icon-click="onIconClick">menu</av-icon-button>
    </transition>
    <transition name="fade">
      <av-icon-button class="icon" v-if="isNavbarExpanded" @icon-click="onIconClick">close</av-icon-button>
    </transition>
    <router-link class="logo-link" to="/">
      <transition name="fade">
        <h1
          class="logo-text"
          v-if="appLogoMin.type === 'text' && !isNavbarExpanded"
        >{{ appLogoMin.text }}</h1>
      </transition>
      <img v-if="appLogoMin.type === 'image'" :src="appLogoMin.url" :alt="appLogoMin.alt" />
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
  z-index: 20;
  padding: 8px 12px;
  width: 100%;
  color: white;
  position: fixed;
  height: 55px;
  background-color: var(--primary-color);
  box-shadow: var(--basic-shadow);
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
  transition: color 200ms var(--mat-ease);
}

.logo-link:hover,
.logo-link:focus {
  color: var(--light-accent);
}

.logo-text {
  font-family: var(--elianto);
  font-size: 28px;
  font-weight: 400;
  text-transform: uppercase;
}

.icon {
  grid-area: menu;
}

.right-nav-container {
  grid-area: right;
}

@media (max-width: 825px) {
  .expanded {
    height: 100vh;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from '../components/AvIconButton.vue';
import { mapState, mapActions, mapMutations } from 'vuex';

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
    ...mapState('base', ['appLogoMin'])
  },
  methods: {
    ...mapMutations('base', ['toggleOverlay']),
    ...mapActions('base', ['getAppBase']),
    onIconClick() {
      this.isNavbarExpanded = !this.isNavbarExpanded;
      this.toggleOverlay();
    }
  },
  async beforeMount() {
    await this.getAppBase();
  }
});
</script>
