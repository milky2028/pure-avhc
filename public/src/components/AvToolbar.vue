<template>
  <nav class="nav" :class="{ expanded: isNavbarExpanded }">
    <transition name="fade">
      <AvIconButton class="menu" @icon-click="toggleNavAndOverlay">
        {{ isNavbarExpanded ? 'close' : 'menu' }}
      </AvIconButton>
    </transition>
    <router-link class="logo-link" to="/">
      <transition name="fade">
        <h1
          v-if="logoMin.content && logoMin.type === 'text' && !isNavbarExpanded"
          class="logo-text"
        >
          <abbr :title="legalName">{{ logoMin.content }}</abbr>
        </h1>
        <img
          v-if="logoMin.content && logoMin.type === 'image'"
          loading="lazy"
          :src="logoMin.content"
          :alt="`${legalName} Company Logo`"
        />
      </transition>
    </router-link>
    <div class="right-nav-container">
      <router-link
        class="cart-button"
        to="/cart"
        @click.native="isNavbarExpanded ? toggleNavAndOverlay() : null"
      >
        <AvIconButton class="cart-icon">
          shopping_cart
        </AvIconButton>
        <AvBadge class="badge" />
      </router-link>
      <AvIconButton>
        <router-link
          :to="isAdmin ? '/admin' : '/orders'"
          @click.native="isNavbarExpanded ? toggleNavAndOverlay() : null"
        >
          <img
            v-if="photoURL"
            loading="lazy"
            class="profile-picture"
            :src="photoURL"
            alt="User profile picture"
          />
          <span v-else>person</span>
        </router-link>
      </AvIconButton>
    </div>
    <div v-if="isNavbarExpanded" class="menu-container">
      <router-link
        to="/"
        class="large-logo-container"
        @click.native="toggleNavAndOverlay"
      >
        <h1 v-if="logoFull.type === 'text'" class="logo-text large">
          {{ logoFull.content }}
        </h1>
        <h2 v-if="logoFull.type === 'text'" class="subhead">
          {{ logoFull.sub }}
        </h2>
        <img
          v-if="logoFull.type === 'image'"
          loading="lazy"
          :src="logoFull.content"
          :alt="`${legalName} Full Company Logo`"
        />
      </router-link>
      <ul class="product-card-container">
        <li
          v-for="product of products.filter(
            (product) => product.featuredInMenu
          )"
          id="card"
          :key="product.id"
          @click="toggleNavAndOverlay"
        >
          <ProductCard :product="product" />
        </li>
      </ul>
      <div class="menu-link-container">
        <ul class="menu-links subhead smaller-font top-menu">
          <li
            v-for="(menuLink, i) of mainMenu.slice().sort(sortBySortOrder)"
            :key="menuLink.name"
            class="top-menu-links"
            :style="
              windowWidth < 835 && mainMenu.length - 1 === i
                ? { borderBottom: '1px solid white' }
                : {}
            "
            @click="toggleNavAndOverlay"
          >
            <router-link :to="menuLink.url">
              {{ menuLink.name }}
            </router-link>
            <span
              v-if="windowWidth > 835 && i !== mainMenu.length - 1"
              class="slash"
              >/</span
            >
          </li>
        </ul>
        <ul class="menu-links subhead bottom-menu">
          <li
            v-for="(menuLink, i) of submenu"
            :key="menuLink.name"
            @click="toggleNavAndOverlay"
          >
            <router-link :to="menuLink.url">
              {{ menuLink.name }}
            </router-link>
            <span
              v-if="windowWidth > 835 && i !== submenu.length - 1"
              class="slash"
              >/</span
            >
          </li>
        </ul>
      </div>
      <ul class="submenu">
        <li
          v-for="menuItem of iconMenu.slice().sort(sortBySortOrder)"
          :key="menuItem.alt"
        >
          <AvIconButton @icon-click="$emit(menuItem.action)">
            <a
              v-if="menuItem.linkType === 'external'"
              :href="menuItem.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                v-if="menuItem.iconType === 'external'"
                loading="lazy"
                class="icon-link"
                :src="require(`../assets/img/${menuItem.icon}`)"
                :alt="menuItem.alt"
              />
              <span
                v-if="menuItem.iconType === 'material'"
                class="icon-link"
                :name="menuItem.alt"
                >{{ menuItem.icon }}</span
              >
            </a>
            <div v-else>
              <img
                v-if="menuItem.iconType === 'external'"
                loading="lazy"
                :src="menuItem.icon"
                :alt="menuItem.alt"
              />
              <span
                v-if="menuItem.iconType === 'material'"
                class="icon-link"
                :name="menuItem.alt"
                >{{ menuItem.icon }}</span
              >
            </div>
          </AvIconButton>
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
  background-color: var(--navy);
  box-shadow: var(--basic-shadow);
  display: grid;
  grid-template-rows: 39px 1fr;
  grid-template-columns: 56px 1fr 56px;
  grid-template-areas: 'menu logo right';
  align-items: center;
  transition: all 200ms var(--mat-ease);
  overflow: hidden;
}

.right-nav-container {
  display: flex;
  justify-content: space-between;
  grid-area: right;
}

.cart-button {
  display: grid;
  grid-template-areas: 'main';
}

.profile-picture {
  height: 25px;
  border-radius: 50%;
  border: 1px solid white;
}

.badge {
  grid-area: main;
}

.cart-icon {
  grid-area: main;
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

.slash {
  margin: 0 1ch;
}

.bottom-menu {
  margin-top: -24px;
  font-size: 14px;
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

@media (max-width: 1200px) {
  .top-menu-links {
    font-size: 14px;
  }

  .bottom-menu {
    font-size: 12px;
  }
}

@media (max-width: 835px) {
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
    font-size: 14px;
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
import AvIconButton from './AvIconButton.vue';
import ProductCard from './ProductCard.vue';
import AvBadge from './AvBadge.vue';
import { defineComponent, inject } from '@vue/composition-api';
import { MenuItem } from '../types/MenuItem';
import { Modules } from '../use/store';
import { useWindowWidth } from '../use/window-width';
import { INavbar } from '../use/navbar';
import { IOverlay } from '../use/overlay';
import { IUser } from '../use/user';
import { IProducts } from '../use/products';

interface LogoMin {
  type: 'text' | 'image';
  content: string;
}

interface LogoFull {
  type: 'text' | 'image';
  content: string;
  sub?: string;
}

export default defineComponent({
  components: {
    AvIconButton,
    ProductCard,
    AvBadge
  },
  setup() {
    const { windowWidth } = useWindowWidth();
    const { photoURL } = inject(Modules.user) as IUser;
    const { products } = inject(Modules.products) as IProducts;

    const logoMin: LogoMin = JSON.parse(process.env.VUE_APP_LOGO_MIN as string);
    const logoFull: LogoFull = JSON.parse(
      process.env.VUE_APP_LOGO_FULL as string
    );
    const legalName = process.env.VUE_APP_LEGAL_NAME;
    const iconMenu = JSON.parse(process.env.VUE_APP_ICON_MENU as string);
    const submenu = JSON.parse(process.env.VUE_APP_SUBMENU as string);
    const mainMenu = JSON.parse(process.env.VUE_APP_MAIN_MENU as string);

    const { toggleOverlay } = inject(Modules.overlay) as IOverlay;
    const { toggleNavbar, isNavbarExpanded } = inject(
      Modules.navbar
    ) as INavbar;

    function toggleNavAndOverlay() {
      toggleNavbar();
      toggleOverlay();
    }

    function sortBySortOrder(a: MenuItem, b: MenuItem) {
      const aa = a.sortOrder;
      const bb = b.sortOrder;
      return aa > bb ? 1 : aa < bb ? -1 : 0;
    }

    const { isAdmin } = inject(Modules.user) as IUser;

    return {
      isAdmin,
      products,
      toggleNavAndOverlay,
      isNavbarExpanded,
      sortBySortOrder,
      photoURL,
      legalName,
      windowWidth,
      mainMenu,
      submenu,
      iconMenu,
      logoMin,
      logoFull
    };
  }
});
</script>
