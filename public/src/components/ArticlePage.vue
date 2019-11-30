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

.html-inject >>> h2,
h2 {
  font-size: 22px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  line-height: 1.2;
  padding-top: 3vh;
}

.html-inject >>> h3,
h3 {
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  padding-top: 3vh;
  line-height: 1.2;
}

.html-inject >>> p,
p,
.html-inject >>> ul,
ul,
.html-inject >>> ol,
ol {
  padding-top: 2vh;
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.6;
}

.html-inject >>> ol,
ol,
.html-inject >>> ul,
ul {
  padding-left: 24px;
}

.html-inject >>> li + p,
li + p {
  padding-top: 0;
}

.html-inject >>> p + li,
p + li {
  padding-top: 16px;
}

.html-inject >>> ul,
ul {
  list-style: disc;
}

.html-inject >>> ol,
ol {
  font-weight: bold;
}

.html-inject >>> strong,
strong {
  font-weight: 600;
}

.html-inject >>> a,
a {
  font-weight: 700;
  color: var(--dark-accent);
}

.html-inject >>> a:focus,
a:focus,
.html-inject >>> a:hover,
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
