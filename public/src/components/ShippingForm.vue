<template>
  <form>
    <av-input required dark placeholder="Name" :value="name" @on-input="name = $event"></av-input>
    <av-input
      v-if="includeCompany"
      required
      dark
      placeholder="Company"
      :value="company"
      @on-input="company = $event"
    ></av-input>
  </form>
</template>

<style scoped>
form {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1vmax;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvInput from './AvInput.vue';

export default Vue.extend({
  components: {
    AvInput
  },
  props: {
    includeCompany: Boolean
  },
  data() {
    return {
      name: '',
      company: ''
    };
  }
});
</script>