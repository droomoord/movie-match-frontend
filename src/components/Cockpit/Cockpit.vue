<template>
  <div v-if="userIsLoggedIn" class="cockpit">
    <Navbar :user="user" @signout="$emit('signout')" />
    <Matcher
      :user="user"
      :configuration="configuration"
      @setCachedMovie="setCachedMovie"
      :cachedMovie="cachedMovie"
      :genres="genres"
    />
  </div>
</template>

<script>
import Navbar from "./Navbar/Navbar";
import Matcher from "./Matcher/Matcher";
export default {
  name: "Cockpit",
  components: { Navbar, Matcher },
  props: ["user", "configuration", "cachedMovie", "genres"],
  mounted() {
    if (!this.userIsLoggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    setCachedMovie: function(movie) {
      this.$emit("setCachedMovie", movie);
    },
  },
  computed: {
    userIsLoggedIn: function() {
      return Object.keys(this.user).length !== 0;
    },
  },
};
</script>

<style>
.cockpit {
  min-height: -webkit-fill-available;
}

@media only screen and (min-width: 601px) {
  .cockpit {
    width: 100vw;
    background-color: var(--backgroundColor);
  }
}
</style>
