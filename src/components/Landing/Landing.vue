<template>
  <div>
    <b-jumbotron>
      <h1>MovieMatcher</h1>
      <p>
        Tof dat je de eerste versie van moviematcher wilt testen! Als het goed
        is kan je al:
      </p>
      <p></p>
      <ul>
        <li>Een account aanmaken</li>
        <li>Vrienden toevoegen</li>
        <li>
          Films beoordelen. Als je gaat voor het hartje (swipe naar rechts op
          mobiel) dan wordt er gekeken of je een match met een vriend hebt.
          Swipe naar links als je wilt disliken.
        </li>
        <li>
          Klik op je naam en ga naar 'friends' en kijk met welke vrienden je
          welke films kunt kijken.
        </li>
      </ul>
      <p>
        Wat nog niet werkt:
      </p>
      <ul>
        <li>
          Je kunt ook aangeven dat je de film al gezien hebt (oog met streep er
          doorheen), of je kunt de film aan je favourites toevoegen (gele ster).
          Op dit moment is daar nog geen functie aan verbonden
        </li>
      </ul>
      <p>
        Check even of er geen foutjes tot nu toe inzitten.
      </p>
      <ul>
        <li>
          Als het goed is kan je een film maar 1 keer raten, daarna komt ie niet
          meer voobij
        </li>
        <li>Check of vrienden toevoegen goed werkt</li>
        <li>Designfoutjes zullen er ook misschien wel inzitten</li>
      </ul>
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
