<template>
  <div>
    <h1 class="subhead">
      <slot></slot>
    </h1>
    <divider></divider>
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
import Vue from 'vue';
import Divider from './Divider.vue';

export default Vue.extend({
  components: {
    Divider
  }
});
</script>

