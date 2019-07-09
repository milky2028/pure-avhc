<template>
  <div
    class="card"
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

.card:hover {
  animation: bubble 350ms forwards var(--mat-enter);
}

.hover-leave {
  animation: shrink 150ms var(--mat-leave);
}

@keyframes bubble {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1.05);
  }
}

@keyframes shrink {
  from {
    transform: scale(1.08);
  }
  to {
    transform: scale(1);
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      hoverLeave: false
    };
  }
});
</script>
