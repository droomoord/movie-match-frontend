<template>
  <div>
    <div>
      <b-navbar type="dark" variant="primary" fixed="top">
        <b-navbar-brand href="#/rate">MovieMatch</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ user.name }}</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#/friends">
              Friends
              <!-- <div><router-link to="/friends">Friends </router-link></div> -->
            </b-dropdown-item>
            <b-dropdown-item @click="$emit('signout')" href="#"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <!-- <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>MovieMatch</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ user.name }}</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item>
              <router-link to="/friends">Friends </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="$emit('signout')" href="#"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar> -->
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: ["user"],
};
</script>

<style></style>
