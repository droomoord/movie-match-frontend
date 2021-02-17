<template>
  <div>
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
    <b-container>
      <h1>Friends</h1>
      <div>
        <b-tabs content-class="mt-3">
          <b-tab title="Friends" active @click="getFriends()"><p><ul>
        <p v-if="friends.length === 0">You don't have any friends yet! <a href="#" @click="requestModal=true">Add a friend</a> </p>
        <ul v-else>
            <li  v-for="friend in friends" v-bind:key="friend.id">
          {{ friend.name }}
        </li>
        </ul>
      </ul></p></b-tab>
          <b-tab title="Pending" @click="getFriends()">
              <p v-if="receivedRequests.length + sentRequests.length === 0">There are no pending requests right now.</p>
            <ul v-else>
                <li v-for="req in receivedRequests" v-bind:key="req.id">{{req.name}} <b-button :id="req.id"  @click="acceptRequest($event)" variant="outline-success">Accept</b-button><b-button variant="outline-danger">Decline</b-button></li>
                <li v-for="req in sentRequests" v-bind:key="req.id">{{req.name}} / Waiting his/her response...</li> 
            </ul>
          </b-tab>
        </b-tabs>
      </div>
      
      <a href="#" @click="requestModal = true">Add a friend</a>
      <br />
      <router-link to="/rate">Back</router-link>
    </b-container>
  </div>
</template>

<script>
import fetchServerData from '../functions/fetchServerData'
import Navbar from "../Cockpit/Navbar/Navbar";
import Modal from "../utility/Modal";
export default {
  name: "Friends",
  data() {
    return {
      friends: [],
      receivedRequests: [],
      sentRequests: [],
      requestModal: false,
      requestEmail: "",
      error: "",
    };
  },
  components: { Modal, Navbar },
  props: ["user", 'socket'],
  mounted() {
    const token = localStorage.getItem("user-token");
    if (!token) this.$router.push({ path: "/" });
    else {
      this.getFriends(token);
    }
  },
  methods: {
    getFriends: async function() {
      try {
        console.log('Getting friends...');
        
        const api = await fetchServerData('get', '/connect/friends')
        this.friends = api.data.friends;
        this.receivedRequests = api.data.receivedRequests;
        this.sentRequests = api.data.sentRequests

      } catch (error) {
        console.log(error);
      }
    },
    request: async function(event) {
      try {
        event.preventDefault()
        console.log('send request....');
        const api = await fetchServerData('post', '/connect/request', {email: this.requestEmail})
        if (api.status !== 200){
          this.error = api.data.message
        }
        else{
        this.closeRequestModal()
        this.getFriends()
        console.log(this.socket);
        this.socket.send(JSON.stringify({
          type: 'request',
          data: {
          sender: {
            name: this.user.name,
            id: this.user.id
          },
          receiver: {
            name: api.data.receiver.name,
            id: api.data.receiver.id
          }
        }
        }))
        this.socket.onmessage(event => {
          const data = JSON.parse(event.data);
          if (data.type === 'newRequest') this.getFriends()
        }) 
        
        
        }  
      } catch (error) {
           console.log('request', error);
           
      }
    },
    acceptRequest: async function(event) {
        try {
        const api = await fetchServerData('post', `/connect/accept/${event.currentTarget.id}`, {email: this.requestEmail})
        this.closeRequestModal()
        this.getFriends()
        console.log(api);
        this.socket.send(JSON.stringify({
          type: 'accept',
          data: {
          sender: {
            name: this.user.name,
            id: this.user.id
          },
          receiver: {
            name: api.data.receiver.name,
            id: api.data.receiver.id
          }
        }
        }))
        } catch (error) {
          console.log(error);
          
            // console.log(error.response.data.message);
            // this.error = error.response.data.message
        }
    },
    closeRequestModal: function() {
        this.requestEmail = ""
        this.error = ""
        this.requestModal = false;
    }
  },
  
};
</script>

<style>
.error{
    color: red;
}
</style>