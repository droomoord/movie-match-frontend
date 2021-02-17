<template>
  <div>
    <b-jumbotron>
      <h1>The Landing Page</h1>
      <p>Some nice images here...</p>
      <router-link to="/rate">Start</router-link>
    </b-jumbotron>
    <b-container>
      <b-alert fade variant="danger" :show="errorMessage !== ''">
        {{ errorMessage }}
      </b-alert>
      <b-tabs content-class="mt-3">
        <b-tab title="Register" active @click="errorMessage = ''">
          <b-form @submit="submitRegister">
            <b-form-group label="Name">
              <b-form-input
                v-model="register.name"
                type="text"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input
                v-model="register.email"
                type="email"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input
                v-model="register.password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Confirm password">
              <b-form-input
                v-model="register.password2"
                type="password"
                required
              ></b-form-input>
            </b-form-group>
            <b-button type="submit">Submit</b-button>
          </b-form>
        </b-tab>
        <b-tab title="Login" @click="errorMessage = ''">
          <b-form @submit="submitLogin">
            <b-form-group label="Email">
              <b-form-input
                v-model="login.email"
                type="email"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input
                v-model="login.password"
                type="password"
                required
              ></b-form-input>
            </b-form-group>
            <b-button type="submit">Submit</b-button>
          </b-form>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import fetchServerData from "../functions/fetchServerData";

export default {
  name: "Landing",
  data() {
    return {
      register: {
        name: "",
        email: "",
        password: "",
        password2: "",
      },
      login: {
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  props: ["user"],
  mounted() {
    if (this.user.id) {
      this.$router.push("/rate");
    }
  },
  methods: {
    submitRegister: async function() {
      try {
        if (this.register.password !== this.register.password2) {
          this.displayError("Passwords don't match!");
        } else {
          const { name, password } = this.register;
          const email = this.register.email.toLowerCase();
          const data = {
            name,
            email,
            password,
          };
          const api = await fetchServerData("post", "/auth/register", data);
          localStorage.setItem("user-token", api.data.tokens.access.token);
          this.$emit("login", api.data.user);
        }
      } catch (error) {
        console.log(error.response.data);
        this.displayError(error.response.data.message);
      }
    },
    submitLogin: async function() {
      const { password } = this.login;
      const email = this.login.email.toLowerCase();
      const data = {
        email,
        password,
      };
      try {
        const api = await fetchServerData("post", "/auth/login", data);
        localStorage.setItem("user-token", api.data.tokens.access.token);
        this.$emit("login", api.data.user);
      } catch (error) {
        this.displayError(error.response.data.message);
      }
    },
    displayError: function(message) {
      this.errorMessage = "";
      setTimeout(() => {
        this.errorMessage = message;
      }, 200);
    },
  },
};
</script>

<style>
h3 {
  text-align: center;
}
.container {
  max-width: 600px !important;
}
.tab-content {
  border: 1px solid #dee2e6;
  border-top: none;
  padding: 20px;
  position: relative;
  top: -17px;
}
</style>
