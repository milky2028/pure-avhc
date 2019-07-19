<template>
  <page-wrapper>
    <div class="home">
      <div class="main">Some stuff</div>
      <div class="side1"></div>
      <div class="side2"></div>
    </div>
  </page-wrapper>
</template>

<style scoped>
.home {
  height: calc(100vh - 55px);
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    'main side1'
    'main side2';
}

.main {
  grid-area: main;
  background-color: purple;
}

.side1 {
  background-color: blue;
}

.side2 {
  background-color: blueviolet;
}

@media (max-width: 825px) {
  .home {
    height: calc(200vh - 55px);
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr 1fr;
    grid-template-areas:
      'main'
      'side1'
      'side2';
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';

export default Vue.extend({
  components: {
    PageWrapper
  }
});
</script>
