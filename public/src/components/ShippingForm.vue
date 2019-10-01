<template>
  <form>
    <av-input
      required
      dark
      type="email"
      autocomplete="email"
      placeholder="Email"
      :pattern="emailPattern"
      @on-input="email = $event"
      :value="email"
    ></av-input>
    <av-input
      required
      dark
      placeholder="Name"
      type="text"
      autocomplete="name"
      :value="name"
      @on-input="name = $event"
    ></av-input>
    <av-input
      required
      dark
      placeholder="Phone"
      type="tel"
      autocomplete="tel"
      :value="phoneNumber"
      @on-input="phoneNumber = $event"
    ></av-input>
    <av-input
      v-if="includeCompany"
      dark
      placeholder="Company"
      type="text"
      :value="company"
      @on-input="company = $event"
    ></av-input>
    <av-input
      required
      dark
      placeholder="Street Address"
      type="text"
      autocomplete="street-address"
      :value="address"
      @on-input="address = $event"
    ></av-input>
    <av-input
      required
      dark
      placeholder="City"
      type="text"
      autocomplete="address-level2"
      :value="city"
      @on-input="city = $event"
    ></av-input>
    <av-input
      required
      dark
      placeholder="Zip Code"
      type="number"
      pattern="\d*"
      autocomplete="postal-code"
      :value="zipCode"
      @on-input="zipCode = $event"
    ></av-input>
    <av-input
      required
      dark
      placeholder="Country"
      type="text"
      autocomplete="country"
      :value="country"
      @on-input="country = $event"
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
      emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      email: '',
      name: '',
      company: '',
      phoneNumber: '',
      address: '',
      city: '',
      zipCode: '',
      country: ''
    };
  }
});
</script>