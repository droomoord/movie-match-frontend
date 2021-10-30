<template>
  <div>
    <div class="settings" v-if="user.config && genres.length > 0">
      <Navbar :user="user" @signout="$emit('signout')" />
      <b-container>
        <b-form>
          <label for="name"></label>
          <b-input-group prepend="Name:">
            <b-form-input id="name" v-model="user.name" disabled></b-form-input>
          </b-input-group>
        </b-form>
        <label for="email"></label>
        <b-input-group prepend="Email:">
          <b-form-input id="email" v-model="user.email"></b-form-input>
        </b-input-group>
        <div class="filter">
          <h4>Filter</h4>
          <label for="rating"></label>
          <b-input-group class="rating-wrapper">
            <b-form-input
              id="rating"
              v-model="user.config.rating"
              type="range"
              min="0.1"
              max="7.5"
              step="0.1"
            ></b-form-input>
            <div class="mt-2">
              Minimal IMDB rating: {{ user.config.rating }}
            </div>
          </b-input-group>
          <label for="vote-count"></label>
          <b-input-group class="vote-count-wrapper">
            <b-form-input
              id="vote-count"
              v-model="user.config.voteCount"
              type="range"
              min="0"
              max="5000"
              step="1"
            ></b-form-input>
            <div class="mt-2">
              Minimal vote count: {{ user.config.voteCount }}
            </div>
          </b-input-group>
          <div class="date-range">
            <span>Look for a movie with a production date between </span>
            <b-input-group class="date">
              <label for="date-min"></label>
              <b-form-input id="date-min" type="number" v-model="yearMin">
              </b-form-input>
            </b-input-group>
            <span>and</span>
            <b-input-group class="date">
              <label for="date-max"></label>
              <b-form-input id="date-max" type="number" v-model="yearMax">
              </b-form-input>
            </b-input-group>
          </div>
          <label for="genres"></label>
          <b-input-group id="genres">
            <b-form-checkbox
              v-for="genre in genres"
              @change="changedGenre(genre.id, genre.name, $event)"
              :checked="shouldItBeChecked(genre.id)"
              v-bind:key="genre.id"
              >{{ genre.name }}
            </b-form-checkbox>
          </b-input-group>
        </div>
      </b-container>
    </div>
    <Loader v-else></Loader>
  </div>
</template>

<script>
import fetchServerData from "../functions/fetchServerData";
import Navbar from "../Cockpit/Navbar/Navbar";
import Loader from "../utility/Loader";
export default {
  name: "settings",
  components: { Navbar, Loader },
  props: ["user"],
  data() {
    return {
      genres: [],
      changed: false,
    };
  },
  mounted() {
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
  },
  destroyed() {
    const updateSettings = async () => {
      try {
        await fetchServerData("put", `/users/${this.user.id}`, {
          config: this.user.config,
          email: this.user.email,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (this.changed) updateSettings();
  },
  watch: {
    user: {
      handler() {
        this.changed = true;
      },
      deep: true,
    },
  },
  methods: {
    shouldItBeChecked(id) {
      return this.user.config.genres
        .some((genre) => {
          return genre.id === id;
        })
        .toString();
    },
    changedGenre(id, name, checked) {
      this.$emit("changedGenre", id, name, checked);
    },
  },
  computed: {
    yearMin: {
      get: function() {
        return parseInt(this.user.config.date.min.substring(0, 4));
      },
      set: function(value) {
        this.$emit("changedYear", "min", value);
      },
    },
    yearMax: {
      get: function() {
        return parseInt(this.user.config.date.max.substring(0, 4));
      },
      set: function(value) {
        this.$emit("changedYear", "max", value);
      },
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 100px;
  background-color: white;
  border-radius: 5px;
}
#genres {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.filter {
  margin-top: 40px;
  padding: 4%;
  padding-top: 10px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.filter h4 {
  display: inline;
  position: relative;
  left: 40%;
  top: -25px;
  background-color: white;
  padding: 0 10px;
}
.rating-wrapper,
.vote-count-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.date-range {
  margin: 20px 0;
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr;
  align-items: center;
  text-align: right;
  column-gap: 10px;
}
/* 
#date-min,
#date-max {
  width: 100%;
} */
#rating,
#vote-count {
  border: none !important;
  width: 100%;
}
</style>
