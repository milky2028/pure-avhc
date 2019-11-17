<template>
  <div>
    <h1 class="subhead">
      <slot />
    </h1>
    <Divider />
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
  padding-bottom: 1.5vh;
  padding-right: 4vw;
  font-weight: 600;
  line-height: 1.2;
}
</style>

<script lang="ts">
import Divider from './Divider.vue';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  components: {
    Divider
  }
});
</script>
