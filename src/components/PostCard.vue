
<template>

  <!--Erstellung von VCard als Layout der Memes. Darstellung ist abhängig von "largeView"-->
  <VCard
      class="mx-auto"
      :max-width="largeView ? 600 : 280"
      :height="largeView ? 'auto' : 200"
      :style="{ cursor: largeView ? 'auto' : 'pointer' }"
  >

    <!--Darstellung des Titels, einer Trennlinie und des Memebildes-->
    <VCardTitle class="title">{{ title }}</VCardTitle>
    <VDivider />
    <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="title"
        :height="largeView ? '100%' : 'auto'"
        :width="largeView ? '100%' : 'auto'"
    />

    <!--wenn largeView wahr ist, wird hier der LikeButton dargestellt -->
    <v-row v-if="largeView">
      <v-col>
        <span class="cardInteractable">{{ likes }} Likes</span>
        <v-btn @click="incrementLikes" icon>
          <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </VCard>
</template>


<!-- Festlegen der Props der Memes: Titel, Bildquelle, Anzahl Likes, Anzeigemodus klein oder detailliert. Default setzen des Likes Buttons auf "nicht geliked"-->
<script>
export default {
  props: ['title', 'imgSrc', 'likes', 'largeView'],
  data() {
    return {
      liked: false,
    };
  },

  /* Aufruf der Methode, wenn der Likebutton gedrückt wird: Erhöhung der Likes des geöffneten Memes um 1, Umstellung des Likebuttons*/
  methods: {
    incrementLikes() {
      // Erhöhe die Likes um 1
      this.$emit('update-likes', this.likes + 1);

      // Setze den Zustand des Herz-Buttons
      this.liked = true;
    },
  },
};

</script>

<style scoped>
.title {
  font-family: 'Arial', 'serif';
}

.cardInteractable {
  font-family: 'Arial', 'serif';
}
</style>