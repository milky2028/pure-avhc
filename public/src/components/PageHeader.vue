<template>
  <div>
    <h1 class="subhead">
      <slot></slot>
    </h1>
    <div class="divider"></div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 28px;
  padding-bottom: 1.5vh;
  padding-right: 4vw;
  font-weight: 600;
  line-height: 1.2;
}

.divider {
  background-color: black;
  height: 2px;
  margin-bottom: 1vh;
}
</style>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

