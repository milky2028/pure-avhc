<template>
  <div>
    <page-header>{{ title }}</page-header>
    <article>
      <slot></slot>
    </article>
  </div>
</template>

<style scoped>
article {
  max-width: 680px;
  padding-right: 4vw;
}

h2 {
  font-size: 18px;
  font-family: var(--mukta-malar);
  text-transform: uppercase;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.15em;
  padding-top: 1vh;
}

p,
ul {
  padding-top: 1vh;
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.6;
  list-style: disc inside;
}

strong {
  font-weight: 600;
}

a {
  font-weight: 700;
  color: var(--dark-accent);
}

a:hover {
  text-decoration: underline;
}
</style>


<script lang="ts">
import Vue from 'vue';
import PageHeader from '../components/PageHeader.vue';

export default Vue.extend({
  props: {
    title: String
  },
  components: {
    PageHeader
  }
});
</script>

