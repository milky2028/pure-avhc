<template>
  <p
    v-if="
      errorInstance &&
        errorInstance.showErrors.value &&
        errorInstance.errors.value.length > 1
    "
    class="body-text errors"
  >
    <strong>{{ errorInstance.errors.value[0] }}</strong>
    <br />
    <!-- eslint-disable-next-line -->
      <span v-html="errorInstance.errors.value.slice(1).map((e) => uncamelize(e)).join('<br>')"/>
  </p>
</template>

<style scoped>
.errors {
  color: var(--warn);
  font-size: 2rem;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import { IFormErrors } from '../use/form-errors';
import uncamelize from '../functions/uncamelize';

interface Props {
  errorInstance: IFormErrors;
}

export default createComponent<Props>({
  props: {
    errorInstance: Object
  },
  setup() {
    return { uncamelize };
  }
});
</script>
