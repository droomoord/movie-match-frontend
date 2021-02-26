<template>
  <div>
    <Loader v-if="loading"> </Loader>
    <div class="info" v-show="loading === false" v-touch:tap="close">
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
      <div class="text">
        <ul class="list">
          <li>
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
          </li>
          <div></div>
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
        <h4>Overview</h4>
        <p>{{ movie.overview }}</p>
        <!-- <a
            :href="
              'https://www.imdb.com/video/vi604089881?playlistId=' +
                movie.imdb_id +
                '&ref_=tt_ov_vi'
            "
            target="_blank"
            >Watch trailer</a
          > -->
      </div>
      <b-button @click="close" class="back">
        Back
      </b-button>
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
@media only screen and (max-width: 600px) {
  ul {
    padding-left: 0;
  }

  li {
    list-style: none;
  }

  a {
    display: block;
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
    background-position: center;
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

  a {
    display: block;
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
    padding: 20px;
    position: fixed;

    width: 100vw;
    height: 56vw;

    /* left: 10vw; */
    top: 10vh;

    display: flex;
  }

  .backdrop-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -2;
  }
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.502),
      rgba(255, 255, 255, 0.523)
    );
  }

  .text {
    padding: 5px;
    margin: auto;
    font-size: 1.3em;
    text-shadow: 1px 1px 2px rgb(223, 223, 223);

    color: rgb(31, 30, 30);
  }

  .btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
