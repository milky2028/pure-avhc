<template>
  <div class="home">
    <p>Blank app</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  created() {
    // this is the new, non-class method syntax as the class API
    // has been deprecated and will not appear in Vue 3
    console.log('created');
  }
});
</script>
