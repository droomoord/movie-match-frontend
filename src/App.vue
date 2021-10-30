<template>
  <div id="app">
    <router-view
      @login="login"
      :user="user"
      @signout="signout"
      :socket="socket"
      :configuration="configuration"
      @setCachedMovie="setCachedMovie"
      :cachedMovie="cachedMovie"
      @declineRequest="declineRequest"
      :key="reload"
      @changedGenre="changedGenre"
      @changedYear="changedYear"
      :genres="genres"
    />
    <Modal @close="closeModal" v-if="modal">
      <div v-if="modalType === 'request'">
        <h4>You have a new request!</h4>
        <p>
          {{ modalUser.name }}
          <b-button
            :id="modalUser.id"
            @click="acceptRequest($event)"
            variant="outline-success"
            >Accept</b-button
          ><b-button
            :id="modalUser.id"
            @click="declineRequest($event)"
            variant="outline-danger"
            >Decline</b-button
          >
        </p>
      </div>
      <div v-if="modalType === 'accept'">
        <h4>You're request to {{ modalUser.name }} got accepted!</h4>
      </div>
    </Modal>
  </div>
</template>

<script>
import fetchServerData from "./components/functions/fetchServerData";
import Modal from "./components/utility/Modal";
import moment from "moment";
export default {
  name: "App",
  data() {
    return {
      user: {},
      modalType: "",
      modal: false,
      modalUser: {},
      socket: null,
      configuration: {},
      cachedMovie: {},
      reload: 0,
      genres: [],
    };
  },

  components: { Modal },
  methods: {
    closeModal: function() {
      this.modal = false;
      this.modalUser = {};
      setTimeout(() => {
        this.reload++;
      }, 300);
    },

    setCachedMovie: function(movie) {
      this.cachedMovie = movie;
    },

    login: function(user) {
      console.log(user);
      this.user = user;
      localStorage.setItem("user-id", user.id);
      this.$router.push({ path: "/rate" });
      this.getConfigurationTMDB();
      this.wsConnect();
    },
    getUser: async function(user) {
      try {
        const api = await fetchServerData("get", `/users/${user}`);
        this.user = api.data;
        this.user.name =
          this.user.name.charAt(0).toUpperCase() + this.user.name.slice(1);
        this.$router.push({ path: "/rate" });
        this.getConfigurationTMDB();
        this.wsConnect();
      } catch (error) {
        console.log(error);
      }
    },
    acceptRequest: async function(event) {
      try {
        const api = await fetchServerData(
          "post",
          `/connect/accept/${event.currentTarget.id}`,
          { email: this.requestEmail }
        );
        this.modal = false;
        this.socket.send(
          JSON.stringify({
            type: "accept",
            data: {
              sender: {
                name: this.user.name,
                id: this.user.id,
              },
              receiver: {
                name: api.data.receiver.name,
                id: api.data.receiver.id,
              },
            },
          })
        );
      } catch (error) {
        console.log(error);

        // console.log(error.response.data.message);
        // this.error = error.response.data.message
      }
      setTimeout(() => {
        this.reload++;
      }, 300);
    },
    declineRequest: async function(event) {
      try {
        const api = await fetchServerData(
          "post",
          `/connect/decline/${event.currentTarget.id}`
        );
        this.modal = false;
        console.log(api.data);
      } catch (error) {
        console.log(error);
      }
    },

    wsConnect() {
      console.log("Initiating ws connect...");
      let WSlocation;
      if (process.env.VUE_APP_ENVIRONMENT === "local")
        WSlocation = process.env.VUE_APP_LOCAL_WS;
      else {
        const regex = /.*\/\/([\w.-]*)/;
        const url = window.location.href;
        WSlocation = "wss://" + regex.exec(url)[1] + ":8081";
      }
      this.socket = new WebSocket(WSlocation);
      this.socket.onopen = () => {
        this.socket.send(
          JSON.stringify({
            type: "login",
            data: {
              user: {
                name: this.user.name,
                id: this.user.id,
              },
            },
          })
        );
      };
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "message":
            console.log(data.data);
            break;
          case "newRequest":
            console.log(data.sender);
            if (!this.modal) {
              this.modal = true;
              this.modalType = "request";
              this.modalUser = data.sender;
            }
            break;
          case "accept":
            if (!this.modal) {
              this.newAccept = data.sender;
              this.modal = true;
              this.modalType = "accept";
              this.modalUser = data.sender;
            }
            break;
        }
      };
      this.socket.onclose = () => {
        if (Object.keys(this.user).length > 0) {
          console.log("Reconnect in 10 seconds...");
          setTimeout(() => {
            this.wsConnect();
          }, 10000);
        } else console.log("Socket disconnected");
      };
      this.socket.onerror = function(error) {
        console.log("error", error);
      };
    },
    getConfigurationTMDB: async function() {
      try {
        const api = await fetchServerData("get", "/movie/configuration");
        console.log("CONFIG", api.data);
        this.configuration.TMDB = api.data.configuration;
      } catch (error) {
        console.log(error);
      }
    },

    signout: function() {
      this.user = {};
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-token");
      this.cachedMovie = {};
      this.configuration = {};
      this.socket.close();
      this.$router.push({ path: "/" });
    },
    changedGenre: function(id, name, checked) {
      if (!checked) {
        this.user.config.genres.forEach((genre, index) => {
          if (id === genre.id) this.user.config.genres.splice(index, 1);
        });
      } else if (checked) {
        this.user.config.genres.push({ id, name });
      }
    },
    changedYear: function(type, value) {
      this.user.config.date[type] = value.toString() + "-01-01";
      if (
        moment(this.user.config.date.min).diff(this.user.config.date.max) >= 0
      ) {
        if (type === "min") {
          this.user.config.date.max = moment(this.user.config.date.min)
            .add(1, "years")
            .format("YYYY-MM-DD");
        } else if (type === "max") {
          this.user.config.date.min = moment(this.user.config.date.max)
            .subtract(1, "years")
            .format("YYYY-MM-DD");
        }
      }
    },
  },

  mounted() {
    setTimeout(() => {
      const token = localStorage.getItem("user-token");
      const user = localStorage.getItem("user-id");
      if (token && user) {
        this.getUser(user);
        const getGenres = async () => {
          try {
            const { data } = await fetchServerData("get", "/movie/genres");
            console.log(data);
            this.genres = data.genres;
          } catch (error) {
            console.log(error);
          }
        };
        getGenres();
      } else if (this.$router.history.current.path !== "/") {
        this.$router.push({ path: "/" });
      }
    }, 1000);
  },
};
</script>

<style>
:root {
  --backgroundColor: rgb(26, 26, 26);
}
@font-face {
  font-family: "Broadway";
  src: local("Broadway"),
    url(./assets/fonts/broadway/Broadway3D.ttf) format("truetype");
}
@font-face {
  font-family: "Cinema";
  src: local("Cinema"),
    url(./assets/fonts/Cinema-St/cinema_st.ttf) format("truetype");
}
body {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@media only screen and (min-width: 601px) {
  #app {
    min-height: 100vh;
    background-color: var(--backgroundColor);
    padding-top: 20px;
  }
}
</style>
