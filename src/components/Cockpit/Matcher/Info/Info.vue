<template>
  <div>
    <Loader v-if="loading"> </Loader>
    <!-- <b-spinner label="Spinning" v-if="loading"></b-spinner> -->
    <div class="info" v-show="loading === false">
      <img :src="backdropSource" class="backdrop" @load="loading = false" />
      <div class="filter"></div>
      <!-- <button class="x" style="float: right;" @click="$emit('close')">X</button> -->
      <!-- <img class="poster" @click="$emit('close')" :src="posterSource" alt="" /> -->
      <div class="text">
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
      </div>
      <b-button @click="$emit('close')">
        Back
      </b-button>
    </div>
  </div>
</template>

<script>
import Loader from "../../../utility/Loader";
export default {
  name: "info",
  props: ["configuration", "movie"],
  components: {
    Loader,
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {},

  methods: {},
  computed: {
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
  },
};
</script>

<style scoped>
/* .x {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  padding: 5px 9px;
} */
.info {
  /* background-color: rgb(177, 177, 177) !important; */
  padding: 20px;
  position: fixed;
  /* border: 1px solid black; */
  width: 80vw;
  /* height: 80vh; */
  top: 10vh;
  left: 10vw;

  display: flex;
}
.backdrop {
  position: absolute;
  width: 80vw;
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
  /* text-shadow: 1px 1px 1px rgb(85, 13, 85); */
}

/* .poster {
  height: 80vh;
  cursor: pointer;
} */
.list {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  padding-left: 30px;
}
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
  display: inline;
  border-radius: 10px;
  white-space: nowrap;
}
.btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
