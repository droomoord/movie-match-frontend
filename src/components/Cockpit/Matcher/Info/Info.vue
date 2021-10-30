<template>
  <div>
    <Loader v-if="loading"> </Loader>
    <div class="info" v-show="loading === false">
      <img
        :src="backdropSource"
        class="backdrop-image desktop"
        @load="loading = false"
      />
      <img
        ref="backdropMobile"
        class="backdrop-image mobile"
        @load="loading = false"
      />
      <div class="filter"></div>
      <!-- <button class="x" style="float: right;" @click="$emit('close')">X</button> -->
      <!-- <img class="poster" @click="$emit('close')" :src="posterSource" alt="" /> -->
      <div class="text" v-touch:tap="close">
        <ul class="list">
          <li>
            Original title:
          </li>
          <li>
            <strong>{{ movie.original_title }}</strong>
          </li>
          <li v-if="movie.tagline">
            Tagline:
          </li>
          <li v-if="movie.tagline">
            <strong>"{{ movie.tagline }}"</strong>
          </li>
        </ul>
        <h4>Overview</h4>
        <p>{{ movie.overview }}</p>
        <ul class="list">
          <li>
            Genres:
          </li>
          <ul>
            <li class="tag" v-for="genre in movie.genres" :key="genre.id">
              {{ genre.name }}
            </li>
          </ul>

          <li>
            Production countries:
          </li>
          <ul>
            <li
              class="tag"
              v-for="country in movie.production_countries"
              :key="country.id"
            >
              {{ country.name }}
            </li>
          </ul>
          <li>Release date:</li>

          <li>
            <strong>{{ movie.release_date }}</strong>
          </li>
          <li>Runtime:</li>

          <li>
            <strong>{{ movie.runtime }} minutes</strong>
          </li>
          <li>
            Spoken languages:
          </li>
          <ul>
            <li
              class="tag"
              v-for="language in movie.spoken_languages"
              :key="language.iso_639_1"
            >
              {{ language.english_name }}
            </li>
          </ul>
          <li>Average vote:</li>

          <li>
            <strong>{{ movie.vote_average }}</strong>
          </li>
          <li>Vote count:</li>

          <li>
            <strong>{{ movie.vote_count }}</strong>
          </li>
          <li>Popularity:</li>

          <li>
            <strong>{{ movie.popularity }}</strong>
          </li>
        </ul>

        <!-- <a
            :href="
              'https://www.imdb.com/video/vi604089881?playlistId=' +
                movie.imdb_id +
                '&ref_=tt_ov_vi'
            "
            target="_blank"
            >Watch trailer</a
          > -->

        <div class="links">
          <a
            :href="'https://www.imdb.com/title/' + movie.imdb_id"
            target="_blank"
            >View on IMDB</a
          >
          <a
            :href="'https://www.themoviedb.org/movie/' + movie.id"
            target="_blank"
            >View on TMDB</a
          >
        </div>
      </div>
      <button @click="close" class="back">
        <b-icon-arrow-left-short></b-icon-arrow-left-short>
        <!-- Back -->
      </button>
    </div>
  </div>
</template>

<script>
import Loader from "../../../utility/Loader";
export default {
  name: "info",
  props: ["configuration", "movie", "backdropSource"],
  components: {
    Loader,
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    console.log(this.backdropSource);

    this.$refs.backdropMobile.style.backgroundImage = `url(${this.backdropSource})`;
  },

  methods: {
    close: function() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.info {
  background-color: white !important;
}
img {
  z-index: 1 !important;
}
.filter {
  z-index: 2 !important;
}
.text {
  z-index: 3 !important;
}
.back {
  z-index: 2;
}
@media only screen and (max-width: 600px) {
  ul {
    padding-left: 0;
  }

  li {
    list-style: none;
  }
  .links {
    display: flex;
    justify-content: center;
    gap: 50px;
    width: 100%;
    text-shadow: none;
    font-weight: bold;
    color: #007bff;
  }
  .links a {
    z-index: 100;
  }

  .back {
    display: none;
  }
  .tag {
    background-color: rgb(216, 216, 216);
    border: 1px solid black;
    margin-right: 4px;
    padding: 3px 8px;
    display: inline-block;
    border-radius: 10px;
    white-space: nowrap;
  }
  .list {
    margin-top: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 10px;
    /* padding-left: 30px; */
  }
  .info {
    width: 100vw;
    height: 100vh;
    /* overflow: hidden; */
  }
  .backdrop-image {
    position: fixed;
    top: 0;
    left: 0;
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
  .filter {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.756);
  }
  .text {
    padding: 20px;
    width: 100vw;
    display: block;
    text-shadow: 1px 1px 5px white;

    z-index: 1;
  }
  .desktop {
    display: none;
  }
}

@media all and (min-width: 601px) {
  ul {
    padding-left: 0;
  }

  .list > *:nth-child(odd) {
    text-align: end;
  }

  li {
    list-style: none;
  }
  .links {
    display: flex;
    justify-content: center;
    gap: 50px;
    width: 100%;
    text-shadow: none;
    font-weight: bold;
    color: #007bff;
  }

  .tag {
    background-color: rgb(216, 216, 216);
    border: 1px solid black;
    margin-right: 4px;
    padding: 3px 8px;
    display: inline-block;
    border-radius: 10px;
    white-space: nowrap;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 10px;
    padding-left: 30px;
  }
  .mobile {
    display: none;
  }
  .desktop {
    display: block;
  }
  .info {
    padding: 0 100px;
    /* position: fixed; */
    width: 100vw;
    height: 100vh;

    /* left: 10vw; */
    top: 56px;

    display: flex;
  }

  .backdrop-image {
    position: fixed;
    width: 178vh;
    min-width: 100vw;
    height: 100vh;
    min-height: 716px;
    top: 0;
    left: 0;
    z-index: -2;
  }
  .filter {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    background: rgba(255, 255, 255, 0.721);
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.7) 40%,
      rgba(255, 255, 255, 0.4) 70%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .text {
    padding: 5px;
    /* margin: auto; */
    margin-top: 56px;
    font-size: 1.3em;
    text-shadow: 1px 1px 2px rgb(223, 223, 223);
    overflow: scroll;
    color: rgb(31, 30, 30);
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .text::-webkit-scrollbar {
    display: none;
  }

  .back {
    position: fixed;
    bottom: 20px;
    left: 20px;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: 3px solid rgb(11, 11, 148);
    color: rgb(11, 11, 148);
    background-color: #007bff;
    font-size: 70px;
  }
  .back:hover {
    background-color: #046bd8;
  }
  .back:hover svg {
    animation-name: move-left;
    animation-duration: 0.3s;
    animation-iteration-count: 2;
    animation-delay: 0.15s;
  }
  @keyframes move-left {
    from {
      transform: none;
    }
    to {
      transform: translateX(-5px);
    }
  }
}
</style>
