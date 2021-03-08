<template>
  <div>
    <div>
      <b-navbar type="dark" variant="primary" fixed="top">
        <b-navbar-brand href="#/rate">MovieMatch</b-navbar-brand>
        <tmdbLogo> </tmdbLogo>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ user.name }}</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#/friends">
              Friends
            </b-dropdown-item>
            <b-dropdown-item @click="$emit('signout')" href="#"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import tmdbLogo from "../../utility/tmdb-logo-small";
export default {
  name: "Navbar",
  props: ["user"],
  components: {
    tmdbLogo,
  },
};
</script>

<style></style>
