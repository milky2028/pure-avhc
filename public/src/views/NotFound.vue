<template>
  <PageWrapper with-padding>
    <ArticlePage title="404 Error">
      <h2>Page Not Found</h2>
      <img
        src="http://giphygifs.s3.amazonaws.com/media/4qANoeI3g45a0/giphy.gif"
        alt="Wile Coyote with a Wheel Helmet on"
      />
      <p>
        Looks like we couldn't find the page you were looking for. It might be
        hiding somewhere, but also, maybe not.
      </p>
      <p>
        <router-link to="/">
          Navigate Home
        </router-link>
      </p>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
img {
  margin-top: 16px;
  width: 100%;
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>
