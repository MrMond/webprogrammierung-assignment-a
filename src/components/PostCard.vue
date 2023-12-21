<template>
  <!-- Vue Material Design VCard-Komponente für die Galerie -->
  <VCard
    class="mx-auto gallery-card-container"
    :max-width="largeView ? 600 : 280"
    :height="largeView ? 'auto' : 280"
    :style="{ cursor: largeView ? 'auto' : 'pointer' }"
  >
    <!-- Titel der Karte -->
    <VCardTitle class="title">{{ title }}</VCardTitle>
    <VDivider />

    <!-- Bildanzeige (falls vorhanden) mit begrenzung, damit auch hochkante Bilder in die Container passen -->
    <VImg
      v-if="imgSrc"
      :src="imgSrc"
      :alt="title"
      :height="largeView ? '100%' : 'auto'"
      :width="largeView ? '100%' : 'auto'"
      style="object-fit: contain; object-position: center; max-width: 100%; max-height: 74%;"
    />
    <!-- Lade-Spinner, falls kein Bild vorhanden ist (falls das Laden der bilder länger dauert)-->
    <div v-else class="loading-spinner" />
    <VDivider />

    <!-- Anzeige der Likes in der kleinen ansicht der Memes -->
    <div v-if="!largeView" >
      <span class="cardInteractable">{{ likes }} Likes</span>
    </div>

    <!-- Like-Button, wenn im Großbildmodus -->
    <v-row v-if="largeView">
      <v-col>
        <span class="cardInteractable">{{ likes }} Likes</span>
        <!-- Like-Button mit Herzsymbol, reagiert auf Klicks -->
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
    // Daten für den Like-Zustand des Herz-Symbols
    return {
      liked: false,
    };
  },

  methods: {
    // Methode zum Erhöhen der Like-Anzahl und Aktualisierung des Liked-Zustands
    incrementLikes() {
      this.$emit('update-likes', this.likes + 1);
      this.liked = true;
    },
  },
};
</script>

<style scoped>

/*Style für den Titel der Memes */
.title {
  font-family: 'Arial', 'serif';
}
/* Style für Interactables */
.cardInteractable {
  font-family: 'Arial', 'serif';
}

/* Stil für den Lade-Spinner */
.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

/* Animationsdefinition für den Lade-Spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
