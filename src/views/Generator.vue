<script setup>
// Import der beiden Vue-Komponenten, ImageUploader und ImageManipulation
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
  <!-- Hauptcontainer für die Generator Seite -->
  <div class="container-generator">
    <!-- Überschrift -->
    <h1 class="header-title">Meow Generator</h1>
    
    <!-- Komponente für die Bearbeitung der Bilder -->
    <ImageManipulation />
    
    <!-- Komponente für das Hochladen von Bildern -->
    <ImageUploader />
  </div>
</template>

<style scoped>

/*Style für main Container der Seite */
.container-generator {
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  padding-left: 2vw;
  padding-right: 2vw;
}

/*Style für die Überschrift */
.header-title {
  font-family: 'Times New Roman';
  color: black;
  margin-top: 20px;
}
</style>
