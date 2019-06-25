<template>
  <nav class="nav" :class="isNavbarExpanded ? 'expanded' : ''">
    <av-icon-button
      @icon-click="isNavbarExpanded = !isNavbarExpanded"
    >{{ isNavbarExpanded ? 'close' : 'menu' }}</av-icon-button>
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
  grid-template-columns: 24px 1fr 24px;
  grid-template-areas: 'menu logo right';
  align-items: center;
}

.expanded {
  height: 35vh;
  grid-template-rows: 39px 1fr;
}

.right-nav-container {
  grid-area: right;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from '../components/AvIconButton.vue';

export default Vue.extend({
  components: {
    AvIconButton
  },
  data() {
    return {
      isNavbarExpanded: false
    };
  }
});
</script>

