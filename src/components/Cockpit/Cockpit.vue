<template>
  <div v-if="userIsLoggedIn" class="cockpit">
    <Navbar :user="user" @signout="$emit('signout')" />
    <Matcher :user="user" :configuration="configuration" />
  </div>
</template>

<script>
import Navbar from "./Navbar/Navbar";
import Matcher from "./Matcher/Matcher";
export default {
  name: "Cockpit",
  components: { Navbar, Matcher },
  props: ["user", "configuration"],
  mounted() {
    if (!this.userIsLoggedIn) {
      this.$router.push("/");
    }
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
  background-color: rgb(191, 191, 191);
  width: 100vw;
  height: 100vh;
}
</style>
