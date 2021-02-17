<template>
  <div>
    <Backdrop @click.native="$emit('close')"></Backdrop>>
    <div class="_modal">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Backdrop from "./Backdrop";
export default {
  name: "Modal",
  components: { Backdrop },
};
</script>

<style>
._modal {
  width: 50vw;
  height: 50vh;
  /* top: 20vh; */
  left: 50vw;
  margin-left: -25%;
  z-index: 4;
  background-color: white;
  position: fixed;
  padding: 10px;
  animation-name: slide-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  border-radius: 2%;
}

@keyframes slide-in {
  from {
    top: 100vh;
  }
  to {
    top: 20vh;
  }
}
</style>
