<!-- PostCard.vue -->
<template>
  <VCard
      class="mx-auto"
      :max-width="largeView ? 600 : 280"
      :height="largeView ? 'auto' : 200"
      :style="{ cursor: largeView ? 'auto' : 'pointer' }"
  >
    <VCardTitle>{{ title }}</VCardTitle>
    <VDivider />
    <VImg
        v-if="imgSrc"
        :src="imgSrc"
        :alt="title"
        :height="largeView ? '100%' : 'auto'"
        :width="largeView ? '100%' : 'auto'"
    />

    <!-- Likes-Anzeige und Aktualisierung nur in der größeren Ansicht -->
    <v-row v-if="largeView">
      <v-col>
        <span>{{ likes }} Likes</span>
        <v-btn @click="incrementLikes" icon>
          <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog zur Änderung der Likes -->
    <v-dialog v-model="changeLikesDialogVisible" max-width="400">
      <v-card>
        <v-card-title>Ändere die Likes</v-card-title>
        <v-card-text>
          <v-text-field v-model="newLikes" label="Neue Anzahl" type="number" @keydown.enter="saveLikes" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveLikes">Speichern</v-btn>
          <v-btn @click="cancelLikesChange">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script>
export default {
  props: ['title', 'imgSrc', 'likes', 'largeView'],
  data() {
    return {
      changeLikesDialogVisible: false,
      newLikes: this.likes,
      liked: false,
    };
  },
  methods: {
    changeLikesDialog() {
      this.changeLikesDialogVisible = true;
    },
    saveLikes() {
      const newLikesValue = parseInt(this.newLikes);
      if (!isNaN(newLikesValue)) {
        this.$emit('update-likes', newLikesValue);
        this.changeLikesDialogVisible = false;
      }
    },
    cancelLikesChange() {
      this.changeLikesDialogVisible = false;
    },

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

</style>
