<template>
  <b-spinner label="Spinning"></b-spinner>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style>
.spinner-border {
  position: absolute;
  top: 50vh;
  left: 50vw;
  z-index: 1;
  width: 70px;
  height: 70px;
}
</style>
