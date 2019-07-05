<template>
  <nav class="nav" :class="isNavbarExpanded ? 'expanded' : ''">
    <transition name="fade" mode="out-in">
      <av-icon-button class="menu" v-if="!isNavbarExpanded" @icon-click="onIconClick">menu</av-icon-button>
    </transition>
    <transition name="fade">
      <av-icon-button class="menu" v-if="isNavbarExpanded" @icon-click="onIconClick">close</av-icon-button>
    </transition>
    <router-link class="logo-link" to="/">
      <transition name="fade">
        <h1 class="logo-text" v-if="appLogoMin.type === 'text' && !isNavbarExpanded">
          <abbr title="Aspen Valley Hemp Company">{{ appLogoMin.text }}</abbr>
        </h1>
        <img v-if="appLogoMin.type === 'image'" :src="appLogoMin.url" :alt="appLogoMin.alt">
      </transition>
    </router-link>
    <div class="right-nav-container">
      <av-icon-button>
        <router-link to="/cart">shopping_cart</router-link>
      </av-icon-button>
      <av-icon-button>
        <router-link to="/orders">person</router-link>
      </av-icon-button>
    </div>
    <div v-if="isNavbarExpanded" class="menu-container">
      <div class="large-logo-container">
        <h1 class="logo-text large" v-if="appLogoFull.type === 'text'">{{ appLogoFull.text }}</h1>
        <h2 class="subhead" v-if="appLogoFull.type === 'text'">{{ appLogoFull.subtext }}</h2>
        <img v-if="appLogoFull.type === 'image'" :src="appLogoFull.url" :alt="appLogoFull.alt">
      </div>
      <ul class="subhead submenu">
        <li v-for="menuItem of submenu" :key="menuItem.display">
          <router-link v-if="menuItem.type === 'internal'" :to="menuItem.url">
            <li>{{ menuItem.display }}</li>
          </router-link>
          <a v-else :href="menuItem.url">{{ menuItem.display }}</a>
        </li>
      </ul>
      <h3 class="subhead copyright">© {{ legalName }} 2019</h3>
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
  grid-template-columns: 56px 1fr 56px;
  grid-template-areas: 'menu logo right';
  align-items: center;
  transition: all 100ms var(--mat-ease);
}

.right-nav-container {
  display: flex;
  justify-content: space-between;
}

abbr {
  text-decoration: none;
}

.expanded {
  height: 40vh;
  grid-template-areas:
    'menu logo right'
    'expanded expanded expanded';
}

.menu-container {
  padding: 4px;
  height: 100%;
  grid-area: expanded;
  display: grid;
  grid-template-rows: 1fr 1fr 15px;
  grid-template-areas:
    'logo menu'
    'main main'
    'copyright submenu';
}

.large-logo-container {
  grid-area: logo;
}

.logo-text {
  font-family: var(--elianto);
  font-size: 28px;
  font-weight: 300;
  text-transform: uppercase;
}

.large {
  font-size: 40px;
  margin-bottom: 0;
}

.subhead {
  font-size: 22px;
  font-family: var(--mukta-malar);
  text-transform: uppercase;
  font-weight: 500;
  line-height: 0.7;
  letter-spacing: 0.15em;
}

a:hover {
  color: var(--light-accent);
}

.submenu {
  grid-area: submenu;
  font-size: 16px;
  list-style: none;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  justify-content: end;
  grid-column-gap: 10px;
}

.copyright {
  grid-area: copyright;
  font-size: 16px;
  align-self: end;
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

.menu {
  grid-area: menu;
  justify-self: start;
}

.right-nav-container {
  grid-area: right;
}

@media (max-width: 825px) {
  .expanded {
    height: 100vh;
  }

  .large,
  .subhead {
    text-align: center;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from '../components/AvIconButton.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';

export default Vue.extend({
  components: {
    AvIconButton
  },
  data() {
    return {
      isNavbarExpanded: false,
      legalName: process.env.VUE_APP_LEGAL_NAME
    };
  },
  computed: {
    ...mapState('base', ['appLogoMin', 'appLogoFull', 'submenu'])
  },
  methods: {
    ...mapMutations('base', ['toggleOverlay']),
    ...mapActions('base', ['getFirestoreData']),
    onIconClick() {
      this.isNavbarExpanded = !this.isNavbarExpanded;
      if (window.innerWidth > 825) {
        this.toggleOverlay();
      }
    }
  },
  async beforeMount() {
    const baseOptions: WorkerFns = { fn: 'getDocuments', collection: 'logos' };
    this.getFirestoreData(baseOptions);
    const submenuOptions: WorkerFns = {
      fn: 'getDocuments',
      collection: 'submenu'
    };
    this.getFirestoreData(submenuOptions);
  }
});
</script>
