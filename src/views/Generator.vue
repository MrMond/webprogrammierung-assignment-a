
<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
  <div class="black-background">
    <h1 class="header-title">Meow Generator</h1>
    <image-manipulation />
    <image-uploader @display-image="handleDisplayImage" />
  </div>
</template>

<style scoped>
.black-background {
  background-color: black;
  color: white;
}
</style>