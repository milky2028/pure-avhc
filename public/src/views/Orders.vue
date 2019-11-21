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
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvButton from '../components/AvButton.vue';
import { createComponent } from '@vue/composition-api';
import useWindowWidth from '../use/window-width';
import useUser from '../use/user';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvButton
  },
  setup() {
    const { windowWidth } = useWindowWidth();
    const { signOut } = useUser();
    return {
      windowWidth,
      signOut
    };
  }
});
</script>
