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
}

img {
  margin-top: 1rem;
  width: 100%;
  object-fit: cover;
  border-radius: var(--rounded-corner);
}

.article-inject >>> h2,
h2 {
  font-size: 22px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  line-height: 1.2;
  padding-top: 3vh;
}

h2:first-child {
  padding-top: 1rem;
}

.article-inject >>> h3,
h3 {
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  padding-top: 3vh;
  line-height: 1.2;
}

.article-inject >>> p,
p,
.article-inject >>> ul,
ul,
.article-inject >>> ol,
ol {
  padding-top: 2vh;
  font-size: 18px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.6;
}

.article-inject >>> ol,
ol,
.article-inject >>> ul,
ul {
  padding-left: 24px;
}

.article-inject >>> li + p,
li + p {
  padding-top: 0;
}

.article-inject >>> p + li,
p + li {
  padding-top: 16px;
}

.article-inject >>> ul,
ul {
  list-style: disc;
}

.article-inject >>> ol,
ol {
  font-weight: bold;
}

.article-inject >>> strong,
strong {
  font-weight: 600;
}

.article-inject >>> a,
a {
  font-weight: 700;
  color: var(--dark-accent);
}

.article-inject >>> a:focus,
a:focus,
.article-inject >>> a:hover,
a:hover {
  text-decoration: underline;
}

@media (max-width: 835px) {
  article {
    padding-right: 4vw;
  }
}
</style>

<script lang="ts">
import PageHeader from './PageHeader.vue';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    title: String
  },
  components: {
    PageHeader
  }
});
</script>
