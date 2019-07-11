<template>
  <router-link to="/">
    <div
      class="card"
      :style="{ backgroundImage: `url(${url})` }"
      :class="hoverLeave ? 'hover-leave' : ''"
      @mouseleave="hoverLeave = true"
      @mouseenter="hoverLeave = false"
    >
      <div class="cover">
        <h2 class="subhead card-font">
          <slot></slot>
        </h2>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
div {
  border-radius: var(--rounded-corner);
}

.card {
  background-color: #fef8f8;
  background-image: url('https://storage.googleapis.com/pure-243401.appspot.com/1/2018/08/Cigs.jpg');
  background-position: 103% 50%;
  background-size: contain;
  background-repeat: no-repeat;
  height: 15vh;
  width: 100%;
  cursor: pointer;
  box-shadow: var(--basic-shadow);
}

.cover {
  padding: 16px;
  display: grid;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--dark-accent);
  clip-path: polygon(45% -2%, 75% 102%, -2% 102%, -2% -2%);
}

.card-font {
  font-size: 26px;
  line-height: 1;
}

a:hover {
  color: white !important;
}

@media (max-width: 825px) {
  .card {
    height: 12vh;
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    url: String
  },
  data() {
    return {
      hoverLeave: false
    };
  }
});
</script>
