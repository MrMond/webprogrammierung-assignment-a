<template>
  <VCard
    class="mx-auto gallery-card-container"
    :max-width="largeView ? 600 : 280"
    :height="largeView ? 'auto' : 280"
    :style="{ cursor: largeView ? 'auto' : 'pointer' }"
  >
    <VCardTitle class="title">{{ title }}</VCardTitle>
    <VDivider />

    
    <VImg
      v-if="imgSrc"
      :src="imgSrc"
      :alt="title"
      :height="largeView ? '100%' : 'auto'"
      :width="largeView ? '100%' : 'auto'"
      style="object-fit: contain; object-position: center; max-width: 100%; max-height: 74%;"
    />
    <div v-else class="loading-spinner" />
    <VDivider />

    <!-- Anzeige der Likes -->
    <div v-if="!largeView" >
      <span class="cardInteractable">{{ likes }} Likes</span>
    </div>

    <!-- Like-Button, wenn largeView true ist -->
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

<script>
export default {
  props: ['title', 'imgSrc', 'likes', 'largeView'],
  data() {
    return {
      liked: false,
    };
  },

  methods: {
    incrementLikes() {
      this.$emit('update-likes', this.likes + 1);
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
