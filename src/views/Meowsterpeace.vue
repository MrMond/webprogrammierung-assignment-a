<!-- Gallery.vue -->
<script setup>
import PostCard from "@/components/PostCard.vue";
</script>

<template>
  <v-container>
    <h1>Meowsterpeace Gallery</h1>
    <v-row>
      <v-col
          v-for="i in 9"
          :key="i"
          cols="auto"
      >
        <div class="gallery-card-container">
          <PostCard :title="'Post no ' + i"/>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gallery-card-container {
  width: 260px; /* Setzen Sie die gewünschte Breite für Ihre Container */
  height: 280px; /* Setzen Sie die gewünschte Höhe für Ihre Container */
  overflow: hidden;
  margin: 8px; /* Optional: Fügen Sie etwas Abstand zwischen den Containern hinzu */
}

.gallery-card-container .v-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-card-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
