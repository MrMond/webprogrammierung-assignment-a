
<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
</script>

<template>
  <h1>Meow Generator</h1>
  <image-uploader @display-image="handleDisplayImage"/>
</template>
