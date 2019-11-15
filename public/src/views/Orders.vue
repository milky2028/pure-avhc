<template>
  <PageWrapper with-padding>
    <ArticlePage title="Orders">
      <p>Orders page</p>
      <AvButton
        :full-width="windowWidth < 835"
        :long="windowWidth > 835"
        @btn-click="signOut"
      >
        Sign Out
      </AvButton>
    </ArticlePage>
  </PageWrapper>
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