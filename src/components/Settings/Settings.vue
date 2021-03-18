<template>
  <div class="settings">
    <Navbar :user="user" @signout="$emit('signout')" />
    <b-container>
      <b-form>
        <label for="name"></label>
        <b-input-group prepend="Name:">
          <b-form-input id="name" v-model="user.name"></b-form-input>
        </b-input-group>
      </b-form>
      <label for="email"></label>
      <b-input-group prepend="Email:">
        <b-form-input
          id="email"
          :placeholder="user.email"
          disabled
        ></b-form-input>
      </b-input-group>
      <label for="rating"></label>
      <b-input-group>
        <b-form-input
          id="rating"
          v-model="rating"
          type="range"
          min="0.1"
          max="7.5"
          step="0.1"
        ></b-form-input>
        <div class="mt-2">Minimal IMDB rating: {{ rating }}</div>
      </b-input-group>
      <label for="date-min"></label>
      <b-input-group>
        <span>Min:</span>
        <b-form-input id="date-min" type="date"> </b-form-input>
      </b-input-group>
      <label for="date-max"></label>
      <b-input-group>
        <span>Max:</span>
        <b-form-input id="date-max" type="date"> </b-form-input>
      </b-input-group>
    </b-container>
  </div>
</template>

<script>
import Navbar from "../Cockpit/Navbar/Navbar";
export default {
  name: "settings",
  components: { Navbar },
  props: ["user"],
  data() {
    return {
      rating: 7,
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 100px;
}
</style>
