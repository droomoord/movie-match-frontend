<template>
  <div>
    <Loader v-if="loading"> </Loader>
    <div class="matcher" v-if="!info && !loading">
      <div
        class="content-wrapper"
        v-touch:swipe="swiped"
        v-touch:tap="clickedPoster"
        v-touch:moving="touchMoving"
        v-touch:start="touchStart"
        v-touch:end="touchEnd"
      >
        <img
          class="poster"
          ref="poster"
          @click="clickedPoster"
          v-if="movie.poster_path"
          v-bind:src="posterSource"
          alt=""
        />

        <div class="text-wrapper">
          <h1 class="title" v-if="movie.title">{{ movie.title }}</h1>
          <p class="overview" v-if="movie.overview">
            <span class="inline-title"
              >{{ movie.title }} ({{ releaseYear }})</span
            >
            {{ movie.overview }}
          </p>
        </div>
      </div>

      <div class="icons" v-if="!info">
        <b-icon
          @click="rate('dislikes')"
          ref="x"
          icon="x"
          variant="dark"
          font-scale="5"
          class="rounded-circle bg-danger p2"
        ></b-icon>

        <b-icon
          @click="rate('seen')"
          icon="eye-fill"
          variant="primary"
          font-scale="5"
        ></b-icon>
        <b-icon
          @click="rate('favourites')"
          icon="star-fill"
          variant="warning"
          font-scale="5"
        ></b-icon>
        <b-icon
          @click="rate('likes')"
          icon="heart-fill"
          variant="danger"
          font-scale="5"
        ></b-icon>
      </div>
    </div>
    <Info
      v-if="info"
      @close="info = false"
      :configuration="configuration"
      :movie="movieDetails"
      :backdropSource="backdropSource"
    >
    </Info>
    <Modal v-if="matches.length > 0" @close="closeMatchModal()">
      You've got a match! <br />
      Go, and watch <strong>{{ this.movie.title }}</strong> with:
      <ul>
        <li v-for="match in matches" :key="match.friend.id">
          {{ match.friend.name }}
        </li>
      </ul>
    </Modal>
    <Modal v-if="error" @close="randomMovie">
      <div v-if="error === 'no movie found'">
        Could not find a movie that maches your criteria. Change your settings
        to get more results, or give it another go!
        <a href="#/settings"><b-button>Settings</b-button></a>
        <b-button @click="randomMovie">Refresh</b-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from "moment";
import fetchServerData from "../../functions/fetchServerData";
import Info from "./Info/Info";
import Loader from "../../utility/Loader";
import Modal from "../../utility/Modal";

export default {
  name: "Matcher",
  mounted() {
    if (Object.keys(this.cachedMovie).length === 0) this.randomMovie();
    else this.movie = this.cachedMovie;
  },
  data() {
    return {
      movie: {},
      info: false,
      movieDetails: {},
      loading: false,
      matches: [],
      swipeStart: null,
      swipeEnd: null,
      error: "",
    };
  },
  props: ["user", "configuration", "cachedMovie", "genres"],
  components: { Info, Loader, Modal },

  methods: {
    touchMoving: function(e) {
      this.swipeEnd = e.touches[0].clientX;
      const x = this.swipeEnd - this.swipeStart;

      this.$refs.poster.style.transform = `translateX(${Math.round(x)}px)`;
    },
    touchStart: function(e) {
      this.swipeStart = e.touches[0].clientX;
    },
    touchEnd: function() {
      this.$refs.poster.style.transform = "none";

      this.swipeStart = null;
      this.swipeEnd = null;
    },
    swiped(e) {
      switch (e) {
        case "left":
          this.rate("dislikes");
          break;
        case "right":
          this.rate("likes");
          break;

        default:
          break;
      }
    },

    clickedPoster: function() {
      this.info = true;
      this.getInfo(this.movie.id);
      // this.preloadBackdrop;
    },
    tapped: function() {
      this.info = true;
    },
    getInfo: async function(id) {
      try {
        if (this.movieDetails.id != this.movie.id) {
          const api = await fetchServerData("get", `/movie/single/${id}`);
          const { movie } = api.data;
          this.movieDetails = movie;
        }
      } catch (error) {
        console.log(error);
      }
    },
    randomDate: function() {
      return moment(
        new Date(+new Date() - Math.floor(Math.random() * 1.5 * 10 ** 12))
      ).format("YYYY-MM-DD");
    },
    randomMovie: async function() {
      try {
        this.error = "";
        this.loading = true;
        this.movieDetails = {};
        this.$emit("setCachedMovie", {});
        const { date, genres, rating, voteCount } = this.user.config;
        const genreIds1 = genres.map((genre) => genre.id);
        const genreIds2 = this.genres.map((genre) => genre.id);
        const filteredGenres = genreIds2.filter(
          (id) => !genreIds1.includes(id)
        );

        const query = `?rating=${rating}&voteCount=${voteCount}&dateMin=${date.min}&dateMax=${date.max}&genres=${filteredGenres}`;

        const api = await fetchServerData("get", `/movie/random${query}`);

        if (api.status === 400) {
          this.loading = false;
          this.movie = {};
          this.$emit("setCachedMovie", {});
          this.error = "no movie found";
        } else {
          const { chosenMovie } = api.data;
          this.loading = false;
          this.movie = chosenMovie;
          this.$emit("setCachedMovie", chosenMovie);
          // console.log(this.movie);
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    },
    rate: async function(type) {
      try {
        switch (type) {
          case "dislikes":
            this.$refs.poster.classList.add("move-left");
            break;
          case "likes":
            this.$refs.poster.classList.add("move-right");
            break;
          default:
            break;
        }
        console.log(this.movie);

        const api = await fetchServerData("post", `/rate/${type}`, {
          movie: {
            title: this.movie.title,
            id: this.movie.id,
          },
        });
        if (api.status === 200) {
          console.log(`Succesfully added to ${type} `);
          if (api.data.matches && api.data.matches.length > 0) {
            this.matches = api.data.matches;
          } else {
            this.randomMovie();
          }
        } else if (api.status === 401) {
          this.$emit("signout");
        } else if (api.status === 403 || api.status === 404) {
          console.log(api.error);
          this.randomMovie();
        }
        this.info = false;
      } catch (error) {
        console.log(error);
        this.randomMovie();
      }
    },
    closeMatchModal: function() {
      this.matches = [];
      this.randomMovie();
    },
  },
  computed: {
    posterSource() {
      return (
        this.configuration.TMDB.images.secure_base_url +
        "w342" +
        this.movie.poster_path
      );
    },
    backdropSource() {
      if (this.movie.backdrop_path) {
        return (
          this.configuration.TMDB.images.secure_base_url +
          "w1280" +
          this.movie.backdrop_path
        );
      } else {
        return null;
      }
    },

    releaseYear() {
      const regex = /^..../;
      return regex.exec(this.movie.release_date)[0];
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .matcher {
    width: 100%;
    height: 100%;
  }
  .content-wrapper {
    height: 80vh;
    overflow: hidden;
  }
  .poster {
    width: 100vw;
    position: fixed;
    top: 56px;
    left: 0;
    max-height: 80vh;
    z-index: -1;
    /* animation-name: slide-down;
    animation-duration: 0.5s; */
    transition: transform 0.15s;
  }
  .move-left {
    transform: translateX(-100%) !important;
  }
  .move-right {
    transform: translateX(100%) !important;
  }
  .text-wrapper {
    display: none;
  }

  .icons {
    position: fixed;
    bottom: 10px;
    left: 0;
    display: flex;
    flex-direction: row;
    width: 100vw;
    justify-content: space-around;
  }
  .icons .b-icon {
    width: 50px;
    height: 50px;
  }
}

@media only screen and (min-width: 601px) {
  .matcher {
    padding: 50px 20px;
    width: 800px;
    margin: auto;
    margin-top: 56px;
    height: 80vh;
    background-color: white;
    border-radius: 5px;
  }
  .text-wrapper {
    z-index: 1;
  }
  .content-wrapper {
    display: flex;
    justify-content: center;
    gap: 30px;
    max-height: 100%;
    /* margin-left: 5vw; */
  }

  .text-wrapper {
    /* max-width: 35%; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .text-wrapper::-webkit-scrollbar {
    display: none;
  }
  .title {
    text-align: center;
    font-family: "Broadway", Broadway;
    font-size: 3em;
  }

  .overview {
    line-height: 35px;
    font-size: 1.1em;
  }

  .poster-wrapper {
    width: 100%;
    height: 100%;
  }

  .poster {
    display: block;
    cursor: pointer;
  }

  .icons {
    position: fixed;
    bottom: 30px;
    padding-top: 20px;
    left: 0;
    display: flex;
    /* margin: auto; */
    width: 100vw;
    justify-content: center;
    gap: 30px;
    background-color: var(--backgroundColor);
  }

  .icons button,
  .icons button:hover {
    background-color: white;
    border: none;
  }

  .icons .b-icon {
    cursor: pointer;
  }

  .icons .b-icon:hover {
    transform: scale(1.1);
    transition: 0.2s;
  }
  .disliked {
    visibility: hidden;
  }
}

@keyframes slide-down {
  from {
    top: -100vh;
  }
  to {
    top: 56px;
  }
}
</style>
