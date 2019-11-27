<template>
  <form>
    <h2>{{ isBilling ? 'Billing' : 'Shipping' }}</h2>
    <av-input
      dark
      more-padding
      placeholder="Name"
      type="text"
      autocomplete="name"
      :value="name"
      @on-input="
        name = $event;
        updateForm();
      "
    />
    <av-input
      v-if="includeCompany"
      dark
      more-padding
      placeholder="Company"
      type="text"
      :value="company"
      @on-input="
        company = $event;
        updateForm();
      "
    />
    <av-input
      dark
      more-padding
      placeholder="Street Address"
      type="text"
      autocomplete="street-address"
      :value="address"
      @on-input="
        address = $event;
        updateForm();
      "
    />
    <div class="address-container">
      <av-input
        dark
        more-padding
        class="city"
        placeholder="City"
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
        placeholder="State"
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
      @on-input="
        country = $event;
        updateForm();
      "
    />
  </form>
</template>

<style scoped>
h2 {
  font-size: 22px;
  font-family: var(--mukta-malar);
  font-weight: 700;
  line-height: 1.2;
}

form {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1vmax;
}

.address-container {
  display: grid;
  grid-template-columns: 1fr 145px 165px;
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
    grid-template-columns: 2fr 1fr;
  }
}
</style>

<script lang="ts">
import { createComponent, reactive, toRefs } from '@vue/composition-api';
import StateTaxes from '../data/StateTaxes';
import AvInput from './AvInput.vue';

export default createComponent({
  components: {
    AvInput
  },
  props: {
    includeCompany: Boolean,
    isBilling: Boolean
  },
  setup(props, ctx) {
    const state = reactive({
      states: StateTaxes.map((st) => st.abbr),
      name: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });

    function updateForm() {
      const form = {
        isBilling: props.isBilling,
        name: state.name,
        company: state.company,
        address: state.address,
        city: state.city,
        state: state.state,
        zipCode: state.zipCode,
        country: state.country
      };

      ctx.emit('form-input', form);
    }

    return { ...toRefs(state), updateForm };
  }
});
</script>
