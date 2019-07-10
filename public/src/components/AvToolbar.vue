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
        <img v-if="appLogoMin.type === 'image'" :src="appLogoMin.url" :alt="appLogoMin.alt" />
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
      <router-link to="/" class="large-logo-container">
        <h1 class="logo-text large" v-if="appLogoFull.type === 'text'">{{ appLogoFull.text }}</h1>
        <h2 class="subhead" v-if="appLogoFull.type === 'text'">{{ appLogoFull.subtext }}</h2>
        <img v-if="appLogoFull.type === 'image'" :src="appLogoFull.url" :alt="appLogoFull.alt" />
      </router-link>
      <div class="menu-link-container">
        <ul class="menu-links">
          <li class="subhead" v-for="menuLink of [1, 2, 3]">
            <router-link to="/">Definitive CBD Guide</router-link>
          </li>
        </ul>
        <ul class="menu-links">
          <li class="subhead" v-for="menuLink of [1, 2, 3]">
            <router-link to="/">Products</router-link>
          </li>
        </ul>
      </div>
      <ul class="product-card-container">
        <li v-for="card of [1, 2, 3]">
          <product-card>
            CBD
            <br />Flower
          </product-card>
        </li>
      </ul>
      <ul class="submenu">
        <li v-for="menuItem of submenu.slice().sort(sortBySortOrder)" :key="menuItem.alt">
          <av-icon-button @icon-click="emit(menuItem.action)">
            <a
              v-if="menuItem.linkType === 'external'"
              :href="menuItem.url"
              target="_blank"
              rel="noopener"
            >
              <img
                class="icon-link"
                v-if="menuItem.iconType === 'external'"
                :src="menuItem.icon"
                :alt="menuItem.alt"
              />
              <span
                v-if="menuItem.iconType === 'material'"
                class="icon-link"
                :name="menuItem.alt"
              >{{ menuItem.icon }}</span>
            </a>
            <router-link v-else :to="menuItem.icon">
              <img v-if="menuItem.iconType === 'external'" :src="menuItem.icon" :alt="menuItem.alt" />
              <span
                v-if="menuItem.iconType === 'material'"
                class="icon-link"
                :name="menuItem.alt"
              >{{ menuItem.icon }}</span>
            </router-link>
          </av-icon-button>
        </li>
      </ul>
      <h3 class="subhead copyright">© {{ legalName }} 2019</h3>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  z-index: 20;
  padding: 8px 16px 12px 16px;
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
  height: 100%;
  grid-area: expanded;
  display: grid;
  grid-template-rows: 75px 1fr 21px;
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

a:hover {
  color: var(--light-accent);
}

.menu-link-container {
  display: grid;
  justify-content: end;
}

.menu-links {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: end;
  grid-gap: 1vw;
}

.product-card-container {
  align-self: center;
  grid-area: main;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 4vw;
}

.submenu {
  grid-area: submenu;
  font-size: 16px;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  justify-content: end;
  grid-column-gap: 16px;
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

.icon-link {
  width: 16px;
  font-size: 18px;
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
  .menu-container {
    grid-template-rows: 75px 3fr 2fr 32px 32px;
    grid-template-areas:
      'logo'
      'main'
      'menu'
      'submenu'
      'copyright';
  }

  .expanded {
    height: 100vh;
  }

  .large,
  .subhead {
    text-align: center;
  }

  .product-card-container {
    grid-auto-flow: row;
  }

  .submenu {
    justify-content: space-around;
  }

  .icon-link {
    width: 20px;
    font-size: 22px;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from '../components/AvIconButton.vue';
import ProductCard from '../components/ProductCard.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import { SubmenuItem } from '../types/MenuItem';

export default Vue.extend({
  components: {
    AvIconButton,
    ProductCard
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
    },
    sortBySortOrder(a: SubmenuItem, b: SubmenuItem) {
      const aa = a.sortOrder;
      const bb = b.sortOrder;
      return aa > bb ? 1 : aa < bb ? -1 : 0;
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
