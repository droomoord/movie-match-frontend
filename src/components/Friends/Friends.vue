<template>
  <div class="friends">
    <Loader v-if="loading"></Loader>
    <Navbar :user="user" @signout="$emit('signout')"></Navbar>
    <Modal v-if="requestModal" @close="closeRequestModal">
      <p>Add a friend by typing her/his email here, and clicking submit.</p>
      <b-form @submit="request">
        <b-form-group label="Email:" label-for="email">
          <b-form-input v-model="requestEmail" type="email"></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form-group>
      </b-form>
      <h4 v-if="error" class="error">{{ error }}</h4>
    </Modal>
    <Modal v-if="mutualLikesModal" @close="closeMutualLikesModal">
      <template v-if="mutualLikes.length > 0">
        <h4>You and {{ requestedFriend.name }} both like these movies:</h4>
        <ul class="mutual-movies">
          <li v-for="like in mutualLikes" :key="like.id">
            <a
              :href="'https://www.themoviedb.org/movie/' + like.id"
              target="_blank"
              >{{ like.title }}</a
            >
          </li>
        </ul>
      </template>
      <template v-else>
        <h4>
          You and {{ requestedFriend.name }} don't have any movies in common!
        </h4>
      </template>
    </Modal>

    <b-container>
      <b-card no-body>
        <b-tabs content-class="mt-3" card>
          <b-tab title="Friends" active @click="getFriends()">
            <p class="message" v-if="friends.length === 0 && !loading">
              You don't have any friends yet!
              <a href="#" @click="requestModal = true">Add a friend</a>
            </p>
            <ul v-else class="friends-list">
              <li
                v-for="friend in friends"
                v-bind:key="friend.id"
                class="friend"
              >
                <b-icon icon="person"></b-icon>
                <a href="#" @click="clickedFriend(friend.id)">{{
                  friend.name
                }}</a>
              </li>
            </ul>
          </b-tab>
          <b-tab title="Pending" @click="getFriends()">
            <p
              class="message"
              v-if="
                receivedRequests.length + sentRequests.length === 0 && !loading
              "
            >
              There are no pending requests right now.
            </p>
            <ul v-else class="requests-list">
              <li
                v-for="user in receivedRequests"
                v-bind:key="user.id"
                class="request"
              >
                <span>{{ user.name }}</span>
                <div class="buttons">
                  <b-button
                    :id="user.id"
                    @click="acceptRequest($event)"
                    variant="outline-success"
                    >Accept</b-button
                  ><b-button
                    variant="outline-danger"
                    :id="user.id"
                    @click="declineRequest($event)"
                    >Decline</b-button
                  >
                </div>
              </li>
              <li v-for="user in sentRequests" v-bind:key="user.id">
                {{ user.name }} / Waiting his/her response...
              </li>
            </ul>
          </b-tab>
        </b-tabs>
      </b-card>

      <div class="buttons">
        <router-link to="/rate"><b-button>Back</b-button></router-link>
        <b-button @click="requestModal = true">Add a friend</b-button>
      </div>
    </b-container>
  </div>
</template>

<script>
import fetchServerData from "../functions/fetchServerData";
import Navbar from "../Cockpit/Navbar/Navbar";
import Modal from "../utility/Modal";
import Loader from "../utility/Loader";

export default {
  name: "Friends",
  data() {
    return {
      friends: [],
      receivedRequests: [],
      sentRequests: [],
      requestModal: false,
      requestedFriend: {},
      mutualLikesModal: false,
      mutualLikes: [],
      requestEmail: "",
      error: "",
      loading: false,
    };
  },
  components: { Modal, Navbar, Loader },
  props: ["user", "socket"],
  mounted() {
    const token = localStorage.getItem("user-token");
    if (!token) this.$router.push({ path: "/" });
    else {
      this.getFriends(token);
    }
  },
  methods: {
    clickedFriend: async function(id) {
      try {
        const api = await fetchServerData("get", "/connect/matches/" + id);
        const { mutualLikes, friend } = api.data;
        this.mutualLikes = mutualLikes;
        this.requestedFriend = friend;
        this.mutualLikesModal = true;
      } catch (error) {
        console.log(error);
      }
    },
    closeMutualLikesModal: function() {
      this.mutualLikesModal = false;
      this.mutualLikes = [];
      this.requestedFriend = {};
    },
    getFriends: async function() {
      try {
        console.log("Getting friends...");
        this.friends = [];
        this.loading = true;
        this.receivedRequests = [];
        this.sentRequests = [];
        setTimeout(async () => {
          const api = await fetchServerData("get", "/connect/friends");
          this.loading = false;
          this.friends = api.data.friends;
          this.receivedRequests = api.data.receivedRequests;
          this.sentRequests = api.data.sentRequests;
        }, 300);
      } catch (error) {
        console.log(error);
      }
    },
    request: async function(event) {
      try {
        event.preventDefault();
        console.log("send request....");
        const api = await fetchServerData("post", "/connect/request", {
          email: this.requestEmail,
        });
        if (api.status !== 200) {
          this.error = api.data.message;
        } else {
          this.closeRequestModal();
          this.getFriends();
          console.log(this.socket);
          this.socket.send(
            JSON.stringify({
              type: "request",
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
          this.socket.onmessage((event) => {
            const data = JSON.parse(event.data);
            if (data.type === "newRequest") this.getFriends();
          });
        }
      } catch (error) {
        console.log("request", error);
      }
    },
    acceptRequest: async function(event) {
      try {
        const api = await fetchServerData(
          "post",
          `/connect/accept/${event.currentTarget.id}`,
          { email: this.requestEmail }
        );
        this.closeRequestModal();
        this.getFriends();
        console.log(api);
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
    declineRequest: function(event) {
      console.log("id:", event.currentTarget.id);

      this.$emit("declineRequest", event);
      event.currentTarget.parentElement.remove();
      setTimeout(() => {
        this.getFriends();
      }, 300);
    },
    closeRequestModal: function() {
      this.requestEmail = "";
      this.error = "";
      this.requestModal = false;
      this.getFriends();
    },
  },
};
</script>

<style scoped>
.message {
  text-align: center;
  margin-top: 100px;

  font-size: 1.2em;
}

.friends {
  margin: 20vh auto;
  background-color: white;
}
.error {
  color: red;
}
.mutual-movies {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  list-style: none;
  padding: 0;
}
ul {
  list-style: none;
  padding: 0;
  padding-left: 10px;
}
.friends-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
}
.request {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
a {
  color: black;
}
li .b-icon {
  margin-right: 10px;
}
.buttons .btn:first-child {
  margin-right: 7px;
}
.card {
  height: 400px;
}
@media only screen and (min-width: 601px) {
  .friends {
    margin: 20vh 10vw;
    border-radius: 5px;
    padding: 1em;
  }
}
</style>
