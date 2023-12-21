
<template>
  <!--Erstellung von VCard als Layout der Memes. Darstellung ist abhängig von "largeView"-->
  <VCard class="mx-auto" :max-width="largeView ? 600 : 280" :height="largeView ? 'auto' : 200"
    :style="{ cursor: largeView ? 'auto' : 'pointer' }">

    <!--Darstellung des Titels, einer Trennlinie und des Memebildes-->
    <VCardTitle class="title">{{ title }}</VCardTitle>
    <VDivider />
    <VImg ref="memeImage" v-if="imgSrc" :src="imgSrc" :alt="title" :height="largeView ? '100%' : 'auto'"
      :width="largeView ? '100%' : 'auto'" />
    <div v-else class="loading-spinner" />

    <!--wenn largeView wahr ist, wird hier der LikeButton dargestellt -->
    <v-row v-if="largeView">
      <v-col>
        <span class="cardInteractable">{{ likes }} Likes</span>
        <v-btn @click="updateLikes" icon>
          <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </VCard>
</template>


<!-- Festlegen der Props der Memes: Titel, Bildquelle, Anzahl Likes, Anzeigemodus klein oder detailliert. Default setzen des Likes Buttons auf "nicht geliked"-->
<script>
//import { onMounted } from 'vue';
import { getDBLikes, addDBLikes } from '../components/localDB';
export default {
  props: ['title', 'imgSrc', 'likes', 'largeView'],
  data() {
    return {
      liked: false,
      id: null,
    };
  },

  /* Aufruf der Methode, wenn der Likebutton gedrückt wird: Erhöhung der Likes des geöffneten Memes um 1, Umstellung des Likebuttons*/
  methods: {
    async updateLikes() {
      let addLike = !(await this.isLiked()); //check if user has liked the post before
      getDBLikes().then((list) => {
        console.log(list.likedImg)
        if (addLike) { //if else keeps track wether the user has pressed the like button of the postcard before
          this.$emit('update-likes', this.likes + 1);
          this.liked = true; // Setze den Zustand des Herz-Buttons
          list.likedImg.push(this.imgSrc);
          addDBLikes(list.likedImg);
        } else {
          this.$emit('update-likes', this.likes - 1);
          this.liked = false;
          list.likedImg.splice(list.likedImg.indexOf(this.imgSrc),1);
          addDBLikes(list.likedImg); //list doesn't contain the postcard anymore
        }
      })
    },
    async isLiked() { // sets the color of the heart icon, when larger view is enabled
      return new Promise((resolve) => {
        getDBLikes().then((list) => {
          let source = this.imgSrc;
          let liked = list.likedImg.includes(source);
          console.log(`liked ${source}: ${liked}`);
          resolve(liked);
        });
      });
    },
  },
  mounted() {
    this.isLiked().then((result) => {
      this.liked = result;
    });
  }
};

</script>

<style scoped>
.title {
  font-family: 'Arial', 'serif';
}

.cardInteractable {
  font-family: 'Arial', 'serif';
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>