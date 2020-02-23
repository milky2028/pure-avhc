<template>
  <form>
    <h2 v-if="showHeader" class="subhead">
      {{ isBilling ? 'Billing' : 'Shipping' }}
    </h2>
    <av-input
      dark
      more-padding
      placeholder="Name/Company"
      type="text"
      autocomplete="name"
      :value="name"
      @on-input="
        name = $event;
        updateForm();
      "
    />
    <av-input
      dark
      more-padding
      placeholder="Street Address"
      type="text"
      autocomplete="address-line1"
      :value="address1"
      @on-input="
        address1 = $event;
        updateForm();
      "
    />
    <av-input
      dark
      more-padding
      placeholder="Apt/Unit/Suite/Other"
      type="text"
      autocomplete="address-line2"
      :value="address2"
      @on-input="
        address2 = $event;
        updateForm();
      "
    />
    <div class="address-container">
      <av-input
        dark
        more-padding
        class="city"
        placeholder="City/Town"
        type="text"
        autocomplete="address-level2"
        :value="city"
        @on-input="
          city = $event;
          updateForm();
        "
      />
      <av-input
        dark
        more-padding
        class="state"
        placeholder="State/Province"
        type="text"
        autocomplete="address-level1"
        :datalist="states"
        :value="state"
        @on-input="
          state = $event;
          updateForm();
        "
      />
      <av-input
        dark
        more-padding
        class="zip"
        placeholder="Zip Code"
        type="number"
        pattern="\d*"
        autocomplete="postal-code"
        :value="zipCode"
        @on-input="
          zipCode = $event;
          updateForm();
        "
      />
    </div>
    <av-input
      dark
      more-padding
      placeholder="Country"
      type="text"
      autocomplete="country"
      :value="country"
      @enter="$emit('last-field-enter')"
      @on-input="
        country = $event;
        updateForm();
      "
    />
    <av-errors :error-instance="errorInstance" />
  </form>
</template>

<style scoped>
h2 {
  font-size: 20px;
  padding: 1rem 0;
}

form {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1vmax;
}

.address-container {
  display: grid;
  grid-template-columns: 1fr 150px 165px;
  grid-gap: 1vmax;
}

@media (max-width: 835px) {
  .city {
    grid-area: city;
  }

  .zip {
    grid-area: zip;
  }

  .state {
    grid-area: state;
  }

  .address-container {
    grid-template-areas:
      'city city'
      'state zip';
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }
}
</style>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed
} from '@vue/composition-api';
import StateTaxes from '../data/StateTaxes';
import AvInput from './AvInput.vue';
import Address from '../types/Address';
import uncamelize from '../functions/uncamelize';
import { IFormErrors } from '../use/form-errors';
import AvErrors from './AvErrors.vue';

interface Props {
  form: Address;
  showHeader: boolean;
  errorInstance: IFormErrors;
}

export default defineComponent<Props>({
  components: {
    AvInput,
    AvErrors
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    errorInstance: {
      type: Object,
      default: null
    }
  },
  setup(props: Props, ctx) {
    const formInput = computed(() => props.form);
    const formState = reactive({
      states: StateTaxes.map((st) => st.abbr),
      name: '',
      address1: '',
      isBilling: false,
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      ...formInput.value
    });

    const unrequiredFields = ['address2', 'country'];
    function evaluateErrors() {
      const fieldErrors = Object.entries(formState)
        .filter(
          ([key, value]) =>
            !unrequiredFields.includes(key) &&
            !value &&
            !/uid|isBilling|enabled/i.test(key)
        )
        .map(([key]) => key);
      props.errorInstance.errors.value = [
        'The following fields are required:',
        ...fieldErrors
      ].map((e) => uncamelize(e));
    }

    evaluateErrors();
    function updateForm() {
      ctx.emit('form-input', formState);
      evaluateErrors();
    }

    return { ...toRefs(formState), updateForm };
  }
});
</script>
