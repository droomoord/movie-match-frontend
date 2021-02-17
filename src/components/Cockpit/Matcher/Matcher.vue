<template>
  <div>
    <Loader v-if="loading"> </Loader>
    <div class="matcher" v-if="!info && !loading">
      <div class="content-wrapper">
        <div class="poster swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img
                class="poster"
                ref="poster"
                @click="clickedPoster($event)"
                :id="movie.id"
                v-if="movie.poster_path"
                v-bind:src="posterSource"
                alt=""
              />
            </div>
            <div class="test swiper-slide"></div>
          </div>
        </div>
        <div class="text-wrapper">
          <h1 class="title" v-if="movie.title">{{ movie.title }}</h1>
          <p class="overview" v-if="movie.overview">{{ movie.overview }}</p>
        </div>
      </div>
      <div class="icons">
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
          icon="eye-slash-fill"
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
    >
    </Info>
    <Modal v-if="matches" @close="closeMatchModal()">
      You've got a match for the movie
      <strong>{{ this.movie.title }}</strong> with:
      <ul>
        <li v-for="match in matches" :key="match.friend.id">
          {{ match.friend.name }}
        </li>
      </ul>
    </Modal>
  </div>
</template>

<script>
import moment from "moment";
import fetchMovieData from "../../functions/fetchMovieData";
import fetchServerData from "../../functions/fetchServerData";
import Info from "./Info/Info";
import Loader from "../../utility/Loader";
import Modal from "../../utility/Modal";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

const swiper = new Swiper(".swiper-container", {});

export default {
  name: "Matcher",
  mounted() {
    this.randomMovie();
  },
  data() {
    return {
      movie: {},
      info: false,
      movieDetails: {},
      loading: false,
      matches: null,
      swiper,
    };
  },
  props: ["user", "configuration"],
  components: { Info, Loader, Modal },

  methods: {
    clickedPoster: function(event) {
      this.info = true;
      this.getInfo(event.currentTarget.id);
      this.preloadBackdrop;
    },

    getInfo: async function(id) {
      try {
        if (this.movieDetails.id != this.movie.id) {
          const api = await fetchMovieData("get", `/movie/${id}`);
          this.movieDetails = api.data;
          console.log(api.data);
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
        this.loading = true;
        this.movieDetails = {};
        const dateMax = this.randomDate();
        const dateMin = moment(dateMax)
          .subtract(1, "years")
          .format("YYYY-MM-DD");
        console.log(
          `Looking for a movie with release date between ${dateMin} and ${dateMax}`
        );
        // &without_genres=14,18
        const api = await fetchMovieData(
          "get",
          `/discover/movie?vote_average.gte=6&vote_count.gte=1000&primary_release_date.gte=${dateMin}&primary_release_date.lte=${dateMax}`
        );
        const chosenMovie =
          api.data.results[Math.floor(api.data.results.length * Math.random())];
        // const chosenMovie = api.data.results[0];
        chosenMovie.id = chosenMovie.id.toString();
        if (
          this.user.dislikes.includes(chosenMovie.id) ||
          this.user.seen.includes(chosenMovie.id) ||
          this.user.favourites.includes(chosenMovie.id) ||
          this.user.likes.includes(chosenMovie.id)
        ) {
          setTimeout(() => {
            console.log(
              "!!!Already rated this movie, looking for another one..."
            );
            this.randomMovie();
          }, 500);
        } else {
          this.loading = false;
          this.movie = chosenMovie;
          console.log(this.movie);
        }
      } catch (error) {
        if (error.response) console.log(error.response.data);
      }
    },
    rate: async function(type) {
      try {
        console.log(this.movie);

        const api = await fetchServerData(
          "post",
          `/rate/${type}/${this.movie.id}`
        );
        if (api.status === 200) {
          this.user[type].push(this.movie.id);
          console.log(`Succesfully added to ${type} `);
          if (api.data.matches.length > 0) {
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
      this.matches = null;
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
  },
};
</script>

<style scoped>
.matcher {
  width: 100%;
}
.content-wrapper {
  width: 100%;
}
.poster {
  width: 100%;
}
.test {
  background-color: red;
  width: 100vw;
  height: 100vh;
}

@media only screen and (min-width: 601px) {
  .matcher {
    padding: 50px 20px;
    width: 800px;
    margin: auto;
    margin-top: 20px;
    background-color: white;
    height: 80vh;
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
    bottom: 10px;
    display: flex;
    margin: auto;
    width: 80vw;
    justify-content: center;
    gap: 30px;
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
</style>
