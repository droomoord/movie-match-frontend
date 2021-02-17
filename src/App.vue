<template>
  <div id="app">
    <router-view
      @login="login"
      :user="user"
      @signout="signout"
      :socket="socket"
      :configuration="configuration"
    />
    <Modal
      @close="
        modal = false;
        modalUser = {};
      "
      v-if="modal"
    >
      <div v-if="modalType === 'request'">
        <h4>You have a new request!</h4>
        <p>
          {{ modalUser.name }}
          <b-button
            :id="modalUser.id"
            @click="acceptRequest($event)"
            variant="outline-success"
            >Accept</b-button
          ><b-button variant="outline-danger">Decline</b-button>
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
import fetchMovieData from "./components/functions/fetchMovieData";
import Modal from "./components/utility/Modal";
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
    };
  },

  components: { Modal },
  methods: {
    login: function(user) {
      console.log(user);
      this.user = user;
      this.user.name =
        this.user.name.charAt(0).toUpperCase() + this.user.name.slice(1);
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
    },

    wsConnect() {
      console.log("Initiating ws connect...");
      this.socket = new WebSocket("ws://192.168.178.21:3000");
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
            this.modal = true;
            this.modalType = "request";
            this.modalUser = data.sender;
            break;
          case "accept":
            this.newAccept = data.sender;
            this.modal = true;
            this.modalType = "accept";
            this.modalUser = data.sender;
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
        const api = await fetchMovieData("get", "/configuration");
        this.configuration.TMDB = api.data;
      } catch (error) {
        console.log(error);
      }
    },

    // getFriendRequests: async function() {
    //   try {
    //     const api = await fetchServerData("get", "/connect/requests");
    //     if (this.receivedRequests.length < api.data.receivedRequests.length) {
    //       this.receivedRequests = api.data.receivedRequests;
    //       this.modal = true;
    //     }
    //     console.log(this.receivedRequests);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    signout: function() {
      this.user = {};
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-token");
      this.socket.close();
      this.$router.push({ path: "/" });
    },
  },

  mounted() {
    const token = localStorage.getItem("user-token");
    const user = localStorage.getItem("user-id");
    if (token && user) {
      this.getUser(user);
    } else {
      this.$router.push({ path: "/" });
    }
  },
};
</script>

<style>
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
</style>
