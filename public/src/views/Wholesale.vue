<template>
  <page-wrapper withPadding>
    <!-- Form Fields
    Billing
    Shipping
    Contact Email
    Contact Phone Number
    Business Name-->
    <article-page title="Wholesale">
      <shipping-form></shipping-form>
    </article-page>
  </page-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';

export default Vue.extend({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage
  }
});
</script>