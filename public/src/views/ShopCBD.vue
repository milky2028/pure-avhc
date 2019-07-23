<template>
  <page-wrapper withPadding>
    <page-header>All Products</page-header>
  </page-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import PageHeader from '../components/PageHeader.vue';

export default Vue.extend({
  components: {
    PageHeader,
    PageWrapper
  }
});
</script>
