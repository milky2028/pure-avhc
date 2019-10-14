<template>
  <page-wrapper withPadding>
    <article-page title="Orders">
      <p>Orders page</p>
      <av-button
        :fullWidth="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="signOut"
      >Sign Out</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
p {
  margin-bottom: 16px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvButton from '../components/AvButton.vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    AvButton
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  methods: {
    ...mapActions('user', ['signOut'])
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>