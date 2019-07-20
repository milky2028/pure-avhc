<template>
  <div>
    <page-header>{{ title }}</page-header>
    <article>
      <slot></slot>
    </article>
  </div>
</template>

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

