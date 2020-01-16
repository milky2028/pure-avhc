<template>
  <div class="container"><Loader /></div>
</template>

<style scoped>
.container {
  height: calc(100vh - 55px);
  display: grid;
  align-items: center;
  justify-items: center;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import Loader from '../components/Loader.vue';

export default createComponent({
  components: {
    Loader
  }
});
</script>
