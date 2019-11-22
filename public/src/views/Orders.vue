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
import { createComponent, inject } from '@vue/composition-api';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { IUser } from '../use/user';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvButton
  },
  setup() {
    const { windowWidth } = useWindowWidth();
    const { signOut } = inject(Modules.user) as IUser;
    return {
      windowWidth,
      signOut
    };
  }
});
</script>
