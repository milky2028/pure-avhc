<template>
  <PageWrapper with-padding>
    <ArticlePage title="Login">
      <Login />
    </ArticlePage>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, inject, watch } from '@vue/composition-api';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import Login from '../components/Login.vue';
import { Modules } from '../use/store';
import { IUser } from '../use/user';

export default defineComponent({
  components: {
    PageWrapper,
    ArticlePage,
    Login
  },
  setup(_, ctx) {
    const { uid, isAdmin } = inject(Modules.user) as IUser;

    watch([uid, isAdmin], () => {
      if (uid.value && isAdmin.value) {
        ctx.root.$router.push('/admin');
      } else if (uid.value) {
        ctx.root.$router.push('/orders');
      }
    });
  }
});
</script>
