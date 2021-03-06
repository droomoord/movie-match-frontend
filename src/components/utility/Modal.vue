<template>
  <div>
    <Backdrop @click.native="$emit('close')"></Backdrop>
    <div class="_modal">
      <b-icon
        @click="$emit('close')"
        ref="x"
        icon="x"
        variant="dark"
        font-scale="2.3"
        class="rounded-circle bg-light p2"
      ></b-icon>
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

<style scoped>
._modal {
  width: 100vw;
  max-height: 80vh;
  left: 0v;
  z-index: 4;
  background-color: white;
  position: fixed;
  padding: 15px;
  animation-name: slide-in-mobile;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  border-radius: 2%;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
._modal::-webkit-scrollbar {
  display: none;
}

svg {
  visibility: hidden;
  position: fixed;
  top: 0;
}

@media only screen and (min-width: 601px) {
  ._modal {
    width: 700px;
    min-height: 200px;
    max-height: 500px;
    padding: 10px;
    padding-left: 30px;
    left: 50vw;
    margin-left: -350px;
    animation-name: slide-in;
    overflow: scroll;
  }
  svg {
    visibility: visible;
    border: 1px solid rgb(186, 186, 186);
    position: sticky;

    left: 100%;
    cursor: pointer;
  }
  svg:hover {
    transform: scale(1.1);
  }
}

@keyframes slide-in {
  from {
    top: 100vh;
    opacity: 0;
  }
  to {
    top: 20vh;
    opacity: 1;
  }
}

@keyframes slide-in-mobile {
  from {
    top: -30vh;
    opacity: 0;
  }
  to {
    top: 58px;
    opacity: 1;
  }
}
</style>
