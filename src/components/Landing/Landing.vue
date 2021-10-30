<template>
  <div class="landing">
    <div alt="" class="background-image popcorn">
      <div class="logo-container">
        <div class="logo-wrapper">
          <img src="@/assets/mm-logo-3.png" alt="" class="mm-logo" />
          <div class="tmdb-logo-wrapper">
            <h3>Powered by:</h3>
            <a href="#"><tmdbLogoBig class="tmdb-logo"></tmdbLogoBig></a>
          </div>
        </div>
      </div>
    </div>
    <div class="background-image watching">
      <!-- <div class="tagline-container">
        <div class="tagline-wrapper">
          <ul>
            <ol>
              Register
            </ol>
            <ol>
              Connect with friends
            </ol>
            <ol>
              Rate a bunch of movies
            </ol>
          </ul>
        </div>
      </div> -->
    </div>

    <div class="form">
      <b-tabs content-class="mt-3">
        <b-tab title="Register" active @click="errorMessage = ''">
          <b-form @submit="submitRegister" class="register">
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
            <b-alert
              fade
              variant="danger"
              :show="errorMessage !== ''"
              dismissible
            >
              {{ errorMessage }}
            </b-alert>
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
            <b-alert
              fade
              variant="danger"
              :show="errorMessage !== ''"
              dismissible
            >
              {{ errorMessage }}
            </b-alert>
          </b-form>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import fetchServerData from "../functions/fetchServerData";
import tmdbLogoBig from "../utility/tmdb-logo-big";

export default {
  name: "Landing",
  components: {
    tmdbLogoBig,
  },
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
          const nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);

          const email = this.register.email.toLowerCase();
          const data = {
            name: nameUpperCase,
            email,
            password,
          };
          const api = await fetchServerData("post", "/auth/register", data);
          if (api.status === 201) {
            localStorage.setItem("user-token", api.data.tokens.access.token);
            this.$emit("login", api.data.user);
          } else {
            console.log(api);
            if (api.data.message) this.displayError(api.data.message);
          }
        }
      } catch (error) {
        console.log(error.message);
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
        if (api.status === 200) {
          localStorage.setItem("user-token", api.data.tokens.access.token);
          this.$emit("login", api.data.user);
        } else {
          console.log(api.data.message);
          if (api.data.message) this.displayError(api.data.message);
        }
      } catch (error) {
        console.log(error.message);
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

<style scoped>
.landing {
  overflow: hidden;
}
.background-image {
  position: relative;
  /* opacity: 0.65; */
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.popcorn {
  width: 100vw;
  height: 100vh;
  background-image: url("~@/assets/popcorn.jpg");
  z-index: 10;
}

.watching {
  width: 100vw;
  height: 100vh;
  background-image: url("~@/assets/cinema.jpg");
  z-index: 9;
}
/* .watching::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.475);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(255, 255, 255, 0) 80%,
    rgba(255, 255, 255, 0) 100%
  );
} */
.logo-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.logo-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100vw;
  z-index: 10;
}
/* .tagline-container {
  z-index: 1;
  width: 100vw;
  height: 50vh;
  position: absolute;
  top: 100vh;
  left: 0;
  z-index: 9;
}
.tagline-wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9;
  color: white;
} */

.tmdb-logo-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mm-logo {
  width: 300px;
}
.tmdb-logo {
  width: 200px;
}

h3 {
  text-align: center;
  mix-blend-mode: difference;
}
.form {
  height: 60vh;
  /* z-index: 110; */
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
  padding-top: 50px;
}
.form button {
  width: 80px;
}
.tab-content {
  border: 1px solid #dee2e6;
  border-top: none;
  padding: 20px;
  /* position: relative; */
  top: -17px;
}
.register {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
}
.alert {
  display: inline-flex;
  margin-left: 20px;
}
</style>
