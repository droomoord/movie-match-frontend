<template>
  <div>
    <div>
      <b-navbar type="dark" variant="primary" fixed="top">
        <b-navbar-brand href="#/rate">MovieMatcher</b-navbar-brand>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ user.name }}</em>
            </template>
            <b-dropdown-item href="/#/rate"
              ><b-icon icon="heart"></b-icon> Matcher</b-dropdown-item
            >
            <b-dropdown-item href="#/settings"
              ><b-icon icon="gear"></b-icon> Settings</b-dropdown-item
            >
            <b-dropdown-item href="#/friends">
              <b-icon icon="people"></b-icon>
              Friends
            </b-dropdown-item>
            <b-dropdown-item @click="$emit('signout')" href="#">
              <b-icon icon="box-arrow-left"></b-icon>
              Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: ["user"],
};
</script>

<style scoped>
.b-icon {
  position: relative;
  left: -8px;
  top: 2px;
}
</style>
