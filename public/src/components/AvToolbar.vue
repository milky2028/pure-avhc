<template>
  <nav class="nav" :class="isNavbarExpanded ? 'expanded' : ''">
    <transition name="fade">
      <av-icon-button
        class="menu"
        @icon-click="toggleNavAndOverlay"
      >{{ isNavbarExpanded ? 'close' : 'menu' }}</av-icon-button>
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
        <router-link
          @click.native="isNavbarExpanded ? toggleNavAndOverlay() : null"
          to="/cart"
        >shopping_cart</router-link>
      </av-icon-button>
      <av-icon-button>
        <router-link
          @click.native="isNavbarExpanded ? toggleNavAndOverlay() : null"
          to="/orders"
        >person</router-link>
      </av-icon-button>
    </div>
    <div v-if="isNavbarExpanded" class="menu-container">
      <router-link to="/" class="large-logo-container" @click.native="toggleNavAndOverlay">
        <h1 class="logo-text large" v-if="appLogoFull.type === 'text'">{{ appLogoFull.text }}</h1>
        <h2 class="subhead" v-if="appLogoFull.type === 'text'">{{ appLogoFull.subtext }}</h2>
        <img v-if="appLogoFull.type === 'image'" :src="appLogoFull.url" :alt="appLogoFull.alt" />
      </router-link>
      <ul class="product-card-container">
        <li
          id="card"
          v-for="product of products.filter(product => product.featuredInMenu)"
          :key="product.id"
          @click="toggleNavAndOverlay"
        >
          <product-card
            :url="getImageUrl(imageUrl, product.mainImage, 135)"
            :title="product.shortName"
          ></product-card>
        </li>
      </ul>
      <div class="menu-link-container">
        <ul class="menu-links subhead smaller-font top-menu">
          <li
            class="top-menu-links"
            v-for="(menuLink, i) of mainMenu.slice().sort(sortBySortOrder)"
            :key="menuLink.name"
            :style="(windowWidth < 825 && (mainMenu.length - 1) === i) ? { borderBottom: '1px solid white'} : {}"
            @click="toggleNavAndOverlay"
          >
            <router-link :to="menuLink.url">{{ menuLink.name }}</router-link>
            <span v-if="windowWidth > 825 && !(i === (mainMenu.length -1))">&nbsp;/&nbsp;</span>
          </li>
        </ul>
        <ul class="menu-links subhead bottom-menu">
          <li v-for="(menuLink, i) of submenu" :key="menuLink.name" @click="toggleNavAndOverlay">
            <router-link :to="menuLink.url">{{ menuLink.name }}</router-link>
            <span v-if="windowWidth > 825 && !(i === (submenu.length - 1))">&nbsp;/&nbsp;</span>
          </li>
        </ul>
      </div>
      <ul class="submenu">
        <li v-for="menuItem of iconMenu.slice().sort(sortBySortOrder)" :key="menuItem.alt">
          <av-icon-button @icon-click="$emit(menuItem.action)">
            <a
              v-if="menuItem.linkType === 'external'"
              :href="menuItem.url"
              target="_blank"
              rel="noopener noreferrer"
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
            <div v-else>
              <img v-if="menuItem.iconType === 'external'" :src="menuItem.icon" :alt="menuItem.alt" />
              <span
                v-if="menuItem.iconType === 'material'"
                class="icon-link"
                :name="menuItem.alt"
              >{{ menuItem.icon }}</span>
            </div>
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
}

.bottom-menu {
  margin-top: -24px;
  font-size: 16px;
}

.product-card-container {
  align-self: center;
  grid-area: main;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(3, 1fr);
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

.smaller-font {
  font-size: 18px;
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

@media (max-width: 1200px) {
  .top-menu-links {
    font-size: 14px;
  }

  .bottom-menu {
    font-size: 12px;
  }
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
    height: 100vmax;
  }

  .large,
  .subhead {
    text-align: center;
  }

  .menu-links {
    grid-auto-flow: row;
    justify-content: stretch;
  }

  .product-card-container {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
  }

  .menu-link-container {
    justify-content: stretch;
  }

  li {
    text-align: left;
  }

  .top-menu-links {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    border-top: 1px solid white;
    font-size: 18px;
  }

  .bottom-menu {
    justify-content: start;
    margin-top: 0;
    font-size: 16px;
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
import getImageUrl from '../actors/getImageUrl';

export default Vue.extend({
  components: {
    AvIconButton,
    ProductCard
  },
  data() {
    return {
      legalName: process.env.VUE_APP_LEGAL_NAME,
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('base', [
      'appLogoMin',
      'appLogoFull',
      'iconMenu',
      'products',
      'imageUrl',
      'mainMenu',
      'submenu',
      'isNavbarExpanded'
    ])
  },
  methods: {
    ...mapMutations('base', [
      'toggleOverlay',
      'toggleDisclaimer',
      'toggleNavbar'
    ]),
    ...mapActions('base', ['getFirestoreData']),
    getImageUrl,
    sortBySortOrder(a: { sortOrder: number }, b: { sortOrder: number }) {
      const aa = a.sortOrder;
      const bb = b.sortOrder;
      return aa > bb ? 1 : aa < bb ? -1 : 0;
    },
    toggleNavAndOverlay() {
      this.toggleNavbar();
      this.toggleOverlay();
    }
  },
  async beforeMount() {
    this.$on('fda', () => this.toggleDisclaimer());
    const baseOptions: WorkerFns = { fn: 'getDocuments', collection: 'logos' };
    this.getFirestoreData(baseOptions);

    const iconMenuOptions: WorkerFns = {
      fn: 'getDocuments',
      collection: 'iconMenu'
    };
    this.getFirestoreData(iconMenuOptions);

    if (this.products.length < 1) {
      const productsOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'products'
      };
      this.getFirestoreData(productsOptions);
    }

    const menuOptions: WorkerFns = {
      fn: 'getDocuments',
      collection: 'mainMenu'
    };
    this.getFirestoreData(menuOptions);

    const submenuOptions: WorkerFns = {
      fn: 'getDocuments',
      collection: 'submenu'
    };
    this.getFirestoreData(submenuOptions);

    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>
