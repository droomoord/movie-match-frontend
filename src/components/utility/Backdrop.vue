<template>
  <div class="backdrop"></div>
</template>

<script>
export default {
  name: "Backdrop",
};
</script>

<style>
.backdrop {
  z-index: 2;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  opacity: 0;
  animation-duration: 0.5s;
  animation-name: fade-in;
  animation-fill-mode: forwards;
  cursor: pointer;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.8;
  }
}
</style>
