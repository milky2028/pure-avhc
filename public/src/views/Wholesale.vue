<template>
  <page-wrapper withPadding>
    <!-- Form Fields
    Billing -->
    <article-page title="Wholesale">
      <p>
        {{ fullName }} provides wholesale purchasing options and pricing to customers seeking to buy hemp and CBD products in large quantities.
        <strong>Wholesale purchasing options are only available to customers making purchases larger than $1,000.</strong>
      </p>
      <p>Account managers are provided to wholesale customers to assist in completing transactions and to ensure that the process goes smoothly. To get started, take a look at our wholesale catalog and fill out the form below.</p>
      <p>
        <a
          v-if="wholesaleCatalog && wholesaleCatalog.length > 0"
          target="_blank"
          rel="noopener noreferrer"
          type="application/pdf"
          :href="wholesaleCatalog[0].url"
        >Wholesale Catalog</a>
      </p>
      <h2 class="last">Wholesale Application</h2>
      <shipping-form includeCompany></shipping-form>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.last {
  margin-bottom: 15px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import ShippingForm from '../components/ShippingForm.vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ShippingForm,
    ArticlePage
  },
  methods: {
    ...mapActions('base', ['getFirestoreData'])
  },
  data() {
    return {
      fullName: process.env.VUE_APP_FULL_NAME
    };
  },
  computed: {
    ...mapState('base', ['wholesaleCatalog'])
  },
  mounted() {
    this.getFirestoreData({
      fn: 'queryDocuments',
      collection: 'wholesaleCatalog',
      limit: 1,
      orderBy: {
        field: 'date',
        direction: 'desc'
      }
    });
  }
});
</script>