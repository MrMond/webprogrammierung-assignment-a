
<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
<v-col class="generator">
  <h1 class="header-title">Meow Generator</h1>
  <ImageManipulation />
  <ImageUploader/>
</v-col>
</template>

<style scoped>
.generator {
  max-width: 90vw;
}
</style>