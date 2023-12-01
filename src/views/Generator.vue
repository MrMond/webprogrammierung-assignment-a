
<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
  <div>
    <h1 class="header-title">Meow Generator</h1>
    <image-manipulation />
    <image-uploader @display-image="handleDisplayImage" />
  </div>
</template>

<style scoped>

</style>