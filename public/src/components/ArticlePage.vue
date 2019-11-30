<template>
  <div>
    <page-header>{{ title }}</page-header>
    <article>
      <slot />
    </article>
  </div>
</template>

<style scoped>
article {
  max-width: 680px;
  padding-right: 4vw;
}

div >>> h2,
h2 {
  font-size: 22px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  line-height: 1.2;
  padding-top: 3vh;
}

div >>> h3,
h3 {
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  padding-top: 3vh;
  line-height: 1.2;
}

div >>> p,
p,
div >>> ul,
ul,
div >>> ol,
ol {
  padding-top: 2vh;
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.6;
}

div >>> ol,
ol,
div >>> ul,
ul {
  padding-left: 24px;
}

div >>> li + p,
li + p {
  padding-top: 0;
}

div >>> p + li,
p + li {
  padding-top: 16px;
}

div >>> ul,
ul {
  list-style: disc;
}

div >>> ol,
ol {
  font-weight: bold;
}

div >>> strong,
strong {
  font-weight: 600;
}

div >>> a,
a {
  font-weight: 700;
  color: var(--dark-accent);
}

div >>> a:focus,
a:focus,
div >>> a:hover,
a:hover {
  text-decoration: underline;
}
</style>

<script lang="ts">
import PageHeader from './PageHeader.vue';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  props: {
    title: String
  },
  components: {
    PageHeader
  }
});
</script>
