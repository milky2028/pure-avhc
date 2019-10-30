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
  font-size: 22px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  line-height: 1.2;
  padding-top: 3vh;
}

h3 {
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  padding-top: 3vh;
  line-height: 1.2;
}

p,
ul,
ol {
  padding-top: 2vh;
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.6;
}

ol,
ul {
  padding-left: 24px;
}

li + p {
  padding-top: 0;
}

p + li {
  padding-top: 16px;
}

ul {
  list-style: disc;
}

ol {
  font-weight: bold;
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
import PageHeader from './PageHeader.vue';

export default Vue.extend({
  props: {
    title: String
  },
  components: {
    PageHeader
  }
});
</script>

