<template>
  <div>
    <h3
      v-if="address.isBilling"
      class="subhead"
      :class="{ mt: address.isBilling }"
    >
      {{ address.isBilling ? 'Billing' : '' }}
    </h3>
    <p class="body-text">{{ address.name }}</p>
    <p class="body-text">
      {{ `${address.address1}${address.address2 ? ',' : ''}` }}
      {{ address.address2 }}
    </p>
    <p class="body-text">
      {{ `${address.city}${address.city ? ',' : ''}` }}
      <span>{{ address.state }}</span>
      <span>&nbsp;{{ address.zipCode }}</span>
    </p>
    <p class="body-text">{{ address.country }}</p>
  </div>
</template>

<style scoped>
h3 {
  font-size: 20px;
  padding: 1rem 0;
}

p {
  line-height: 1.1;
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Address from '../types/Address';

interface Props {
  address: Address;
}

export default defineComponent<Props>({
  props: {
    address: Object
  }
});
</script>
